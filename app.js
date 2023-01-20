const express = require("express");
const helmet = require('helmet'); // Configure HTTP Headers
const bodyParser = require('body-parser'); // Parse the body in an object req.body
const mongoose = require('mongoose');
const compression = require('compression'); // Compression for quick server response

const app = express()
app.use(helmet());
app.use(compression());

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, UserID, Email');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
})

const dbID = process.env.DB_ID;
const dbPW = process.env.DB_PW;
const DB = 'mongodb+srv://AxelB44:AxelB44@cluster0.495iios.mongodb.net/test';
mongoose.set("strictQuery", false);
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.log('MongoDB ERROR CONNECT', err)
    });

app.use(bodyParser.json());

//import des routes
const championRoutes = require('./routes/champion');
const cityRoutes = require('./routes/city');
const historyRoutes = require('./routes/history');
const regionRoutes = require('./routes/region');
const userRoutes = require('./routes/user');

app.use('/api/auth', userRoutes);
app.use('/api/champion', championRoutes);
app.use('/api/city', cityRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/region', regionRoutes);


module.exports = app;