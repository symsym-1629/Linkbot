const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv/config");

const JJcommands = [];
const JJcommandFiles = fs.readdirSync('./commands/JJ_commands').filter(file => file.endsWith('.js'));

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

for (const file of JJcommandFiles) {
	const command = require(`./commands/JJ_commands/${file}`);
	JJcommands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.token);

rest.put(Routes.applicationCommands(process.env.clientId), { body: commands },)
	.then(() => console.log('Successfully registered global application commands.'))
	.catch(console.error);

rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: JJcommands },)
	.then(() => console.log('Successfully registered JJRPs application commands.'))
	.catch(console.error);
