//Discord
const Discord = require("discord.js");
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
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
require("dotenv/config");

const embedt = new Discord.EmbedBuilder()
    .setColor("#00F5FF")
    .setTitle("oui mon fuhrer ?");


const embedh = new Discord.EmbedBuilder()
    .setColor("#00F5FF")
    .setTitle("**Commandes du Linkbot**")
    .setDescription("**- Le prefix du bot est ;** \n - ; test : le bot vous répond pour dire qu'il fonctionne \n - ; help : affiche toutes les commandes du bot \n - ; punchline : le bot vous renvoie une punchline gratuite pour le plaisir. Il sera possible de cibler un utilisateur dans le futur (`une punchline disponible pour le moment`) \n - ;clear [nombre] : permet de supprimer autant de messages que le nombre indiqué \n \n -`de plus certaines commandes sont en cours de dev...`");

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
      console.log(client.voice);
      if (AudioPlayerStatus.Playing) {
        console.log(AudioPlayerStatus);
        player.pause();
      }
      else {
        console.log(AudioPlayerStatus);
        player.unpause();
      }
    }
    else {
      interaction.reply({content: "Bruh je suis pas en voc tu sais ?", ephemeral: true});
    }
  }
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  //initialisation des args
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  //Commandes

  //test
  if (command === "test") {
    await message.reply({embeds: [embedt]});
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
      selfMute: false,
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
    let nbr = args[0];
       
    if (message.member.permissions.has(Discord.PermissionsBitField.Flags.ManageMessages)) {
      if (nbr) {
        await message.channel.bulkDelete(parseInt(nbr) + 1, true);
        const guild = client.guilds.cache.get("1008659270251843684");
        if (guild) {
          guild.channels.cache.get("1018477605780979802").send(`deleted ${nbr} messages in ${message.channel.name}.`);
        }
      }
      else {
        await message.reply("Bruh faudrait ptet un nombre");
      }
		}
		else {
			await message.reply("sus :eyes:");
		}
  }
});

client.login(process.env.token)