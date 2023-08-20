const mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    Client = new Schema({
        name: {
            type: String,
            unique: true,
            required: true
        },
        clientId: {
            type: String,
            unique: true,
            required: true
        },
        clientSecret: {
            type: String,
            required: true
        }
    });

// console.log('Client model', Client)

module.exports = mongoose.model('Client', Client);
