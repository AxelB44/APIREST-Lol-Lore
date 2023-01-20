const mongoose = require('mongoose');

const championSchema = mongoose.Schema({
    name: {type: String, required: true},
    race: {type: String, required: true},
    region: [{type: mongoose.Schema.Types.ObjectId,ref: 'region',required: false}],
    city: [{type: mongoose.Schema.Types.ObjectId,ref: 'city',required: false}],
    history: [{type: mongoose.Schema.Types.ObjectId,ref: 'history', required: false}],
    picture: {type: String, required: false},
    creationDate: {type: Date, required: false},
    modificationDate: {type: Date, required: false},
    active: {type: Boolean, required: false}
});

module.exports = mongoose.model('Champion', championSchema);