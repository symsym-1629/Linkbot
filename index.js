//Discord
const  Discord = require("discord.js");
const client = new Discord.Client();
const prefix = ";"
const ytdl = require("ytdl-core");
require("dotenv/config");

var embedt = new Discord.MessageEmbed()
  .setColor("#00F5FF")
  .setTitle("oui mon fuhrer ?")
  .setAuthor("Linkbot")


var embedh = new Discord.MessageEmbed()
  .setColor("#00F5FF")
  .setTitle("**Commandes du Linkbot**")
  .setAuthor("Linkbot")
  .setDescription("**- Le prefix du bot est ;** \n - ; test : le bot vous répond pour dire qu'il fonctionne \n - ; help : affiche toutes les commandes du bot \n - ; punchline : le bot vous renvoie une punchline gratuite pour le plaisir. Il sera possible de cibler un utilisateur dans le futur (`une punchline disponible pour le moment`) \n - ;clear [nombre] : permet de supprimer autant de messages que le nombre indiqué \n \n -`de plus certaines commandes sont en cours de dev...`")

client.once("ready", () => {
  console.log("Linkbot est en ligne, tout roule");
});

client.on("message", async message => {
  if (message.author.bot) return;
  //initialisation des args
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //Commandes

  //test
  if (command === "test") {
    message.channel.send(embedt);
    return;
  }

  //help
  else if (command === "help") {
    message.channel.send(embedh);
    return;
  }

  //commande en dev
  else if (command === "jojo") {
    message.channel.send("commande en cours de dev, cheh \nD'ailleurs un peu gay en vrai le manga");
    return;

  }

  //commande troll
  else if (command === "punchline") {
    let punchline = [
      "Tg salarabe la commande est en cours de dev retourne jouer à ta nintendaucshwitz",
      "Autre réplique",
      "etc..."
    ];
    message.channel.send(`${punchline[Math.random() * punchline.length>>0]}`);
    return;
  }
  //commande musique
  else if (command === "play") {
    if (message.member.voice.channel) {
      message.member.voice.channel.join().then(connection => {

        let dispatcher = connection.play(ytdl(args[0], { quality: "highestaudio" }));

        dispatcher.on("finish", () => {
          dispatcher.destroy();
        });

        dispatcher.on("error", err => {
          console.log("erreur dans le disparch-truc :" + err);
        });
      }).catch(err => {
        message.reply("meh j'arrive pas à join le voc heuu :" + err);
        console.log("j'arrive pas à me co mon fuhrer");
      })
      message.reply("jsuis en voc c'est bon");
    }
    else {
      message.reply("Va en voc débile");
    }
    return;
  }

  //clear
  else if (command === "clear") {
    let nbr = args[0];
    await message.delete()
        
    if (message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
      if (nbr) {
        const { size } = await message.channel.bulkDelete(nbr, true)
        const guild = client.guilds.cache.get("1008659270251843684");
        if (guild) {
          guild.channels.cache.get("1018477605780979802").send(`Deleted ${size} messages.`);
        };
        return;
      }
      else {
        message.channel.send("Bruh faudrait ptet un nombre");
        return;
      }
		}
		else {
			message.channel.send("sus :eyes:");
      return;
		};
  };
});

client.login(process.env.token)