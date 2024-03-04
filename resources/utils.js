// fichier contenant des fonctions utiles / globales pour les commandes

const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const Perso = require('../database/models/Perso');


const getPerso = async function getPerso(id, user, act = 0) {
    // génère un embed avec les informations du personnage rp demandé
    const element = await Perso.findOne({ where: {id: id} });
    let select = null;
    if (element.hasacts == true) {
        select = new StringSelectMenuBuilder()
            .setCustomId('act')
            .setPlaceholder(`Quel ${element.actname} voulez-vous voir ?`);
    }
    let embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(element.name);
    element.imagelink ? embed.setThumbnail(element.imagelink) : console.log("no tmb");
    embed.setAuthor({ name: `appartient à ${user.username}`, iconURL: user.displayAvatarURL()})
        .setDescription(`race : ${element.race} \n affiliation : ${element.affiliation}`)
        .addFields({ name: 'Capacités', value: `- Hamon : ${element.hamonlevel ? element.hamonlevel : "Non maitrisé"} \n- Rotation : ${element.rotationlevel ? element.rotationlevel == 4 ? "3 (rectange d'or)" : element.rotationlevel == 3 ? "3 (wekapipo)" : element.rotationlevel : "Non maitrisé"} \n- Vampirisme : ${element.vampirismelevel ? element.vampirismelevel : "Non maitrisé"}` });
    if (element.standname) {
        var args;
        let actStats = element.standstats.split(',');
        if (actStats.length > 1) {
            act == 0 ? args = element.standstats.split(',')[0].split('-') : args = element.standstats.split(',')[act].split('-');
            for (let i = 0; i < actStats.length; i++) {
                select.addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`${element.actname} ${i+1}`)
                        .setValue(`${id}-${i}`));
            }
        } else {
            args = element.standstats.split('-');
        }
        embed.addFields(
            { name: `Stand : ${element.standname}`, value: element.hasacts ? `${element.actname} ${parseInt(act)+1}` : '\u200B' },
            { name: 'Stats', value: `- Force : ${args[0]} \n- Vitesse : ${args[1]} \n- Portée : ${args[2]} \n- Durabilité : ${args[3]} \n- Précision : ${args[4]} \n- Potentiel : ${args[5]}`, inline: false },
            { name: 'Requiem', value: element.hasrequiem ? 'Oui' : 'Non', inline: true },
            { name: 'Over Heaven', value: element.hasoverheaven ? 'Oui' : 'Non', inline: true },
        )
        // select = element.hasa == true ? select : null;
    };
    
    embed.addFields({ name: 'Lien vers la fiche', value: element.ficheurl })
        .setFooter({ text: `ID : ${element.id}` });
    return [embed, select];
};

module.exports = { getPerso };