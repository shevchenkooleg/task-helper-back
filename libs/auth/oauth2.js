const oauth2orize = require('oauth2orize');
const passport = require('passport');
const crypto = require('crypto');

const libs = process.cwd() + '/libs/';

const config = require(libs + 'config');
const log = require(libs + 'log')(module);

const db = require(libs + 'db/mongoose');
const User = require(libs + 'model/user');
const AccessToken = require(libs + 'model/accessToken');
const RefreshToken = require(libs + 'model/refreshToken');

// Create OAuth 2.0 server
const aserver = oauth2orize.createServer();

// Generic error handler
const errFn = function (cb, err) {
    if (err) {
        return cb(err);
    }
};

// Destroy any old tokens and generates a new access and refresh token
const generateTokens = function (data, done) {
    console.log('generateTokens')
    // Curries in `done` callback, so we don't need to pass it
    let errorHandler = errFn.bind(undefined, done),
        refreshToken,
        refreshTokenValue,
        token,
        tokenValue;

    RefreshToken.deleteMany(data, errorHandler);
    AccessToken.deleteMany(data, errorHandler);

    tokenValue = crypto.randomBytes(32).toString('hex');
    refreshTokenValue = crypto.randomBytes(32).toString('hex');

    data.token = tokenValue;
    token = new AccessToken(data);

    data.token = refreshTokenValue;
    refreshToken = new RefreshToken(data);

    console.log('newToken ', token)
    console.log('newRefreshToken ', refreshToken)

    refreshToken.save(errorHandler);

    token.save(function (err) {
        if (err) {
            log.error(err);
            console.log('error in token.save block')
            return done(err);
        }
        done(null, tokenValue, refreshTokenValue, {
            'expires_in': config.get('security:tokenLife')
        });
    });
};

// Exchange username & password for access token
aserver.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {

    //TODO
    console.log('Exchange username & password for access token')
    User.findOne({ username: username }, function (err, user) {

        if (err) {
            console.log('error ', err)
            return done(err);
        }

        if (!user || !user.checkPassword(password)) {
            console.log('!user || !user.checkPassword(password)')
            return done(null, false);
        }

        const model = {
            userId: user.userId,
            clientId: client.clientId
        };

        generateTokens(model, done);
    });

}));

// Exchange refreshToken for access token
aserver.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {

    RefreshToken.findOne({ token: refreshToken, clientId: client.clientId }, function (err, token) {
        if (err) {
            return done(err);
        }

        if (!token) {
            return done(null, false);
        }

        User.findById(token.userId, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }

            const model = {
                userId: user.userId,
                clientId: client.clientId
            };

            generateTokens(model, done);
        });
    });
}));

// Update password with correct username
// aserver.exchange(oauth2orize.exchange.updatePassword(function (client, username, password, scope, done) {
//
//     //TODO
//     console.log('Update password with correct username')
//     User.findOne({ username: username }, function (err, user) {
//
//         if (err) {
//             return done(err);
//         }
//
//         if (!user || !user.checkPassword(password)) {
//             return done(null, false);
//         }
//
//         const model = {
//             userId: user.userId,
//             clientId: client.clientId
//         };
//
//         generateTokens(model, done);
//     });
//
// }));

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens. Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request. Clients must
// authenticate when making requests to this endpoint.

exports.token = [
    //passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    passport.authenticate(['basic'], { session: false }),
    aserver.token(),
    aserver.errorHandler()
];
