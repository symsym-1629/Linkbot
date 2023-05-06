//Discord
const Discord = require("discord.js");
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const fs = require("fs");
const axios = require('axios');
const FormData = require('form-data');
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


const { Player } = require("discord-player");
const { waitForDebugger } = require("inspector");
require("dotenv/config");

const embedt = new Discord.EmbedBuilder()
    .setColor("#00F5FF")
    .setTitle("oui mon fuhrer ?");


const embedh = new Discord.EmbedBuilder()
    .setColor("#00F5FF")
    .setTitle("**Commandes du Linkbot**")
    .setDescription("**- Le prefix du bot est ;** \n - ; test : le bot vous répond pour dire qu'il fonctionne \n - ; help : affiche toutes les commandes du bot \n - ; punchline : le bot vous renvoie une punchline gratuite pour le plaisir. Il sera possible de cibler un utilisateur dans le futur (`une punchline disponible pour le moment`) \n - ;clear [nombre] (utilisateur) : permet de supprimer autant de messages que le nombre indiqué en fonction de l'utilisateur indiqué (si vous en avez désigné un.) \n - ;removebg [image]: permet de retirer le \"blanc\" (contour) d'une image, celle qui est envoyée en pièce jointe.\n - ;play [chanson]: permet de jouer de la musique, celle que vous avez indiqué (spoiler : si vous êtes dans un salon vocal ça marche mieux) \n `de plus certaines commandes sont en cours de dev...`")
const rowPlay = new Discord.ActionRowBuilder()
    .addComponents(
        new Discord.ButtonBuilder()
            .setCustomId('playButton')
            .setEmoji('⏯')
            .setStyle(Discord.ButtonStyle.Primary),
    );

client.once("ready", () => {
  console.log("Linkbot est en ligne, tout roule");
});

client.on("error", console.error);
client.on("warn", console.warn);

const finder = new Player(client);
const player = createAudioPlayer()

client.on(Discord.Events.InteractionCreate, interaction => {
	if (!interaction.isButton()) return;

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
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  //initialisation des args
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  //Commandes

  //test
  if (command === "test") {
    await message.reply({embeds: [embedt]});
  }
  if (command === "unpause") {
    player.unpause();
  }
  if (command === "item") {
    fs.readFile('items.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log(err);
      } else {
        obj = JSON.parse(data); //now it an object
        message.reply(`${obj.items[Math.random() * obj.items.length >> 0]}`);
    }});
    
  }

  //help
  else if (command === "help") {
    await message.reply({embeds: [embedh]});
  }

  //commande en dev
  else if (command === "jojo") {
    await message.reply("commande en cours de dev, cheh \nD'ailleurs un peu gay en vrai le manga");
  }

  //commande troll
  else if (command === "punchline") {
    let punchline = [
      "Tg salarabe la commande est en cours de dev retourne jouer à ta nintendaucshwitz",
      "Autre réplique",
      "etc..."
    ];
    await message.reply(`${punchline[Math.random() * punchline.length >> 0]}`);
  }
  //commande musique
  else if (command === "play") {
    const channel = message.member?.voice?.channel;
    

    if (!channel)
      return message.reply("Faudrait ptet rejoindre un voc d'abord");
    
    else {
      if (!channel.viewable)
        return message.reply("Avec la perm de voir le salon ?");
      if (!channel.joinable)
        return message.reply("Avec la perm de me connecter au salon ?");
      if (!channel.speakable)
        return message.reply("Avec la perm de parler dans le salon ?");
      if (channel.full)
        return message.reply("Vous pourriez au moins me faire une place...");
    }

    if (!args[0])
      return message.reply("avec un truc a rechercher stp"); 
    
    let request = args.join(" ");

    const song = await finder.search(request, {
      requestedBy: message.author
    });
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false
    });
    const query = ytdl(song.tracks[0].url, { filter: 'audioonly' });
    const resource = createAudioResource(query);
    connection.subscribe(player);
    player.play(resource);
    client.user.setActivity(`${song.tracks[0].title}`, { type: Discord.ActivityType.Listening });
    await message.reply({content: "C'est parti !", components: [rowPlay]});

    player.on(AudioPlayerStatus.Idle, () => {      
      player.stop();
      connection.destroy();
      client.user.setActivity();
    });
  }
  
  //clear
  else if (command === "clear") {
    Discord.Collection.prototype.array = function() {
      return [...this.values()]
    }
    if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply('Sale délinquant'); // check if user has permission to manage messages
    let amount = parseInt(args[0]);
    await message.delete();
    const user = message.mentions.users.first();
    if (!user) {
      if (!amount) return message.channel.send('Faut un montant entre 1 et 100 mec'); // check if amount is valid
      await message.channel.bulkDelete(amount);
      message.channel.send(`Deleted ${args[0]} messages.`); // delete specified amount of messages
      deleteMessageDelayed(message);
      return;
    }

     // get amount of messages to delete
    if (isNaN(amount) || amount < 1 || amount > 100) return message.channel.send('Faut un montant entre 1 et 100 mec'); // check if amount is valid

    const messages = await message.channel.messages.fetch({ limit: 100 });
    const userMessages = messages.filter(m => m.author.id === user.id).array().slice(0, amount);

    await message.channel.bulkDelete(userMessages);
    message.channel.send(`Deleted ${userMessages.length} messages from ${user.username}.`);
    deleteMessageDelayed(message);
  }

  else if (command === "additem") {
    if (args[0]) {
      let item = args.join(" ");
      fs.readFile('items.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        obj.items.push(item); //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('items.json', json, 'utf8', function(err) {
          if (err) throw err;
          console.log('complete');
          }
        ); // write it back 
      }});
      message.reply("Item ajouté ! C'est le chat qui va être content !");
      
    }
  }
  else if (command === "removebg") {
    if (message.attachments.size > 0) {
      const attachment = message.attachments.first();
      const url = attachment.url;
      let bg = await makeRequest(url);
      let buffer = Buffer.from(bg, 'base64');
      message.reply({content: "voilà l'image mon reuf", files: [buffer]});
      return;
    }
    else {
      message.reply("Faut ptet mettre une image en pièce jointe");
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
function deleteMessageDelayed(message) {
  setTimeout(DeleteMessage, 2000);
  function DeleteMessage() {
    message.channel.bulkDelete(1);
  }
  return;
}

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

async function makeRequest(url) {
  const formData = new FormData();
  formData.append('image_url', url);
  let res = await axios.post('https://api.baseline.is/v1/background-remover/', formData, {headers: {'Authorization': `Token ${process.env.removebg}`} })
  return res.data.content;
}

client.login(process.env.token)
