const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Material = new Schema({

    materialName: { type: String, required: true },
    KSUId: { type: String, required: true },
    dimension: { type: String, required: true },
    fullVolume: { type: String, required: true },

});

module.exports = mongoose.model('Material', Material);
