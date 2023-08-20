const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    modified: { type: Date, default: Date.now },
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    executeId: { type: String, required: false, default: '' },
    description: { type: String, required: false, default: '' },
    orderStatus: { type: String, required: false, default: '' },
    // correctionId: { type: String, required: false, default: '' }, // № корректировки
    // consignmentNoteId: { type: String, required: false, default: '' }, // № накладной М11
    // billOfQuantities: { type: String, required: false, default: '' }, // ВОР
    // KS2Id: { type: String, required: false, default: '' }, // № КС-2
    // writeOffActId: { type: String, required: false, default: '' }, // № Акта на списание
    correctionId: {   // № корректировки
        value: { type: String, required: false, default: '' },
        status: { type: String, required: false, default: 'on_clearance'}
},
    consignmentNoteId: {   // № накладной М11
        value: { type: String, required: false, default: '' },
        status: { type: String, required: false, default: 'on_clearance'}
    },
    billOfQuantities: {    // ВОР
        value: { type: String, required: false, default: '' },
        status: { type: String, required: false, default: 'on_clearance'}
    },
    KS2Id: {   // № КС-2
        value: { type: String, required: false, default: '' },
        status: { type: String, required: false, default: 'on_clearance'}
    },
    writeOffActId: {   // № Акта на списание
        value: { type: String, required: false, default: '' },
        status: { type: String, required: false, default: 'on_clearance'}
    },
    yearOfExecution: { type: String, required: true },
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


/*
            Документ на оформлении - on_clearance - ON_CLEARANCE
            Документ ожидает отправку в СЦ - waiting_for_EC - WAITING_FOR_EC
            Документ в СЦ на согласовании - agreement_in_EC - AGREEMENT_IN_EC
            Документ распечатан, виза СЦ, ожидает подписания - awaiting_signing - AWAITING_SIGNING
            Документ передан для подписания в АБК - submitted_for_signing - SUBMITTED_FOR_SIGNING
            Документ подписан, готов к передаче в ОЦО - ready_to_transfer - READY_TO_TRANSFER
            Документ загружен в ТТС - uploaded_to_TTS - UPLOADED_TO_TTS
* */