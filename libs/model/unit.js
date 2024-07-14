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
    serialNumber: { type: String, required: false},
    dateOfProduce: { type: String, required: false},
    nextScheduledMaintenanceDate: {
        type: {
            maintenanceDate: { type: String, required: true},
            maintenanceType: { type: String, required: true},
            _orderId: { type: String, required: false },
        },
        required: false, default: {}

    },
    maintenanceLog: {     // Журнал выполненных ТО
        type: [
            {
                maintenanceDate: { type: String, required: true},
                maintenanceType: { type: String, required: true},
                reasonOfMaintenance: { type: String, required: true, default: ''},
                maintenanceResult: { type: String, required: false, default: '' },
                _orderId: { type: String, required: false },
                _id: { type: String, required: true },
            }
        ],
        required: false, default: []
    },
})

module.exports = mongoose.model('Unit', Unit);