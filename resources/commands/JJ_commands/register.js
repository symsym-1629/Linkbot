const { SlashCommandBuilder, ActionRowBuilder } = require('@discordjs/builders');
const utils = require(`../../utils`);
const Perso = require(`../../../database/models/Perso`);
require('dotenv/config');
const choices = ['Fondation Speedwagon', 'LeBlanc Coffee', 'Neutre', 'Autre'];
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
            .setName('affiliation')
            .setDescription('Affiliation du personnage')
            .setRequired(true)
            .setAutocomplete(true)
            /*.addChoices(
                { name: 'Chaos', value: 'chaos' },
                { name: 'Paix', value: 'paix' },
                { name: 'Neutre', value: 'neutre' },
                { name: 'Autre', value: 'autre' },
            )*/
        )
        .addStringOption(option => option
            .setName('url')
            .setDescription('Lien vers la fiche du personnage')
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName('user')
            .setDescription('a qui appartient le perso ?')
            .setRequired(true)
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
            .setRequired(false)
        )
        .addBooleanOption(option => option
            .setName('hasrequiem')
            .setDescription('Le stand a-t-il un requiem ?')
            .setRequired(false)
        )
        .addBooleanOption(option => option
            .setName('hasacts')
            .setDescription('Le stand est-t-il un stand à act ?')
            .setRequired(false)
        )
        .addIntegerOption(option => option
            .setName('hamonlevel')
            .setDescription('Niveau de maitrise du hamon')
            .addChoices(
                { name: '1', value: 1 },
                { name: '2', value: 2 },
                { name: '3', value: 3 },
            )
        )
        .addIntegerOption(option => option
            .setName('rotationlevel')
            .setDescription('Niveau de maitrise de la rotation')
            .addChoices(
                { name: '1', value: 1 },
                { name: '2', value: 2 },
                { name: '3 (wekapipo)', value: 3 },
                { name: '3 (rectangle d\'or)', value: 4 },
            )
        )
        .addIntegerOption(option => option
            .setName('vampirismelevel')
            .setDescription('Niveau de maitrise du vampirisme')
            .addChoices(
                { name: '1', value: 1 },
                { name: '2', value: 2 },
                { name: '3', value: 3 },
            )
        )
        .addAttachmentOption(
            option => option
            .setName('image')
            .setDescription('Image du personnage')
        ),
    async autocomplete(interaction) { // l'autocomplétion
        const focusedValue = interaction.options.getFocused(); // on récupère ce que l'utilisateur a déjà tapé
        
        // on définis tout les choix dispos
        const filtered = choices.filter(choice => choice.startsWith(focusedValue)); // on filtre les choix pour ne garder que ceux qui commencent par ce que l'utilisateur a tapé
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })), // on renvoie les choix filtrés
        ); 
    },
    async execute(interaction) {
        await interaction.deferReply();
        const name = interaction.options.getString('name');
        const race = interaction.options.getString('race');
        const affiliation = interaction.options.getString('affiliation');
        const url = interaction.options.getString('url');
        const standName = interaction.options.getString('standname');
        const stats = interaction.options.getString('stats');
        const hasOverHeaven = interaction.options.getBoolean('hasoverheaven');
        const hasRequiem = interaction.options.getBoolean('hasrequiem');
        const cpLevel = interaction.options.getInteger('cplevel');
        const hasActs = interaction.options.getBoolean('hasacts');
        const hamonLevel = interaction.options.getInteger('hamonlevel');
        const vampirismeLevel = interaction.options.getInteger('vampirismelevel');
        const rotationLevel = interaction.options.getInteger('rotationlevel');
        const image = interaction.options.getAttachment('image');
        const user = interaction.options.getUser('user');

        if (!interaction.member.roles.cache.has(process.env.validatorId)) return interaction.editReply({content:`Vous n'avez pas la permission d'utiliser cette commande !`});
        try {
            const element = await Perso.create({
                name: name,
                race: race,
                affiliation: affiliation,
                cplevel: cpLevel ? cpLevel : null,
                rotationlevel: rotationLevel ? rotationLevel : null,
                hamonlevel: hamonLevel ? hamonLevel : null,
                vampirismelevel: vampirismeLevel ? vampirismeLevel : null,
                ficheurl: url,
                hasoverheaven: hasOverHeaven ? hasOverHeaven : null,
                hasrequiem: hasRequiem ? hasRequiem : null,
                standname: standName ? standName : null,
                hasacts: hasActs ? hasActs : null,
                standstats: stats ? stats : "none-none-none-none-none-none",
                imagelink: image ? image.url : null,
                userid: user.id,
                dead: false
            });
            await interaction.editReply({content:`Le personnage ${element.name} a bien été enregistré !`});

            let value = await utils.getPerso(element.id, user);
            let guild = interaction.guild;
            let validChannel = await guild.channels.fetch(process.env.fichesChannelId);
            if (value[1] != null) {
                const row = new ActionRowBuilder().addComponents(value[1]);
                await validChannel.send({embeds: [value[0]], components: [row]});
            } else {
                await validChannel.send({embeds: [value[0]]});
            }
        } catch (error) {
            console.error(error);
            if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.editReply('Ce personnage existe déjà.');
			}

			return interaction.editReply({content: 'Something went wrong with adding a tag.', ephemeral: true});
		}
    },
};