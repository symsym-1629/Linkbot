const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);
const Perso = require(`../../database/models/Perso`);
module.exports = {
     data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('permet aux modos d\'ajouter la fiche d\'un joueur')
        .addStringOption(option => option
            .setName('name')
            .setDescription('Nom du personnage')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('race')
            .setDescription('La race du personnage')
            .setRequired(true)
            .addChoices(
                { name: 'Humain', value: 'humain' },
                { name: 'Vampire', value: 'vampire' },
                { name: 'Homme du pilier', value: 'homme du pilier' },
                { name: 'Autre', value: 'autre' },
            )
        )
        .addStringOption(option => option
            .setName('url')
            .setDescription('Lien vers la fiche du personnage')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('standname')
            .setDescription('Nom du stand')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('stats')
            .setDescription('Stats du stand séparées par des tirets (ex: A-B-C-B-B-S)')
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName('hasoverheaven')
            .setDescription('Le stand a-t-il un over heaven ?')
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName('user')
            .setDescription('a qui appartient le perso ?')
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName('hasrequiem')
            .setDescription('Le stand a-t-il un requiem ?')
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('hamonlevel')
            .setDescription('Niveau de maitrise du hamon')
        )
        .addIntegerOption(option => option
            .setName('vampirismelevel')
            .setDescription('Niveau de maitrise du vampirisme')
        )
        .addAttachmentOption(
            option => option
                .setName('image')
                .setDescription('Image du personnage')
        )
        .addIntegerOption(option => option
            .setName('rotationlevel')
            .setDescription('Niveau de maitrise de la rotation')
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const name = interaction.options.getString('name');
        const race = interaction.options.getString('race');
        const url = interaction.options.getString('url');
        const standName = interaction.options.getString('standname');
        const stats = interaction.options.getString('stats');
        const hasOverHeaven = interaction.options.getBoolean('hasoverheaven');
        const hasRequiem = interaction.options.getBoolean('hasrequiem');
        const hamonLevel = interaction.options.getInteger('hamonlevel');
        const vampirismeLevel = interaction.options.getInteger('vampirismelevel');
        const rotationLevel = interaction.options.getInteger('rotationlevel');
        const image = interaction.options.getAttachment('image');
        const user = interaction.options.getUser('user');

        if (!interaction.member.roles.cache.has('1008659270549651474')) return interaction.reply({content:`Vous n'avez pas la permission d'utiliser cette commande !`});
        try {
        const perso = await Perso.create({
            name: name,
            race: race,
            rotationlevel: rotationLevel ? rotationLevel : null,
            hamonlevel: hamonLevel ? hamonLevel : null,
            vampirismelevel: vampirismeLevel ? vampirismeLevel : null,
            ficheurl: url,
            hasoverheaven: hasOverHeaven,
            hasrequiem: hasRequiem,
            standname: standName,
            standstats: stats,
            imagelink: image ? image.url : null,
            userid: user.id
        });
        await interaction.editReply({content:`Le personnage ${perso.name} a bien été enregistré !`});
        } catch (error) {
            console.error(error);
            if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('Ce personnage existe déjà.');
			}

			return interaction.editReply({content: 'Something went wrong with adding a tag.', ephemeral: true});
		}
    },
};