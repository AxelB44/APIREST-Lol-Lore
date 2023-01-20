const mongoose = require('mongoose');

const regionSchema = mongoose.Schema({
    name: {type: String, required: true},
    city: [{type: mongoose.Schema.Types.ObjectId,ref: 'city',required: false}],
    picture: {type: String, required: false},
    creationDate: {type: Date, required: false},
    modificationDate: {type: Date, required: false},
    active: {type: Boolean, required: false}
});

module.exports = mongoose.model('Region', regionSchema);