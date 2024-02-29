const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);
const utils = require(`../../utils`);
const Perso = require(`../../../database/models/Perso`);
module.exports = {
     data: new SlashCommandBuilder()
        .setName('rp_profile')
        .setDescription('permets de voir les persos d\'un joueur')
        .addUserOption(option => option
            .setName('user')
            .setDescription('a qui appartient le perso ?')
            .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply()
        const user = await interaction.options.getUser('user');
        console.log(user.id)
        const perso = await Perso.findAll({ where: {userid: user.id, dead: false} });
        if (!perso[0]) {
            return await interaction.editReply({ content: `Ce joueur n'a pas de perso enregistré`, ephemeral: true });
        };
        // let allEmbed = [];
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
        })
        // const embeds = await Promise.all(perso.map(element => utils.getPerso(element.id, user)));
        // console.log(allEmbed);
        
    },
};