const express = require('express');
const passport = require('passport');
const router = express.Router();

const libs = process.cwd() + '/libs/';
const log = require(libs + 'log')(module);

const db = require(libs + 'db/mongoose');
const Article = require(libs + 'model/article');

// List all articles
router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    Article.find(function (err, articles) {
        if (!err) {
            return res.json(articles);
        } else {
            res.statusCode = 500;

            log.error('Internal error(%d): %s', res.statusCode, err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
});

// Create article
router.post('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    const article = new Article({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        images: req.body.images
    });

    article.save(function (err) {
        if (!err) {
            log.info('New article created with id: %s', article.id);
            return res.json({
                status: 'OK',
                article: article
            });
        } else {
            if (err.name === 'ValidationError') {
                res.statusCode = 400;
                res.json({
                    error: 'Validation error'
                });
            } else {
                res.statusCode = 500;

                log.error('Internal error(%d): %s', res.statusCode, err.message);

                res.json({
                    error: 'Server error'
                });
            }
        }
    });
});

// Get article
router.get('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {

    Article.findById(req.params.id, function (err, article) {

        if (!article) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK',
                article: article
            });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
});

// Update article
router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {
    const articleId = req.params.id;

    Article.findById(articleId, function (err, article) {
        if (!article) {
            res.statusCode = 404;
            log.error('Article with id: %s Not Found', articleId);
            return res.json({
                error: 'Not found'
            });
        }

        article.title = req.body.title;
        article.description = req.body.description;
        article.author = req.body.author;
        article.images = req.body.images;

        article.save(function (err) {
            if (!err) {
                log.info('Article with id: %s updated', article.id);
                return res.json({
                    status: 'OK',
                    article: article
                });
            } else {
                if (err.name === 'ValidationError') {
                    res.statusCode = 400;
                    return res.json({
                        error: 'Validation error'
                    });
                } else {
                    res.statusCode = 500;

                    return res.json({
                        error: 'Server error'
                    });
                }
                log.error('Internal error (%d): %s', res.statusCode, err.message);
            }
        });
    });
});

module.exports = router;
