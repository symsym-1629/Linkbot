const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Vérif si le bot est en ligne !'),

	async execute(interaction) {
        const embedt = new Discord.EmbedBuilder()
            .setColor("#00F5FF")
            .setTitle("oui mon fuhrer ?")
		await interaction.reply({embeds: [embedt]});
	},
};