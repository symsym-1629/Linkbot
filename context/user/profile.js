const Discord = require('discord.js');
const Perso = require(`../../database/models/Perso`);
module.exports = {
    data: new Discord.ContextMenuCommandBuilder()
	    .setName('See RP Profile')
	    .setType(Discord.ApplicationCommandType.User),
    async execute(interaction, user) {
        await interaction.deferReply()
        const perso = await Perso.findAll({ where: {userid: user.id, dead: false} });
        if (!perso[0]) {
            return await interaction.editReply({ content: `Ce joueur n'a pas de perso enregistré`, ephemeral: true });
        };
        let allEmbed = [];
        perso.forEach(element => {
            let embed = new Discord.EmbedBuilder()
                .setColor('Random')
                .setTitle(element.name)
                element.imagelink ? embed.setThumbnail(element.imagelink) : console.log("no tmb")
                embed.setAuthor({ name: `appartient à ${user.username}`, iconURL: user.displayAvatarURL()})
                .setDescription(`race : ${element.race} \n affiliation : ${element.affiliation}`)
                .addFields({ name: 'Capacités', value: `${element.cplevel ? `- Chaos / Paix : ${element.cplevel} \n` : "\n"}- Hamon : ${element.hamonlevel ? element.hamonlevel : "Non maitrisé"} \n- Rotation : ${element.rotationlevel ? element.rotationlevel : "Non maitrisé"} \n- Vampirisme : ${element.vampirismelevel ? element.vampirismelevel : "Non maitrisé"}` })
                if (element.standname) {
                    let args = element.standstats.split('-');
                    embed.addFields(
                        { name: `Stand : ${element.standname}`, value: '\u200B' },
                        { name: 'Stats', value: `- Force : ${args[0]} \n- Vitesse : ${args[1]} \n- Portée : ${args[2]} \n- Durabilité : ${args[3]} \n- Précision : ${args[4]} \n- Potentiel : ${args[5]}`, inline: true },
                        { name: 'Requiem', value: element.hasrequiem ? 'Oui' : 'Non', inline: true },
                        { name: 'Over Heaven', value: element.hasoverheaven ? 'Oui' : 'Non', inline: true },
                    )
                };
                embed.addFields({ name: 'Lien vers la fiche', value: element.ficheurl })
                .setFooter({ text: `ID : ${element.id}` });
            allEmbed.push(embed);
        });
        await interaction.editReply({embeds: allEmbed});
    }
};
