const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const libs = process.cwd() + '/libs/';

const config = require(libs + 'config');

const User = require(libs + 'model/user');
const Client = require('../model/client');
const AccessToken = require(libs + 'model/accessToken');
const RefreshToken = require(libs + 'model/refreshToken');

// 2 Client Password strategies - 1st is required, 2nd is optional
// https://tools.ietf.org/html/draft-ietf-oauth-v2-27#section-2.3.1

// Client Password - HTTP Basic authentication
passport.use(new BasicStrategy(
    function (username, password, done) {
        console.log('BasicStrategy')
        console.log('username ', username)
        console.log('password ', password)
        Client.findOne({ clientId: username }, function (err, client) {
            if (err) {
                console.log('err ', err)
                return done(err);
            }

            if (!client) {
                console.log('!client')
                return done(null, false);
            }

            if (client.clientSecret !== password) {
                console.log('client.clientSecret !== password')
                return done(null, false);
            }
            console.log('all pass')
            return done(null, client);
        });
    }
));

// Client Password - credentials in the request body
passport.use(new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
        console.log('ClientPasswordStrategy')
        Client.findOne({ clientId: clientId }, function (err, client) {
            if (err) {
                return done(err);
            }

            if (!client) {
                return done(null, false);
            }

            if (client.clientSecret !== clientSecret) {
                return done(null, false);
            }

            return done(null, client);
        });
    }
));

// Bearer Token strategy
// https://tools.ietf.org/html/rfc6750

passport.use(new BearerStrategy(
    function (accessToken, done) {
        console.log('BearerStrategy')
        console.log('accessToken ', accessToken)
        AccessToken.findOne({ token: accessToken }, function (err, token) {

            if (err) {
                console.log('err case')
                return done(err);
            }

            if (!token) {
                console.log('!token case')
                return done(null, false);
            }

            if (Math.round((Date.now() - token.created) / 1000) > config.get('security:tokenLife')) {

                AccessToken.deleteMany({ token: accessToken }, function (err) {
                    if (err) {
                        return done(err);
                    }
                });

                return done(null, false, { message: 'Token expired' });
            }

            User.findById(token.userId, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, { message: 'Unknown user' });
                }

                var info = { scope: '*' };
                return done(null, user, info);

            });
        });
    }
));
