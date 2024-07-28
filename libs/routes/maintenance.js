const express = require('express');
const passport = require('passport');
const router = express.Router();
const mongoose = require('mongoose');

const libs = process.cwd() + '/libs/';
const log = require(libs + 'log')(module);

const db = require(libs + 'db/mongoose');
const Maintenance = require(libs + 'model/maintenance');
const {params} = require("superagent/lib/utils");
const url = require("url");


// Get All Maintenances
router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {

        Maintenance.find(function (err, order) {
            if (!err) {
                return res.json(order);
            } else {
                res.statusCode = 500;

                log.error('Internal error(%d): %s', res.statusCode, err.message);

                return res.json({
                    error: 'Server error'
                });
            }
        });
});

// Create maintenance
router.post('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    console.log(req.body)

    const maintenance = new Maintenance({
        fullName: req.body.fullName,
        shortName: req.body.shortName,
        // replaceableMaintenance: req.body.replaceableMaintenance,
        // periodicity: req.body.periodicity,
    });

    maintenance.save(function (err) {
        if (!err) {
            log.info('New maintenance created with id: %s', maintenance.id);
            return res.json({
                status: 'OK',
                maintenance: maintenance
            });
        } else {
            if (err.name === 'ValidationError') {
                console.log('err.name', err)
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

// List maintenance for replaceableMaintenance in create/update maintenance
router.get('/search', passport.authenticate('bearer', { session: false }), function (req, res) {


    const query = req.query.searchQuery
    console.log(query)
    if (query && query.length > 1 ){
        Maintenance.find( { $or: [ { fullName: {$regex : new RegExp(query, 'i')} }, { shortName: {$regex : new RegExp(query, 'i')} } ] }, function (err, maintenance) {
            if (!err) {
                return res.json(maintenance);
            } else {
                res.statusCode = 500;

                log.error('Internal error(%d): %s', res.statusCode, err.message);

                return res.json({
                    error: 'Server error'
                });
            }
        });
    }
});



module.exports = router;