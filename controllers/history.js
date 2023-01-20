const History = require("../models/history");
const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { controller: "history" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

exports.getHistoryList = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode getHistoryList",
  });

  History.find()
    .then((list) => res.status(200).json(list))
    .catch((err) => {
      logger.log({
        level: "error",
        date: new Date(),
        message: "NOT FOUND " + err,
      });
      res.status(404).json({ message: "NOT FOUND" });
    });
};

exports.getHistory = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode getHistory" + req.params,
  });

  History.findById(req.params.id)
    .then((obj) => res.status(200).json(obj))
    .catch((err) => {
      logger.log({
        level: "error",
        date: new Date(),
        message: "NOT FOUND " + err,
      });
      res.status(404).json({ message: "NOT FOUND" });
    });
};

exports.createHistory = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode createHistory" + req.body,
  });

  let obj = new History({
    name: req.body.name,
    type: req.body.type,
    region: req.body.region,
    city: req.body.city,
    text: req.body.text,
    date: req.body.date,
    creationDate: new Date(),
    modificationDate: new Date(),
    active: true,
  });

  obj
    .save()
    .then((saved) => res.status(200).json(saved))
    .catch(() => {
      logger.log({
        level: "error",
        date: new Date(),
        message: "API REST ERROR: Pb avec la creation",
      });
      res.status(500).json({ message: "API REST ERROR: Pb avec la creation" });
    });
};

exports.updateHistory = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode updateHistory" + req.params.id + req.body,
  });

  History.findById(req.params.id)
    .then((obj) => {
      req.body.modificationDate = new Date();
      Champion.updateOne({ _id: obj.id }, req.body)
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          logger.log({
            level: "error",
            date: new Date(),
            message: "CANNOT UPDATE " + err,
          });
          res.status(500).json({ message: "CANNOT UPDATE", error: err });
        });
    })
    .catch(() => res.status(404).json({ message: "NOT FOUND" }));
};

exports.deleteHistory = (req, res, next) => {
  console.log("Méthode deleteHistory", req.params.id);
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode deleteHistory" + req.params.id,
  });

  History.findByIdAndDelete(req.params.id)
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
        message: "NOT FOUND " + err,
      });
      res.status(400).json({ message: "NOT FOUND", error: err });
    });
};
