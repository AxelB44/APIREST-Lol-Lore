const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { controller: "user" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

async function verify(token, req, res) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  //  const userid = payload['sub'];
  //  const userid = payload.sub;

  console.log(payload);

  User.findOne({ email: payload.email })
    .then((user) => {
      if (!user) {
        // create user
        req.body.email = payload.email;
        req.body.name = payload.name;
        req.body.password = payload.sub + new Date().getTime();
        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            let user = new User({
              email: req.body.email,
              password: hash,
              name: req.body.name,
              creationDate: new Date(),
              modificationDate: new Date(),
              active: true,
            });

            user
              .save()
              .then((saved) => res.status(200).json(saved))
              .catch(() => {
                logger.log({
                  level: "error",
                  date: new Date(),
                  message: "API REST ERROR: Pb avec la creation",
                });
                res
                  .status(500)
                  .json({ message: "API REST ERROR: Pb avec la creation" });
              });
          })
          .catch(() => {
            logger.log({
              level: "error",
              date: new Date(),
              message: "API REST ERROR: Pb avec le chiffrement",
            });
            res
              .status(500)
              .json({ message: "API REST ERROR: Pb avec le chiffrement" });
          });
      } else {
        const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
          expiresIn: "24h",
        });
        user.password = "";
        //            user.name = payload.name;
        res.status(200).json({
          token: token,
          user: user,
        });
      }
    })
    .catch((error) => {
      logger.log({
        level: "error",
        date: new Date(),
        message: "Request Error",
      });
      res.status(500).json({ message: "Request Error" });
    });
}

exports.getUserList = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "M??thode getUserList",
  });

  User.find()
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

exports.getUser = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "M??thode getUser" + req.params,
  });

  User.findById(req.params.id)
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      logger.log({
        level: "error",
        date: new Date(),
        message: "NOT FOUND " + err,
      });
      res.status(404).json({ message: "NOT FOUND" });
    });
};

exports.createUser = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "M??thode createUser",
  });

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      let user = new User({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        creationDate: new Date(),
        modificationDate: new Date(),
        active: true,
      });

      user
        .save()
        .then((saved) => res.status(200).json(saved))
        .catch(() => {
          logger.log({
            level: "error",
            date: new Date(),
            message: "API REST ERROR: Pb avec la creation",
          });
          res
            .status(500)
            .json({ message: "API REST ERROR: Pb avec la creation" });
        });
    })
    .catch(() => {
      logger.log({
        level: "error",
        date: new Date(),
        message: "API REST ERROR: Pb avec le chiffrement",
      });
      res
        .status(500)
        .json({ message: "API REST ERROR: Pb avec le chiffrement" });
    });
};

exports.login = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "M??thode login",
  });

  console.log(req.body);
  let token = req.body.token;

  if (token) {
    verify(token, req, res).catch(console.error);
  } else {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "USER RESULT NULL" });
        } else {
          bcrypt
            .compare(req.body.password, user.password)
            .then((valid) => {
              if (!valid) {
                logger.log({
                  level: "error",
                  date: new Date(),
                  message: "API REST ERROR: COMPARISON FAILED",
                });
                res
                  .status(500)
                  .json({ message: "API REST ERROR: COMPARISON FAILED" });
              } else {
                const token = jwt.sign(
                  { userId: user._id },
                  "RANDOM_TOKEN_SECRET",
                  { expiresIn: "24h" }
                );
                user.password = "";
                res.status(200).json({
                  token: token,
                  user: user,
                });
              }
            })
            .catch((err) => {
              logger.log({
                level: "error",
                date: new Date(),
                message: "API REST ERROR: COMPARISON FAILED",
              });
              res
                .status(500)
                .json({ message: "API REST ERROR: COMPARISON FAILED" });
            });
        }
      })
      .catch(() => {
        logger.log({
          level: "error",
          date: new Date(),
          message: "NOT FOUND",
        });
        res.status(404).json({ message: "NOT FOUND" });
      });
  }
};

exports.updateUser = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "M??thode updateUser " + req.params.id + req.body,
  });

  User.findById(req.params.id)
    .then((obj) => {
      req.body.modificationDate = new Date();
      User.updateOne({ _id: obj.id }, req.body)
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          logger.log({
            level: "error",
            date: new Date(),
            message: "CANNOT UPDATE "+ err,
          });
          res.status(500).json({ message: "CANNOT UPDATE", error: err })}
        );
    })
    .catch(() => res.status(404).json({ message: "NOT FOUND" }));
};

exports.deleteUser = (req, res, next) => {
  logger.log({
    level: "info",
    date: new Date(),
    message: "M??thode deleteUser " + req.params.id,
  });

  User.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        logger.log({
          level: "error",
          date: new Date(),
          message: "ALREADY DELETED",
        });
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
