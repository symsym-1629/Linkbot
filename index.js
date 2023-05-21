//Discord
const Discord = require("discord.js");
const { createAudioPlayer } = require('@discordjs/voice');
const fs = require("fs");
const myIntents = new Discord.IntentsBitField();
myIntents.add(
  Discord.IntentsBitField.Flags.Guilds, 
  Discord.IntentsBitField.Flags.GuildMessages,
  Discord.IntentsBitField.Flags.GuildMembers, 
  Discord.IntentsBitField.Flags.GuildPresences,
  Discord.IntentsBitField.Flags.MessageContent, 
  Discord.IntentsBitField.Flags.GuildVoiceStates
);
const client = new Discord.Client({
  intents: myIntents
});

const prefix = ";"

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

const JJcommandFiles = fs.readdirSync('./commands/JJ_commands').filter(file => file.endsWith('.js'));

for (const file of JJcommandFiles) {
	const command = require(`./commands/JJ_commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

require("dotenv/config");

client.once("ready", () => {
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
    }
    else if (interaction.customId === "stopButton") {
      player.stop();
      client.user.setActivity();
      interaction.reply({content: "Arrêté !", ephemeral: true});
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
  
  else if (command === "additem") {
    if (args[0]) {
      let item = args.join(" ");
      fs.readFile('items.json', 'utf8', function readFileCallback(err, data){
        err ? console.log(err) : console.log("fichier lu"); {
        obj = JSON.parse(data); //now it an object
        obj.items.push(item); //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('items.json', json, 'utf8', function(err) {
          err ? console.log(err) : console.log("fichier écrit"); // write it back 
        }); // write it back 
      }});
      message.reply("Item ajouté ! C'est le chat qui va être content !");
      
    }
  }
  else if (command === "eval") {
    if (message.author.id !== "704574286869823538") return;
    let cleaned;
    try {
      // Evaluate (execute) our input
      const evaled = eval(args.join(" "));

      // Put our eval result through the function
      // we defined above
      cleaned = await clean(client, evaled);

      // Reply in the channel with our result
      message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``);
    } catch (err) {
      // Reply in the channel with our error
      message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
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

client.login(process.env.token)
