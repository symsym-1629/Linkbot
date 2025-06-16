const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require(`discord.js`);

// Catégories de commandes
const categories = {
    general: {
        name: "🛠️ Commandes Générales",
        description: "Commandes de base du bot",
        commands: [
            { name: "/test", description: "Vérifie si le bot est en ligne" },
            { name: "/help", description: "Affiche ce menu d'aide" },
            { name: "/clear", description: "Supprime un nombre de messages" },
            { name: "/removebg", description: "Retire le fond d'une image" }
        ]
    },
    music: {
        name: "🎵 Commandes Musicales",
        description: "Gestion de la musique",
        commands: [
            { name: "/play", description: "Joue une musique depuis YouTube" }
        ]
    },
    rp: {
        name: "🎭 Commandes RP",
        description: "Commandes pour le Role Play JoJo",
        commands: [
            { name: "/rp_profile", description: "Affiche les personnages d'un joueur" },
            { name: "/register", description: "Enregistre un nouveau personnage" },
            { name: "/roll", description: "Lance un dé pour les pouvoirs ou acts" },
            { name: "/kill", description: "Marque un personnage comme mort" },
            { name: "/modifyperso", description: "Modifie un personnage existant" }
        ]
    },
    admin: {
        name: "⚙️ Commandes Admin",
        description: "Commandes réservées aux administrateurs",
        commands: [
            { name: "/delete_category", description: "Supprime tous les salons d'une catégorie" }
        ]
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche le menu d\'aide des commandes')
        .addStringOption(option =>
            option.setName('commande')
                .setDescription('Commande spécifique pour plus de détails')
                .setRequired(false)
                .setAutocomplete(true)
        ),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const allCommands = Object.values(categories).flatMap(cat => cat.commands);
        const filtered = allCommands.filter(cmd => 
            cmd.name.toLowerCase().includes(focusedValue) || 
            cmd.description.toLowerCase().includes(focusedValue)
        ).slice(0, 25);
        
        await interaction.respond(
            filtered.map(cmd => ({ name: cmd.name, value: cmd.name }))
        );
    },

    async execute(interaction) {
        const specificCommand = interaction.options.getString('commande');
        
        if (specificCommand) {
            // Afficher les détails d'une commande spécifique
            const command = Object.values(categories)
                .flatMap(cat => cat.commands)
                .find(cmd => cmd.name === specificCommand);
            
            if (command) {
                const embed = new Discord.EmbedBuilder()
                    .setColor("#00F5FF")
                    .setTitle(`Commande: ${command.name}`)
                    .setDescription(command.description)
                    .setFooter({ text: "Utilisez /help pour voir toutes les commandes" });
                
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }
        }

        // Créer les boutons de navigation
        const buttons = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('help_general')
                    .setLabel('Général')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🛠️'),
                new Discord.ButtonBuilder()
                    .setCustomId('help_music')
                    .setLabel('Musique')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🎵'),
                new Discord.ButtonBuilder()
                    .setCustomId('help_rp')
                    .setLabel('RP')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('🎭'),
                new Discord.ButtonBuilder()
                    .setCustomId('help_admin')
                    .setLabel('Admin')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setEmoji('⚙️')
            );

        // Créer l'embed initial (catégorie générale par défaut)
        const embed = createCategoryEmbed(categories.general);

        const message = await interaction.reply({
            embeds: [embed],
            components: [buttons],
            ephemeral: true
        });

        // Créer le collecteur de boutons
        const collector = message.createMessageComponentCollector({
            time: 300000 // 5 minutes
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({ content: "Ces boutons ne sont pas pour vous !", ephemeral: true });
                return;
            }

            const category = i.customId.split('_')[1];
            const newEmbed = createCategoryEmbed(categories[category]);
            
            await i.update({
                embeds: [newEmbed],
                components: [buttons]
            });
        });

        collector.on('end', () => {
            // Désactiver les boutons après le timeout
            const disabledButtons = new Discord.ActionRowBuilder()
                .addComponents(
                    buttons.components.map(button => 
                        Discord.ButtonBuilder.from(button.data).setDisabled(true)
                    )
                );
            
            interaction.editReply({
                components: [disabledButtons]
            }).catch(() => {});
        });
    }
};

function createCategoryEmbed(category) {
    return new Discord.EmbedBuilder()
        .setColor("#00F5FF")
        .setTitle(category.name)
        .setDescription(category.description)
        .addFields(
            category.commands.map(cmd => ({
                name: cmd.name,
                value: cmd.description,
                inline: false
            }))
        )
        .setFooter({ 
            text: "Utilisez /help [commande] pour plus de détails sur une commande spécifique" 
        });
}