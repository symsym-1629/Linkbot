const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require(`node:fs`);

module.exports = {
     data: new SlashCommandBuilder()
        .setName('item')
        .setDescription('Choisis un item au hasard pour le chat.'),
    async execute(interaction) {
        fs.readFile("items.json", 'utf8', async function readFileCallback(err, data) {
            if (err){
                console.log(err);
            } else {
              obj = JSON.parse(data); //now it an object
              await interaction.reply(`${obj.items[Math.random() * obj.items.length >> 0]}`);
          }});
    },
}; 