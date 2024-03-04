const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);

// commande principale pour gérer la musique
module.exports = {
     data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Joue une musique')
        .addStringOption(option => option
            .setName('requête')
            .setDescription('Nom de la recherche / url de la vidéo')
            .setRequired(true),
        ),
    async execute(interaction) {
        const rowPlay = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.ButtonBuilder()
                .setCustomId('stopButton')
                .setEmoji('⏹')
                .setStyle(Discord.ButtonStyle.Danger),
            new Discord.ButtonBuilder()
                .setCustomId('playButton')
                .setEmoji('⏯')
                .setStyle(Discord.ButtonStyle.Primary),
        );

        const { player, client } = require('../../index.js');
        const { Player } = require("discord-player");
        const { createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
        const ytdl = require('ytdl-core');

        const finder = new Player(client);
        const channel = interaction.member?.voice?.channel;
    

        if (!channel)
          return interaction.reply("Faudrait ptet rejoindre un voc d'abord");
        
        else {
          if (!channel.viewable)
            return interaction.reply("Avec la perm de voir le salon ?");
          if (!channel.joinable)
            return interaction.reply("Avec la perm de me connecter au salon ?");
          if (!channel.speakable)
            return interaction.reply("Avec la perm de parler dans le salon ?");
          if (channel.full)
            return interaction.reply("Vous pourriez au moins me faire une place...");
        }

        let request = interaction.options.getString('requête');

        const song = await finder.search(request, {
          requestedBy: interaction.author
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
        await interaction.reply({content: "C'est parti !", components: [rowPlay]});

        player.on(AudioPlayerStatus.Idle, () => {      
          player.stop();
          connection.destroy();
          client.user.setActivity();
        });
    },
};