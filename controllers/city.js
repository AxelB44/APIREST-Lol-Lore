const City = require("../models/city");
const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { controller: "city" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

exports.getCityList = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode getCityList",
  });

  City.find()
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

exports.getCity = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode getCity" + req.params,
  });

  City.findById(req.params.id)
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

exports.createCity = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode createCity" + req.body,
  });

  let obj = new City({
    name: req.body.name,
    picture: req.body.picture,
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

exports.updateCity = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode updateCity" + req.params.id + req.body,
  });

  City.findById(req.params.id)
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

exports.deleteCity = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "Méthode deleteCity" + req.params.id,
  });

  City.findByIdAndDelete(req.params.id)
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
