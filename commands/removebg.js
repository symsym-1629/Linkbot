const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);
module.exports = {
     data: new SlashCommandBuilder()
        .setName('removebg')
        .setDescription('Retire le fond d\'une image')
        .addAttachmentOption(option => option
            .setName('image')
            .setDescription('Image à modifier')
            .setRequired(true),
        ),
    async execute(interaction) {
        interaction.deferReply({ephemeral: true});
        const axios = require('axios');
        const FormData = require('form-data');
        require("dotenv/config");

        const attachment = interaction.options.getAttachment('image');
        const url = attachment.url;

        let bg = await makeRequest(url);
        let buffer = Buffer.from(bg, 'base64');
        interaction.editReply({content: "voilà l'image mon reuf", files: [buffer], ephemeral: true});

        async function makeRequest(url) {
          const formData = new FormData();
          formData.append('image_url', url);
          let res = await axios.post('https://api.baseline.is/v1/background-remover/', formData, {headers: {'Authorization': `Token ${process.env.removebg}`} })
          return res.data.content;
        }
    },
};