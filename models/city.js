const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
    name: {type: String, required: true},
    picture: {type: String, required: false},
    creationDate: {type: Date, required: false},
    modificationDate: {type: Date, required: false},
    active: {type: Boolean, required: false}
});

module.exports = mongoose.model('City', citySchema);