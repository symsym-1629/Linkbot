const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);

// supprime tout les salons d'une catégorie donnée
module.exports = {
     data: new SlashCommandBuilder()
        .setName('delete_category')
        .setDescription('supprime les salons d\'une catégorie')
        .setDefaultMemberPermissions(16)
        .addStringOption(option => option
            .setName('id')
            .setDescription('l\'id de la catégorie à supprimer')
            .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const id = interaction.options.getString('id');
        const category = await interaction.guild.channels.fetch();
        category.forEach(channel => {
            if (channel.parentId === id) {
                channel.delete();
            }
        });
        await interaction.editReply({content:`salons supprimés`});
    },
};