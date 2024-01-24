const express = require('express');
const passport = require('passport');
const router = express.Router();

const libs = process.cwd() + '/libs/';
const log = require(libs + 'log')(module);

const db = require(libs + 'db/mongoose');
const Material = require(libs + 'model/material');
const url = require('url');
const mongoose = require("mongoose");


// List all orders
router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {


    if (req.query.materialId && req.query.materialId.length !== 0){
        console.log(req.query.materialId)

        Material.find({_id: req.query.materialId}, function (err, material) {
            if (!err) {
                return res.json({material, _newMaterialInstanceId: new mongoose.mongo.ObjectId()});
            } else {
                res.statusCode = 500;

                log.error('Internal error(%d): %s', res.statusCode, err.message);

                return res.json({
                    error: 'Server error'
                });
            }
        });
    } else {
        console.log('getMaterials')
        Material.find(function (err, order) {
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
    }

});

// List materials for Order create/update
router.get('/search', passport.authenticate('bearer', { session: false }), function (req, res) {


    const query = req.query.searchQuery
    console.log(query)
    if (query && query.length > 1 ){
        Material.find( { $or: [ { materialName: {$regex : query} }, { KSUId: {$regex : query} }, { UPPId: {$regex : query} } ] }, function (err, material) {
                    if (!err) {
                        return res.json(material);
                    } else {
                        res.statusCode = 500;

                        log.error('Internal error(%d): %s', res.statusCode, err.message);

                        return res.json({
                            error: 'Server error'
                        });
                    }
                });
    }

    // if (req.query.materialId && req.query.materialId.length !== 0){
    //     console.log(req.query.materialId)
    //
    // } else {
    //     console.log('getMaterials')
    //     Material.find(function (err, order) {
    //         if (!err) {
    //             return res.json(order);
    //         } else {
    //             res.statusCode = 500;
    //
    //             log.error('Internal error(%d): %s', res.statusCode, err.message);
    //
    //             return res.json({
    //                 error: 'Server error'
    //             });
    //         }
    //     });
    // }

});

//Search by array with materialID data
router.get('/searchMany', passport.authenticate('bearer', { session: false }), function (req, res) {

    const query = Object.values(req.query)

    if (query && query.length > 0 ){
        Material.find( {'_id': {$in:query}}, function (err, material) {
            if (!err) {
                return res.json(material);
            } else {
                res.statusCode = 500;

                log.error('Internal error(%d): %s', res.statusCode, err.message);

                return res.json({
                    error: 'Server error'
                });
            }
        });
    }
})

// Create material
router.post('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    const material = new Material({
        materialName: req.body.materialName,
        KSUId: req.body.KSUId,
        UPPId: req.body.UPPId,
        dimension: req.body.dimension,
        fullVolume: req.body.fullVolume,
    });

    material.save(function (err) {
        if (!err) {
            log.info('New material created with id: %s', material.id);
            return res.json({
                status: 'OK',
                material: material
            });
        } else {
            if (err.name === 'ValidationError') {
                console.log('err.name', err.name)
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

// Get material
router.get('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {

    Material.findById(req.params.id, function (err, material) {

        if (!material) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK',
                material: material
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

//Update material
router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {
    const materialId = req.params.id;

    console.log('KSUId ', req.body.KSUId)
    console.log('UPPId ', req.body.UPPId)

    Material.findById(materialId, function (err, material) {
        if (!material) {
            res.statusCode = 404;
            log.error('Material with id: %s Not Found', materialId);
            return res.json({
                error: 'Not found'
            });
        }

        material.materialName = req.body.materialName;
        material.KSUId = req.body.KSUId;
        material.UPPId = req.body.UPPId;
        material.dimension = req.body.dimension;
        material.fullVolume = req.body.fullVolume;
        material._id = req.body._id
        console.log('req.body', req.body)

        material.save(function (err) {
            if (!err) {
                log.info('Material with id: %s updated', material.id);
                return res.json({
                    status: 'OK',
                    material: material
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

//Delete material
router.delete('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {
    const materialId = req.params.id;

    Material.findByIdAndDelete(materialId, function (err, material) {

        if (!material) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK'
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

module.exports = router;
