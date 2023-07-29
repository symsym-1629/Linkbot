const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);
const Perso = require(`../../database/models/Perso`);
require('dotenv/config');
module.exports = {
     data: new SlashCommandBuilder()
        .setName('kill')
        .setDescription('Tue un personnage')
        .addIntegerOption(option => option
            .setName('id')
            .setRequired(true)
            .setDescription('identifiant du personnage/de la fiche')
        )
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Où s\'est passé la mort ?')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('cause')
            .setDescription('Cause de la mort')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('tueur')
            .setDescription('Nom du tueur')
            .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const id = interaction.options.getInteger('id');
        const deathchannel = interaction.options.getChannel('channel');
        const cause = interaction.options.getString('cause');
        const tueur = interaction.options.getString('tueur');
        const perso = await Perso.findOne({where:{id:id}});
        if(!perso) {
            return await interaction.editReply({content:`Personnage introuvable !`});
        };
        await perso.update({dead:true});
        let channel = await interaction.guild.channels.fetch(process.env.deathChannelId);
        await channel.send({content:`> ${perso.name} tué par ${tueur} \n <#${deathchannel.id}> \n cause : ${cause}`});
        await interaction.editReply({content:`Personnage tué !`});
    },
};