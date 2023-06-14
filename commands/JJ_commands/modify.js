const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);
module.exports = {
     data: new SlashCommandBuilder()
        .setName('modifyperso')
        .setDescription('Permet de modifier un personnage de rp pour les modos')
        .addIntegerOption(option => option
            .setName('id')
            .setRequired(true)
            .setDescription('identifiant du personnage/de la fiche')
        )
        .addStringOption(option => option
            .setName('race')
            .setDescription('La race du personnage')
            .addChoices(
                { name: 'Humain', value: 'humain' },
                { name: 'Vampire', value: 'vampire' },
                { name: 'Homme du pilier', value: 'homme du pilier' },
                { name: 'Autre', value: 'autre' },
            )
        )
        .addUserOption(option => option
            .setName('user')
            .setDescription('a qui appartient le perso ?')
        )
        .addBooleanOption(option => option
            .setName('hasoverheaven')
            .setDescription('Le stand a-t-il un over heaven ?')
        )
        .addBooleanOption(option => option
            .setName('hasrequiem')
            .setDescription('Le stand a-t-il un requiem ?')
        )
        .addIntegerOption(option => option
            .setName('hamonlevel')
            .setDescription('Niveau de maitrise du hamon')
        )
        .addIntegerOption(option => option
            .setName('vampirismelevel')
            .setDescription('Niveau de maitrise du vampirisme')
        )
        .addIntegerOption(option => option
            .setName('rotationlevel')
            .setDescription('Niveau de maitrise de la rotation')
        ),
    async execute(interaction) {
        await interaction.reply({content:`réponse`});
    },
};