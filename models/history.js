const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    region: [{type: mongoose.Schema.Types.ObjectId,ref: 'region',required: false}],
    city: [{type: mongoose.Schema.Types.ObjectId,ref: 'city',required: false}],
    text: {type: String, required: false},
    date: {type: Number, required: false},
    creationDate: {type: Date, required: false},
    modificationDate: {type: Date, required: false},
    active: {type: Boolean, required: false}
});

module.exports = mongoose.model('History', historySchema);