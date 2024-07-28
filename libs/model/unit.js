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
    scheduledMaintenanceList: {
        type: [
                {
                _id: { type: String, required: true },
                fullName: { type: String, required: true },
                shortName: { type: String, required: true },
                periodicity: { type: String, required: true },
                replaceableMaintenanceId: {
                    type: [{ type: String, required: true }]
                }
            }
        ]
    },
    nextScheduledMaintenanceDate: {
        type: {
            maintenanceDate: { type: String, required: false},
            maintenanceType: { type: String, required: false},
            _orderId: { type: String, required: false },
        },
        required: false

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
        required: false
    },
})

module.exports = mongoose.model('Unit', Unit);