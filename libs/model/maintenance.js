const mongoose = require('mongoose');
const {tr} = require("faker/lib/locales");
const Schema = mongoose.Schema;

const Maintenance = new Schema({

    fullName: { type: String, required: true },
    shortName: { type: String, required: true },
    // periodicity: { type: String, required: true },
    // replaceableMaintenance: {
    //     type: [
    //         { type: String, required: false }
    //     ],
    //     required: true
    // },
});

module.exports = mongoose.model('Maintenance', Maintenance);