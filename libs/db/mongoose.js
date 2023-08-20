const mongoose = require('mongoose');

const libs = process.cwd() + '/libs/';

const log = require(libs + 'log')(module);

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;

db.on('error', function (err) {
    log.error('Connection error:', err.message);
});

db.once('open', function callback() {
    log.info('Connected to DB!');
});

module.exports = mongoose;
