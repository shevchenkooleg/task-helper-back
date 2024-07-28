const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors')
const { queryParser } = require('express-query-parser')

const libs = process.cwd() + '/libs/';
require(libs + 'auth/auth');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

const config = require('./config');
const log = require('./log')(module);
const oauth2 = require('./auth/oauth2');

const api = require('./routes/api');
const users = require('./routes/users');
const order = require('./routes/order');
const material = require('./routes/material');
const unit = require('./routes/unit');
const maintenance = require('./routes/maintenance');





const app = express();

const corsOptions ={
    // origin: 'http://80.249.147.73/',
    origin: process.env.BASE_URL.split(','),
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());


app.use('/', api);
app.use('/api', api);
app.use('/api/users', users);
app.use('/api/order', order)
app.use('/api/unit', unit)
app.use('/api/material', material)
app.use('/api/maintenance', maintenance)
app.use('/api/oauth/token', oauth2.token);



// Разрешаем доступ к статическим файлам в папке build (где находится скомпилированный клиентский код)
app.use(express.static(path.join(__dirname, 'build')));

// Конфигурируем парсинг query-параметров http запросов

app.use(
    queryParser({
        parseNull: true,
        parseUndefined: true,
        parseBoolean: true,
        parseNumber: true
    })
)

// Любой запрос будет перенаправлен на index.html
app.get('*', (req, res) => {
    console.log('common request')
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({
        error: 'Not found'
    });
    return;
});

// Error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({
        error: err.message
    });
    return;
});

module.exports = app;
