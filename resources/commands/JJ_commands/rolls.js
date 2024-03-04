const {SlashCommandBuilder} = require('@discordjs/builders');
const utils = require(`../../utils`);
const Inventory = require(`../../../database/models/Inventory`);
const { where } = require('sequelize');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Vous permet de roll le pouvoir ou l\'act')
    .addSubcommand(subcommand =>
        subcommand
            .setName('pouvoir')
            .setDescription('Voir si vous aurez de l\'onde ou de la rotation !')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('act')
            .setDescription('Voir si vous allez passer à  l\'act supérieur !')
    ), 
    async execute(interaction) {
        await interaction.deferReply();
        let userid = interaction.user.id;
        if (interaction.options.getSubcommand() == "pouvoir") {
            var rollp = Math.random()*80
            console.log(rollp)
            rollp = Math.floor(rollp)
            console.log(rollp)
            if (rollp == 1) {
                interaction.editReply("**Bravo ! On dirait bien que tu as été initié à la maîtrise de __l'onde__, ou __hamon__ !**\n\n**__De plus, ta maîtrise de cet art est diablement élevée, tu es un vrai maître de l'onde ! Ta maîtrise est si poussée que tu a pu développer ton propre style de combat, basé sur l'onde !__**\n\n```Tu n'es bien sur pas obligé d'inclure l'onde dans ta fiche. Tu peux tout simplement choisir de ne garder que le stand, ou de garder l'onde en plus, ou encore ne conserver que l'onde... Comme tu veux !```\n\nhttps://tenor.com/view/jojo-hamon-overdrive-hamon-gif-14713688")
                addCapacity("hamon3", userid)
            } else if (rollp == 2) {
                interaction.editReply("**Bravo ! On dirait bien que tu as été initié à l'art de la __rotation__, ou __spin__ !**\n\n__**De plus, tu m'as tout l'air d'être un virtuose de cet art...! Tu es même en mesure de te servir de la rotation infinie, du rectangle d'or...! Enfin, c'est mieux avec le cheval tout de même x)**__\n\n```Tu n'es bien sur pas obligé d'inclure le spin dans ta fiche. Tu peux tout simplement choisir de ne garder que le stand, ou de garder le spin en plus, ou encore ne conserver que le spin... Comme tu veux !```\n\nhttps://tenor.com/view/juan-jojo-jojo-part7-jojos-bizzare-adventure-steel-ball-run-gif-20695545")
                addCapacity("rota4", userid)
            } else if (rollp == 3) {
                interaction.editReply("**Bravo ! On dirait bien que tu as été initié à l'art de la __rotation__, ou __spin__ !**\n\n__**De plus, tu m'as tout l'air d'être un virtuose de cet art...! Tu as l'air d'être un utilisateur du style \"Wrecking Ball\" de Wekapipo... C'est rare !**__\n\n```Tu n'es bien sur pas obligé d'inclure le spin dans ta fiche. Tu peux tout simplement choisir de ne garder que le stand, ou de garder le spin en plus, ou encore ne conserver que le spin... Comme tu veux !```\n\n(et faute d'avoir un gif approprié, voici la mafia des chats apprenant le spin) :\n\nhttps://tenor.com/view/spin-record-cat-gif-21749933")
                addCapacity("rota3", userid)
            } else if (rollp >= 4 && rollp <= 9) {
                interaction.editReply("**Bravo ! On dirait bien que tu as été initié à l'art de la __rotation__, ou __spin__ !**\n\n__**Cependant, ta maîtrise de ce style de combat est bien avancée déjà... Tu commences à t'approprier les techniques de cet art complexe... Mais il te reste à apprendre !**__\n\n```Tu n'es bien sur pas obligé d'inclure le spin dans ta fiche. Tu peux tout simplement choisir de ne garder que le stand, ou de garder le spin en plus, ou encore ne conserver que le spin... Comme tu veux !```\n\nhttps://media.discordapp.net/attachments/1008659272676163657/1072232112863854692/image0.gif")
                addCapacity("rota1", userid)
            } else if (rollp >= 10 && rollp <= 15) {
                interaction.editReply("**Bravo ! On dirait bien que tu as été initié à la maîtrise de __l'onde__, ou __hamon__ !**\n\n**__Cependant, ta maîtrise de ce style de combat est... Peu avancée ! Tu découvres à peine les bases de cet art complexe.__**\n\n```Tu n'es bien sur pas obligé d'inclure l'onde dans ta fiche. Tu peux tout simplement choisir de ne garder que le stand, ou de garder l'onde en plus, ou encore ne conserver que l'onde... Comme tu veux !```\n\nhttps://tenor.com/view/sniff-smell-jojo-funny-breathing-gif-15204470")
                addCapacity("hamon1", userid)
            } else if (rollp >= 16 && rollp <= 19) {
                interaction.editReply("**Bravo ! On dirait bien que tu as été initié à la maîtrise de __l'onde__, ou __hamon__ !**\n\n**__On dirait que tu sais bien t'en servir ! Tu es loin d'en exploiter toutes les possibilités, mais tu t'appropries peu à peu cet art !__**\n\n```Tu n'es bien sur pas obligé d'inclure l'onde dans ta fiche. Tu peux tout simplement choisir de ne garder que le stand, ou de garder l'onde en plus, ou encore ne conserver que l'onde... Comme tu veux !```\n\nhttps://tenor.com/view/jo-jos-bizarre-adventure-frog-fist-gif-11650164")
                addCapacity("hamon2", userid)
            } else if (rollp >= 20 && rollp <= 23) {
                interaction.editReply("**Bravo ! On dirait bien que tu as été initié à l'art de la __rotation__, ou __spin__ !**\n\n__**Cependant, ta maîtrise de ce style de combat est bien avancée déjà... Tu commences à t'approprier les techniques de cet art complexe... Mais il te reste à apprendre !**__\n\n```Tu n'es bien sur pas obligé d'inclure le spin dans ta fiche. Tu peux tout simplement choisir de ne garder que le stand, ou de garder le spin en plus, ou encore ne conserver que le spin... Comme tu veux !```\n\nhttps://media.discordapp.net/attachments/1008659272676163657/1072232112863854692/image0.gif")
                addCapacity("rota2", userid)
            } else {
                interaction.editReply("**__On dirait bien que tu sembles posséder un stand... Sera-t-il à act ? Ou pas ? À toi de voir.__**\n\n```Tu ne maîtrises ni la rotation ni l'onde ; toutefois, rien ne t'empêches de les apprendre plus tard, en RP !```\n\nhttps://tenor.com/view/jojos-bizarre-adventure-iggy-jojo-jojos-ova-gif-25941496")
            }
        } else if (interaction.options.getSubcommand() == "act") {
            var rollp = Math.random()*2
            rollp = Math.floor(rollp)
            if (rollp == 1) {
                interaction.editReply("__**Eh bah bravo, il se trouve que tu as débloqué l'act supérieur de ton stand... Chanceux va.**__\n\n```Tu vas devoir cepandant attendre environ une semaine avant de tenter de passer un nouvel act. Bah oui sinon déverrouiller tous les acts en deux heures c'est pas marrant AH AH !```\n\nhttps://tenor.com/view/echoes-echoes-act3-jojo-bizzare-adventure-jojo-bizarre-adventure-stands-jojo-pose-gif-26125444")
            } else {
                interaction.editReply("__**Eh bien... Tu n'as pas déverrouillé d'act cette fois-ci, GROS CHEH ! BWAHAHHAHAHAHAHAHAHAAAAA...!**__\n\nhttps://tenor.com/view/iggy-gif-22109331")
            }
        }
            async function addCapacity(capacity, userid) {
            let user = await Inventory.findOne({where: { id: userid }});
            console.log(user)
            if (user) {
                let updatedCapacity = user[capacity] + 1;
                let updateObj = {};
                updateObj[capacity] = updatedCapacity;
                await user.update(updateObj);
            } else {
                let createObj = {};
                createObj.id = userid;
                createObj[capacity] = 1;
                await Inventory.create(createObj);
            }
        }
    }
}
