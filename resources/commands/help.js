const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);

// commande pour afficher les commandes du bot
module.exports = {
     data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Donne la liste des commandes'),
    async execute(interaction) {
        const embedh = new Discord.EmbedBuilder()
            .setColor("#00F5FF")
            .setTitle("**Commandes du Linkbot**")
            .setDescription("**- Le prefix du bot est ;** \n - /test : le bot vous répond pour dire qu'il fonctionne \n - /help : affiche toutes les commandes du bot \n - /clear : permet de supprimer autant de messages que le nombre indiqué en fonction de l'utilisateur indiqué (si vous en avez désigné un.) \n - /removebg : permet de retirer le \"blanc\" (contour) d'une image, celle qui est envoyée en pièce jointe.\n - /play : permet de jouer de la musique, celle que vous avez indiqué (spoiler : si vous êtes dans un salon vocal ça marche mieux) \n - /rp_profile : Affiche les persos rp d'un membre \n `de plus certaines commandes sont en cours de dev...`")

        await interaction.reply({embeds: [embedh]});
    },
};