const express = require('express');
const passport = require('passport');
const router = express.Router();
const mongoose = require('mongoose');

const libs = process.cwd() + '/libs/';
const log = require(libs + 'log')(module);

const db = require(libs + 'db/mongoose');
const Unit = require(libs + 'model/unit');
const {params} = require("superagent/lib/utils");
const url = require("url");

//Search by array with materialID data
// router.get('/searchWithMaterial', passport.authenticate('bearer', { session: false }), function (req, res) {
//
//     const materialId = Object.values(req.query)[0]
//     const yearOfExecution = Object.values(req.query)[1]
//     const userId = Object.values(req.query)[2]
//     console.log('materialId ', materialId)
//     console.log('yearOfExecution ', yearOfExecution)
//     console.log('userId ', userId)
//
//     if (materialId && yearOfExecution){
//         // Order.find( {'materials.items': {$elemMatch: {materialId: query}}}, function (err, orders) {
//         Order.find( {"materials": {$elemMatch: {"materialId": materialId}}, "yearOfExecution": yearOfExecution, "userId": userId}, function (err, order) {
//             if (!err) {
//                 return res.json(order);
//             } else {
//                 res.statusCode = 500;
//
//                 log.error('Internal error(%d): %s', res.statusCode, err.message);
//
//                 return res.json({
//                     error: 'Server error'
//                 });
//             }
//         });
//
//     }
// })

//Unit CRUD operations

// Get Units
router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    if (Object.keys(req.query).length > 0){
        console.log('req.query: ', req.query)
        console.log('getMainParentUnits')
        const nestingLevel = req.query['nestingLevel']
        const parentId = req.query['parentId'] ?? ''

        let searchParams = {}

        if (nestingLevel){searchParams['nestingLevel'] = Number(nestingLevel)}
        if (parentId){searchParams['parentId'] = parentId}

        console.log('searchParams: ', searchParams)

        Unit.find(searchParams).exec(function (err, order) {
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
    } else {
        console.log('getAllUnits')
        Unit.find({}, function (err, order) {
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

// Create unit
router.post('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    console.log(req.body)

    const unit = new Unit({
        unitName: req.body.unitName,
        parentId: req.body.parentId,
        unitType: req.body.unitType,
        nestingLevel: req.body.nestingLevel,
    });

    unit.save(function (err) {
        if (!err) {
            log.info('New unit created with id: %s', unit.id);
            return res.json({
                status: 'OK',
                unit: unit
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
// Get unit
// router.get('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {
//
//     Order.findById(req.params.id, function (err, order) {
//         if (!order) {
//             res.statusCode = 404;
//
//             return res.json({
//                 error: 'Not found'
//             });
//         }
//
//         if (!err) {
//
//             return res.json({
//                 status: 'OK',
//                 order: order
//             });
//
//         } else {
//             res.statusCode = 500;
//             log.error('Internal error(%d): %s', res.statusCode, err.message);
//
//             return res.json({
//                 error: 'Server error'
//             });
//         }
//     })
// })

// List ParentUnits for NewUnit create/update
router.get('/search', passport.authenticate('bearer', { session: false }), function (req, res) {

    console.log('_____________________________________________________________BINGO')
    const query = req.query.searchQuery
    console.log('query ', query)
    if (query && query.length > 1 ){
        Unit.find( { $or: [ { unitName: {$regex : new RegExp(query, 'i')} }, { unitKKS: {$regex : new RegExp(query, 'i')} } ] }, function (err, unit) {
            if (!err) {
                return res.json(unit);
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




module.exports = router;
