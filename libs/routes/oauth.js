const express = require('express');

const libs = process.cwd() + '/libs/';

const oauth2 = require(libs + 'auth/oauth2');
const log = require(libs + 'log')(module);
const router = express.Router();

//TODO
console.log('oauth2.token ', oauth2.token)
router.post('/token', oauth2.token);

module.exports = router;
