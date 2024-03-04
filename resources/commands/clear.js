const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);

// commande pour supprimer un nombre de message (peut être limité à un utilisateur)
module.exports = {
     data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear un nombre de message')
        .addIntegerOption(option => option
            .setName('number')
            .setDescription('nombre de message à clear')
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName('user')
            .setDescription('L\'utilisateur dont les messages seront supprimés')
            .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});
        const amount = interaction.options.getInteger('number');
        const user = interaction.options.getUser('user');
        Discord.Collection.prototype.array = function() {
            return [...this.values()]
          }
          if (!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply({content: 'Sale délinquant', ephemeral: true}); // check if user has permission to manage messages
          if (!user) {
            if (amount>100 || amount<1) return interaction.reply({content: 'Faut un montant entre 1 et 100 mec', ephemeral: true}); // check if amount is valid
            await interaction.channel.bulkDelete(amount);
            interaction.editReply({content: `Deleted ${amount} messages.`}); // delete specified amount of messages
            return;
          }
      
           // get amount of messages to delete
          if (isNaN(amount) || amount < 1 || amount > 100) return interaction.reply({content: 'Faut un montant entre 1 et 100 mec', ephemeral: true}); // check if amount is valid
      
          const messages = await interaction.channel.messages.fetch({ limit: 100 });
          const userMessages = messages.filter(m => m.author.id === user.id).array().slice(0, amount);
      
          await interaction.channel.bulkDelete(userMessages);
          interaction.editReply({content: `Deleted ${userMessages.length} messages from ${user.username}.`});
    },
};