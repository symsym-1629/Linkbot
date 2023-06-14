const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);
module.exports = {
     data: new SlashCommandBuilder()
        .setName('modifyperso')
        .setDescription('Permet de modifier un personnage de rp pour les modos'),
    async execute(interaction) {
        await interaction.reply({content:`réponse`});
    },
};