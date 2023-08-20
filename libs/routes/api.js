const express = require('express');
const passport = require('passport');
const router = express.Router();
const libs = process.cwd() + '/libs/';
const log = require(libs + 'log')(module);
const User = require(libs + 'model/user');

router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    res.json({
        msg: 'API is running',
    });
});

module.exports = router;
