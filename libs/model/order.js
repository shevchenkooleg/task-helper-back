const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    userId: { type: String, required: true },
    modified: { type: Date, default: Date.now },
    orderId: { type: String, required: true },
    description: { type: String, required: false, default: '' },
    orderType: { type: String, required: true },
    orderExecutionType: { type: String, required: true },
    yearOfExecution: { type: String, required: true },
    orderStatus: { type: String, required: false, default: '' },

    materialCorrections: {    // Корректировки назначения материалов
        type: [
            {
                value: { type: String, required: false, default: '' },
                status: { type: String, required: false, default: 'on_clearance' },
                _orderId: { type: String, required: true },
                _id: { type: String, required: true },
            }
        ],
        required: false, default: []
    },
    consignmentNotes: {    // Накладные М11
        type: [
            {
                value: { type: String, required: false, default: '' },
                status: { type: String, required: false, default: 'on_clearance' },
                _orderId: { type: String, required: true },
                _id: { type: String, required: true },
            }
        ],
        required: false, default: []
    },
    executions: {     // Выполнения заказа
        type: [
            {
                value: { type: String, required: false, default: '' },
                status: { type: String, required: false, default: 'executing' },
                _orderId: { type: String, required: true },
                _id: { type: String, required: true },
            }
        ],
        required: false, default: []
    },
    KS2Documents: {    // Акты КС-2
        type: [
            {
                value: { type: String, required: false, default: '' },
                status: { type: String, required: false, default: 'on_clearance' },
                _executionId: { type: String, required: true },
                _id: { type: String, required: true },
            }
        ],
        required: false, default: []
    },
    writeOffDocuments: {  // Акты на списание
        type: [
            {
                value: { type: String, required: false, default: '' },
                status: { type: String, required: false, default: 'on_clearance' },
                _executionId: { type: String, required: true },
                _id: { type: String, required: true },
            }
        ],
        required: false, default: []
    },

    materials: {
        type: [
            {
                materialId: { type: String, required: true },
                quantityPerUnit: { type: String, required: true },
                totalUnitsCount: { type: String, required: true },
                totalQuantity: { type: String, required: true },
            }
        ],
        required: false, default: []
    }
});

module.exports = mongoose.model('Order', Order);

    // executeId: { type: String, required: false, default: '' },


    // correctionId: { type: String, required: false, default: '' }, // № корректировки
    // consignmentNoteId: { type: String, required: false, default: '' }, // № накладной М11
    // billOfQuantities: { type: String, required: false, default: '' }, // ВОР
    // KS2Id: { type: String, required: false, default: '' }, // № КС-2
    // writeOffActId: { type: String, required: false, default: '' }, // № Акта на списание
//     correctionId: {
//         value: { type: String, required: false, default: '' },
//         status: { type: String, required: false, default: 'on_clearance'}
// },
//     consignmentNoteId: {   // № накладной М11
//         value: { type: String, required: false, default: '' },
//         status: { type: String, required: false, default: 'on_clearance'}
//     },
//     billOfQuantities: {    // ВОР
//         value: { type: String, required: false, default: '' },
//         status: { type: String, required: false, default: 'on_clearance'}
//     },
//     KS2Id: {
//         value: { type: String, required: false, default: '' },
//         status: { type: String, required: false, default: 'on_clearance'}
//     },
//     writeOffActId: {
//         value: { type: String, required: false, default: '' },
//         status: { type: String, required: false, default: 'on_clearance'}
//     },







/*
            Документ на оформлении - on_clearance - ON_CLEARANCE
            Документ ожидает отправку в СЦ - waiting_for_EC - WAITING_FOR_EC
            Документ в СЦ на согласовании - agreement_in_EC - AGREEMENT_IN_EC
            Документ распечатан, виза СЦ, ожидает подписания - awaiting_signing - AWAITING_SIGNING
            Документ передан для подписания в АБК - submitted_for_signing - SUBMITTED_FOR_SIGNING
            Документ подписан, готов к передаче в ОЦО - ready_to_transfer - READY_TO_TRANSFER
            Документ загружен в ТТС - uploaded_to_TTS - UPLOADED_TO_TTS
* */