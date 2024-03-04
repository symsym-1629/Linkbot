const Discord = require('discord.js');
const utils = require(`../../utils.js`);
const Perso = require(`../../../database/models/Perso`);

// commande pour voir le profil rp d'un joueur mais en context menu
module.exports = {
    data: new Discord.ContextMenuCommandBuilder()
	    .setName('See RP Profile')
	    .setType(Discord.ApplicationCommandType.User),
    async execute(interaction, user) {
        await interaction.deferReply({ephemeral: true})
        const perso = await Perso.findAll({ where: {userid: user.id, dead: false} });
        if (!perso[0]) {
            return await interaction.editReply({ content: `Ce joueur n'a pas de perso enregistré`, ephemeral: true });
        };
        perso.forEach(async element => {
            let value = await utils.getPerso(element.id, user);
            // console.log(embed);
            // allEmbed.push(embed);
            if (value[1] != null) {
                const row = new Discord.ActionRowBuilder().addComponents(value[1]);
                await interaction.channel.send({embeds: [value[0]], components: [row]});
            } else {
                await interaction.channel.send({embeds: [value[0]]});
            }
        });
        await interaction.editReply({content: `Voici les persos de ${user.username}`, ephemeral: true});
    }
};
