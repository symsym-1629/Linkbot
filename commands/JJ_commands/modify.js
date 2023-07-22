const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);
const Perso = require(`../../database/models/Perso`);
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
        .addStringOption(option => option
            .setName('standname')
            .setDescription('Nom du stand')
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('stats')
            .setDescription('Stats du stand séparées par des tirets (ex: A-B-C-B-B-S)')
            .setRequired(false)
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
            .setName('cplevel')
            .setDescription('Niveau de maitrise du chaos / paix')
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
        await interaction.deferReply();
        const id = interaction.options.getInteger('id');
        const race = interaction.options.getString('race');
        const user = interaction.options.getUser('user');
        const standname = interaction.options.getString('standname');
        const stats = interaction.options.getString('standname');
        const hasoverheaven = interaction.options.getBoolean('hasoverheaven');
        const hasrequiem = interaction.options.getBoolean('hasrequiem');
        const cplevel = interaction.options.getInteger('cplevel');
        const hamonlevel = interaction.options.getInteger('hamonlevel');
        const vampirismelevel = interaction.options.getInteger('vampirismelevel');
        const rotationlevel = interaction.options.getInteger('rotationlevel');

        if (!interaction.member.roles.cache.has('1008659270549651474')) return interaction.editReply({content:`Vous n'avez pas la permission d'utiliser cette commande !`});

        const perso = await Perso.findOne({ where: {id: id} });
        if (!perso) return interaction.editReply({ content: `Ce perso n'existe pas`});
        if (!race && !user && !standname && !stats && !hasoverheaven && !hasrequiem && !cplevel && !hamonlevel && !vampirismelevel && rotationlevel) return interaction.editReply({ content: `Il faut au moins 1 argument`, ephemeral: true });
         
        if (race) {
            await perso.update({race : race}) 
            interaction.editReply({ content: `race modifiée`});
        };
        if (user) {
            await perso.update({userid : user.id}) 
            interaction.editReply({ content: `user modifiée`});
        };
        if (standname) {
            await perso.update({standname : standname}) 
            interaction.editReply({ content: `nom du stand modifié`});
        };
        if (stats) {
            await perso.update({standstats : stats}) 
            interaction.editReply({ content: `stats modifiées`});
        };
        if (hasrequiem) {
            await perso.update({hasrequiem : hasrequiem}) 
            interaction.editReply({ content: `hasrequiem modifiée`});
        };
        if (hasoverheaven) {
            await perso.update({hasoverheaven : hasoverheaven})
            interaction.editReply({ content: `hasoverheaven modifiée`});
        };
        if (cplevel) {
            await perso.update({cplevel : cplevel})
            interaction.editReply({ content: `cplevel modifiée`});
        };
        if (hamonlevel) {
            await perso.update({hamonlevel : hamonlevel}) 
            interaction.editReply({ content: `hamonlevel modifiée`});
        };
        if (vampirismelevel) {
            await perso.update({vampirismelevel : vampirismelevel}) 
            interaction.editReply({ content: `vampirismelevel modifiée`});
        };
        if (rotationlevel) {
            await perso.update({rotationlevel : rotationlevel}) 
            interaction.editReply({ content: `rotationlevel modifiée`});
        };
    },
};