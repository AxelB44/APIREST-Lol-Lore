const webhookUrl = "https://discordapp.com/api/webhooks/1064618682585718844/ii6CBqhLcO-AGXiWG3y7Q9CaGlZE0AJVjrigcv5tJ3nIgEgvGxK1r6Q1U0hd227fAYue";

exports.sendNewChampion = (req, res, next) => {
    sendMessageDiscord("Il y a un nouveau champion qui a été crée ! Viens le découvrir !");
    next();
}

exports.sendNewHistory = (req, res, next) => {
    sendMessageDiscord("Il y a une nouvelle histoire disponible, viens la lire au plus vite.");
    next();
}

exports.sendNewChampionRiot = (req, res, next) => {
    sendMessageDiscord("Il y a un nouveau champion à ajouter avec son lore.");
    next();
}

async function sendMessageDiscord(message) {
    try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          body: JSON.stringify({content: message}),
          headers: { 'Content-Type': 'application/json' },
        });
        console.log(`Message envoyé avec succès: ${response.status}`);
      } catch (error) {
        console.error(`Erreur lors de l'envoi du message: ${error}`);
      }
}