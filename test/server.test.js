const libs = process.cwd() + '/libs/';
const config = require('../libs/config');

const test = require('tape');
const request = require('superagent');
const baseUrl = 'http://localhost:1337/api';

const userCredentials = {
    username: config.get('default:user:username'),
    password: config.get('default:user:password')
};
const clientCredentials = {
    client_id: config.get('default:client:clientId'),
    client_secret: config.get('default:client:clientSecret')
};
let accessToken;
let refreshToken;

const articleExample = {
    title: 'New Article', author: 'John Doe', description: 'Lorem ipsum dolar sit amet', images: [
        { kind: 'thumbnail', url: 'http://habrahabr.ru/images/write-topic.png' },
        { kind: 'detail', url: 'http://habrahabr.ru/images/write-topic.png' }
    ]
};
const articleUpdated = { title: 'Updated Article', author: 'Jane Doe', description: 'This is now updated' };
let articleId;

function getTokensFromBody(body) {
    console.log('___getTokensFromBody___access_token: ', body)
    if (!('access_token' in body) || !('refresh_token' in body)) {
        return false;
    }

    accessToken = body['access_token'];
    refreshToken = body['refresh_token'];

    return true;
}

// test('Unauthorized request', function (t) {
//     request
//         .get(baseUrl + '/')
//         .end(function (err, res) {
//             t.equal(res.status, 401, 'response status should be 401');
//             t.end();
//         });
// });

test('Get token from username-password', function (t) {
    request
        .post(baseUrl + '/oauth/token')
        .send({ grant_type: 'password' })
        .send(userCredentials)
        .send(clientCredentials)
        .end(function (err, res) {
            console.log(res.body)
            t.equal(res.status, 200, 'response status should be 200');
            t.true(getTokensFromBody(res.body), 'tokens should be in response body');
            t.end();
        });
});

// test('Get token from refresh token', function (t) {
//     request
//         .post(baseUrl + '/oauth/token')
//         .send({ grant_type: 'refresh_token', refresh_token: refreshToken })
//         .send(clientCredentials)
//         .end(function (err, res) {
//             t.equal(res.status, 200, 'response status should be 200');
//             t.true(getTokensFromBody(res.body), 'tokens should be in response body');
//             t.end();
//         });
// });
//
// test('Authorized request', function (t) {
//     request
//         .get(baseUrl + '/')
//         .set('Authorization', 'Bearer ' + accessToken)
//         .end(function (err, res) {
//             console.log('accessToken for log', accessToken)
//             t.equal(res.status, 200, 'response status should be 200');
//             t.end();
//         });
// });
//
// test('Create article', function (t) {
//     request
//         .post(baseUrl + '/articles')
//         .send(articleExample)
//         .set('Authorization', 'Bearer ' + accessToken)
//         .end(function (err, res) {
//             t.equal(res.status, 200, 'response status should be 200');
//             if ('article' in res.body) {
//                 t.equal(res.body['article']['title'], articleExample['title'], 'created article title should be correct');
//                 articleId = res.body['article']['_id'];
//             }
//             t.end();
//         });
// });
//
// test('Check created article', function (t) {
//     request
//         .get(baseUrl + '/articles/' + articleId)
//         .set('Authorization', 'Bearer ' + accessToken)
//         .end(function (err, res) {
//             t.equal(res.status, 200, 'response status should be 200');
//             if ('article' in res.body) {
//                 t.equal(res.body['article']['title'], articleExample['title'], 'created article title should be correct');
//                 t.equal(res.body['article']['images'].length, articleExample['images'].length, 'created article images count should be correct');
//             }
//             t.end();
//         });
// });
//
// test('Update article', function (t) {
//     request
//         .put(baseUrl + '/articles/' + articleId)
//         .set('Authorization', 'Bearer ' + accessToken)
//         .send(articleUpdated)
//         .end(function (err, res) {
//             t.equal(res.status, 200, 'response status should be 200');
//             if ('article' in res.body) {
//                 t.equal(res.body['article']['title'], articleUpdated['title'], 'updated article title should be correct');
//             }
//             t.end();
//         });
// });
//
// test('Test articles list', function (t) {
//     request
//         .get(baseUrl + '/articles')
//         .set('Authorization', 'Bearer ' + accessToken)
//         .end(function (err, res) {
//             t.equal(res.status, 200, 'response status should be 200');
//             let articleFound = false;
//             for (let i = 0; i < res.body.length; i++) {
//                 const article = res.body[i];
//                 if (article['_id'] === articleId) {
//                     articleFound = true;
//                     t.equal(article['title'], articleUpdated['title'], 'updated article title should be correct');
//                 }
//             }
//             t.true(articleFound, 'created/updated article should be in a list');
//             t.end();
//         });
// });
//
// test('Test users/info', function (t) {
//     request
//         .get(baseUrl + '/users/info')
//         .set('Authorization', 'Bearer ' + accessToken)
//         .end(function (err, res) {
//             t.equal(res.status, 200, 'response status should be 200');
//             t.equal(res.body['name'], userCredentials['username'], 'username should be correct');
//             t.end();
//         });
// });
