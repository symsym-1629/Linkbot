//Discord
const Discord = require("discord.js");
const { createAudioPlayer } = require('@discordjs/voice');
const fs = require("fs");
const Perso = require("./database/models/Perso.js");
const database = require("./database/database.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const myIntents = new Discord.IntentsBitField();
const package = require("./package.json");
const utils = require(`./resources/utils.js`);
require("dotenv/config");

myIntents.add(Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildMessages, Discord.IntentsBitField.Flags.GuildMembers, Discord.IntentsBitField.Flags.GuildPresences, Discord.IntentsBitField.Flags.MessageContent, Discord.IntentsBitField.Flags.GuildVoiceStates);
const client = new Discord.Client({
  intents: myIntents
});

const prefix = ";"

client.commands = new Discord.Collection();
client.contextCommands = new Discord.Collection();
const commands = [];
const commandFiles = fs.readdirSync('./resources/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./resources/commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}
const JJcommands = [];
const JJcommandFiles = fs.readdirSync('./resources/commands/JJ_commands').filter(file => file.endsWith('.js'));

for (const file of JJcommandFiles) {
	const command = require(`./resources/commands/JJ_commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
  JJcommands.push(command.data.toJSON());
}

const userContextCommandFiles = fs.readdirSync('./resources/context/user').filter(file => file.endsWith('.js'));
for (const file of userContextCommandFiles) {
  const command = require(`./resources/context/user/${file}`);
  client.contextCommands.set(command.data.name, command);
  JJcommands.push(command.data.toJSON());
}

client.once("ready", async () => {
  register(commands, JJcommands);
  try {
    await Perso.sync();
    await database.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  let guild = await client.guilds.fetch(process.env.guildId);
  let logChannel = await guild.channels.fetch(process.env.logChannelId);
  await logChannel.send({content:`Linkbot@${package.version} est en ligne, tout roule`});
  console.log("Linkbot est en ligne, tout roule");
});

client.on("error", console.error);
client.on("warn", console.warn);

const player = createAudioPlayer()

module.exports = {player : player, client : client};

client.on(Discord.Events.InteractionCreate, async interaction => {
  console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
	if (interaction.isButton()) {
	  if (interaction.customId === "playButton") {
      if (client.voice) {
        if (player.state.status == "paused") {
          player.unpause();
          interaction.reply({content: "Remis !", ephemeral: true});
        }
        else {
          player.pause();
          interaction.reply({content: "Pausé !", ephemeral: true});
        }
      }
      else {
        interaction.reply({content: "Bruh je suis pas en voc tu sais ?", ephemeral: true});
      }
    } else if (interaction.customId === "stopButton") {
      player.stop();
      client.user.setActivity();
      interaction.reply({content: "Arrêté !", ephemeral: true});
    }
  } else if (interaction.isStringSelectMenu()) {
    let values = interaction.values[0].split("-");
    // values = ["id", "act"]
    const perso = await Perso.findOne({ where: {id: values[0]} });
    console.log(perso.userid);
    let user = await client.users.fetch(perso.userid);
    //let user = await guild.members.fetch(userid);
    let val = await utils.getPerso(values[0], user, values[1]);
    // val = [embed, select]
    let row = new Discord.ActionRowBuilder()
      .addComponents(val[1]);
    interaction.update({embeds: [val[0]], components: [row], ephemeral: true});

  }
  else if (interaction.isUserContextMenuCommand()) {
    const command = client.contextCommands.get(interaction.commandName);
    if (!command) return;
    try {
      const user = interaction.targetUser;
      await command.execute(interaction, user);
    } catch (error) {
      console.error(error);
      await interaction.reply({content: 'Il y a eu une erreur en essayant d\'exécuter cette commande !', ephemeral: true});
    }
  }
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({content: 'Il y a eu une erreur en essayant d\'exécuter cette commande !', ephemeral: true});
  }
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  //initialisation des args
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'test') {
    message.reply("ça marche");
  }
  
  else if (command === "eval") {
    message.delete();
    if (message.author.id !== "922457431940935691") return;
    let returned = args.shift().toLowerCase();
    let cleaned;
    if (returned == "true") {
      try {
        // Evaluate (execute) our input
        const evaled = eval(args.join(" "));

        // Put our eval result through the function
        // we defined above
        cleaned = await clean(client, evaled);

        // Reply in the channel with our result
        message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
        return;
      } catch (err) {
        // Reply in the channel with our error
        message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
      }
    } if (returned == "false") {
      try {
        // Evaluate (execute) our input
        eval(args.join(" "));
        return;
      } catch (err) {
        // Reply in the channel with our error
        message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
      }
    } else {
      message.channel.send("Il manque le returned true/false");
    }
  }
});
const clean = async (client, text) => {
  // If our input is a promise, await it before continuing
  if (text && text.constructor.name == "Promise")
    text = await text;
  
  // If the response isn't a string, `util.inspect()`
  // is used to 'stringify' the code in a safe way that
  // won't error out on objects with circular references
  // (like Collections, for example)
  if (typeof text !== "string")
    text = require("util").inspect(text, { depth: 1 });
  
  // Replace symbols with character code alternatives
  text = text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203))
    .replaceAll(client.token, "[REDACTED]");
  
  // Send off the cleaned up result
  return text;
}
function register(commands, JJcommands) {
  const rest = new REST({ version: '9' }).setToken(process.env.token);

  rest.put(Routes.applicationCommands(process.env.clientId), { body: commands },)
  	.then(() => console.log('Successfully registered global application commands.'))
  	.catch(console.error);

  rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), { body: JJcommands },)
  	.then(() => console.log('Successfully registered JJRPs application commands.'))
  	.catch(console.error);
  return;
}
function unregister() {
  const rest = new REST({ version: '9' }).setToken(process.env.token);

  rest.put(Routes.applicationCommands(process.env.clientId), { body: [] })
  	.then(() => console.log('Successfully deleted all application commands.'))
  	.catch(console.error);
  return;
}

client.login(process.env.token)
