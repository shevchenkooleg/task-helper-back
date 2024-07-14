const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Unit = new Schema({
    unitName: { type: String, required: true },
    modified: { type: Date, default: Date.now },
    parentId: { type: String, required: false, default: null },
    unitType: { type: String, required: true },
    unitModel: { type: String, required: false },
    unitKKS: { type: String, required: false },
    toroKKS: { type: String, required: false },
    nestingLevel: { type: Number, required: true, default: 0 },
    serialNumber: { type: String, required: false, default: '' },
    dateOfProduce: { type: String, required: false, default: '' },
    lastMaintenanceDate: { type: String, required: false, default: '' },
    nextMaintenanceDate: { type: String, required: false, default: '' },
})

module.exports = mongoose.model('Unit', Unit);