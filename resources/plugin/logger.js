const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Création du dossier logs s'il n'existe pas
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Configuration des formats de log
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Configuration des transports (où les logs seront stockés)
const transports = [
    // Logs d'erreur
    new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
    // Logs de debug
    new winston.transports.File({
        filename: path.join(logDir, 'debug.log'),
        level: 'debug',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
    // Logs d'information
    new winston.transports.File({
        filename: path.join(logDir, 'info.log'),
        level: 'info',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    })
];

// Ajout des logs console en développement
if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    );
}

// Création du logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: transports,
    // Gestion des exceptions non capturées
    exceptionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'exceptions.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ],
    // Gestion des rejets de promesses non capturés
    rejectionHandlers: [
        new winston.transports.File({
            filename: path.join(logDir, 'rejections.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ]
});

// Fonction pour obtenir les logs d'un fichier spécifique
async function getLogs(logType = 'debug', lines = 50) {
    const logFile = path.join(logDir, `${logType}.log`);
    
    if (!fs.existsSync(logFile)) {
        return 'Aucun fichier de log trouvé pour ce type.';
    }

    try {
        const content = await fs.promises.readFile(logFile, 'utf8');
        const logLines = content.split('\n').filter(line => line.trim());
        return logLines.slice(-lines).join('\n');
    } catch (error) {
        logger.error('Erreur lors de la lecture des logs:', error);
        return 'Erreur lors de la lecture des logs.';
    }
}

// Fonction pour nettoyer les anciens logs
async function cleanLogs(daysToKeep = 7) {
    const files = await fs.promises.readdir(logDir);
    const now = Date.now();
    
    for (const file of files) {
        const filePath = path.join(logDir, file);
        const stats = await fs.promises.stat(filePath);
        const fileAge = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        if (fileAge > daysToKeep) {
            await fs.promises.unlink(filePath);
            logger.info(`Fichier de log supprimé: ${file}`);
        }
    }
}

module.exports = {
    logger,
    getLogs,
    cleanLogs
}; 