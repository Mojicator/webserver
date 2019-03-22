const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let imageSchema = new Schema({
    name: {
        type: String,
    },
    legend: {
        type: String,
    },
    isVideo: {
        type: Boolean
    },
    source: {
        type: String
    },
    tag: [String]
});

let albumSchema = new Schema({
    name: {
        type: String,
    },
    legend: {
        type: String
    },
    date: {
        type: Date,
    },
    thumnail: {
        type: String
    },
    upLoadedBy: {
        type: String
    },
    content: {
        type: [imageSchema]
    }
});

module.exports = mongoose.model('Album', albumSchema);