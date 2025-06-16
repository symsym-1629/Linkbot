const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { getLogs, cleanLogs, logger } = require('../plugin/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('debug')
        .setDescription('Gestion des logs du bot')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('Affiche les logs')
                .addStringOption(option =>
                    option.setName('type')
                        .setDescription('Type de logs à afficher')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Debug', value: 'debug' },
                            { name: 'Info', value: 'info' },
                            { name: 'Error', value: 'error' },
                            { name: 'Exceptions', value: 'exceptions' },
                            { name: 'Rejections', value: 'rejections' }
                        )
                )
                .addIntegerOption(option =>
                    option.setName('lignes')
                        .setDescription('Nombre de lignes à afficher (max 100)')
                        .setRequired(false)
                        .setMinValue(1)
                        .setMaxValue(100)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('clean')
                .setDescription('Nettoie les anciens logs')
                .addIntegerOption(option =>
                    option.setName('jours')
                        .setDescription('Nombre de jours de logs à conserver')
                        .setRequired(false)
                        .setMinValue(1)
                        .setMaxValue(30)
                )
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'view') {
                const logType = interaction.options.getString('type');
                const lines = interaction.options.getInteger('lignes') || 50;

                const logs = await getLogs(logType, lines);
                
                if (logs.length > 4000) {
                    // Si les logs sont trop longs, on les divise en plusieurs messages
                    const chunks = logs.match(/.{1,4000}/g);
                    await interaction.editReply({
                        content: `**Logs ${logType} (${chunks.length} parties):**`,
                        ephemeral: true
                    });

                    for (let i = 0; i < chunks.length; i++) {
                        await interaction.followUp({
                            content: `**Partie ${i + 1}/${chunks.length}:**\n\`\`\`json\n${chunks[i]}\n\`\`\``,
                            ephemeral: true
                        });
                    }
                } else {
                    await interaction.editReply({
                        content: `**Logs ${logType}:**\n\`\`\`json\n${logs}\n\`\`\``,
                        ephemeral: true
                    });
                }
            } 
            else if (subcommand === 'clean') {
                const daysToKeep = interaction.options.getInteger('jours') || 7;
                await cleanLogs(daysToKeep);
                await interaction.editReply({
                    content: `Les logs plus anciens que ${daysToKeep} jours ont été supprimés.`,
                    ephemeral: true
                });
            }
        } catch (error) {
            logger.error('Erreur dans la commande debug:', error);
            await interaction.editReply({
                content: 'Une erreur est survenue lors de l\'exécution de la commande.',
                ephemeral: true
            });
        }
    }
}; 