const Champion = require("../models/champion");
const Notification = require("../middlewares/notification");
const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { controller: "Champion" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

exports.getChampionList = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode getChampionList",
  });

  Champion.find()
    .then((list) => res.status(200).json(list))
    .catch((err) => {
      logger.log({
        level: "error",
        date: new Date(),
        message: "NOT FOUND " + err,
      });
      res.status(404).json({ message: "NOT FOUND" });
    });
  checkNewChampion();
};

exports.getChampion = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode getChampion" + req.params,
  });

  Champion.findById(req.params.id)
    .then((obj) => res.status(200).json(obj))
    .catch((err) => {
      logger.log({
        level: "error",
        date: new Date(),
        message: "NOT FOUND " + err,
      });
      res.status(404).json({ message: "NOT FOUND" });
    });
  checkNewChampion();
};

exports.createChampion = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode createChampion" + req.body,
  });

  let obj = new Champion({
    name: req.body.name,
    race: req.body.race,
    region: req.body.region,
    city: req.body.city,
    history: req.body.history,
    picture: req.body.picture,
    creationDate: new Date(),
    modificationDate: new Date(),
    active: true,
  });

  obj
    .save()
    .then((saved) => res.status(200).json(saved))
    .catch((err) => {
      logger.log({
        level: "error",
        date: new Date(),
        message: "API REST ERROR: Pb avec la creation" + err,
      });
      res.status(500).json({ message: "API REST ERROR: Pb avec la creation" });
    });
  checkNewChampion();
};

exports.updateChampion = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode updateChampion" + req.params.id + req.body,
  });

  Champion.findById(req.params.id)
    .then((obj) => {
      req.body.modificationDate = new Date();
      Champion.updateOne({ _id: obj.id }, req.body)
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          logger.log({
            level: "error",
            date: new Date(),
            message: "CANNOT UPDATE" + err,
          });
          res.status(500).json({ message: "CANNOT UPDATE", error: err });
        });
    })
    .catch(() => res.status(404).json({ message: "NOT FOUND" }));
  checkNewChampion();
};

exports.deleteChampion = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode deleteChampion" + req.params.id,
  });

  Champion.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(500).json({ message: "ALREADY DELETED" });
      }
    })
    .catch((err) => {
      logger.log({
        level: "error",
        date: new Date(),
        message: "NOT FOUND" + err,
      });
      res.status(400).json({ message: "NOT FOUND", error: err });
    });
  checkNewChampion();
};

const LOLChampionURL =
  "https://ddragon.leagueoflegends.com/cdn/13.1.1/data/fr_FR/champion.json";

async function checkNewChampion() {
  try {
    const response = await fetch(LOLChampionURL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const championNamesRiot = Object.values(response).map(
      (profile) => profile.name
    );
    const championNamesBDD = [];
    Champion.find()
      .then((list) => championNamesBDD.push(list.name))
      .catch((err) => {
        console.log(err);
      });
    if ((championNamesBDD.length = !championNamesRiot.length)) {
      /*let diff1 = tableau1.filter(val => !tableau2.includes(val))
      let diff2 = tableau2.filter(val => !tableau1.includes(val))

      let diffFinale = diff1.concat(diff2);*/
      Notification.sendNewChampionRiot();
    }
  } catch (error) {
    console.error(`Erreur lors de l'envoi du message: ${error}`);
  }
}
