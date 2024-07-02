const express = require('express');
const passport = require('passport');
const router = express.Router();
const libs = process.cwd() + '/libs/';
const User = require(libs + 'model/user');
const log = require(libs + 'log')(module);
const db = require(libs + 'db/mongoose');

router.post('/create', function (req, res){

    console.log('req ', req)

    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    });

    newUser.save(function (err, user) {
        if (!err) {
            log.info('New user - %s:%s', user.username, user.password);
        } else {
            return log.error(err);
        }
    });
    res.json({
        message: 'New user created successfully',
        username: req.body.username,
        password: req.body.password,
    });
})

router.get('/info', passport.authenticate('bearer', { session: false }),
    function (req, res) {
        // req.authInfo is set using the `info` argument supplied by
        // `BearerStrategy`. It is typically used to indicate scope of the token,
        // and used in access control checks. For illustrative purposes, this
        // example simply returns the scope in the response.
        res.json({
            user_id: req.user.userId,
            userName: req.user.username,
            scope: req.authInfo.scope,
            roles: req.user.roles,
            userCredentials: req.user.userCredentials
        });
    }
);

router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    User.find(function (err, users) {
        if (!err) {
            return res.json(users);
        } else {
            res.statusCode = 500;

            log.error('Internal error(%d): %s', res.statusCode, err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
});

module.exports = router;
