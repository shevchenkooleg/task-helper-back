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
});


// Update unit
router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {
    const unitId = req.params.id;
    // const keyArray = [
    //     // '_id', 'materialName', 'KSUId', 'dimension', 'fullVolume', '__v'
    //     'materialName', 'KSUId', 'dimension', 'fullVolume', '__v'
    // ]
    //
    //
    // const orderForUpdate = req.body
    // orderForUpdate.materials.forEach(material=>{
    //     keyArray.forEach((el)=>delete material[el])
    // })
    // console.log('after ', orderForUpdate)

    // console.log('orderForUpdate ', orderForUpdate)

    Unit.findById(unitId, function (err, unit) {
        if (!unit) {
            res.statusCode = 404;
            log.error('Unit with id: %s Not Found', unitId);
            return res.json({
                error: 'Not found'
            });
        }

        // console.log(req.body)
        // console.log('req.body.rep ', req.body.scheduledMaintenanceList[0].replaceableMaintenance)


        if (req.body.unitName) unit.unitName = req.body.unitName
        unit.modified = Date.now()
        if (req.body.parentId) unit.parentId = req.body.parentId
        if (req.body.unitType) unit.unitType = req.body.unitType
        if (req.body.unitModel) unit.unitModel = req.body.unitModel
        if (req.body.unitKKS) unit.unitKKS = req.body.unitKKS
        if (req.body.toroKKS) unit.toroKKS = req.body.toroKKS
        if (req.body.nestingLevel) unit.nestingLevel = req.body.nestingLevel
        if (req.body.serialNumber) unit.serialNumber = req.body.serialNumber
        if (req.body.dateOfProduce) unit.dateOfProduce = req.body.dateOfProduce
        if (req.body.scheduledMaintenanceList) unit.scheduledMaintenanceList = [...unit.scheduledMaintenanceList, {...req.body.scheduledMaintenanceList[0], replaceableMaintenanceId: [...req.body.scheduledMaintenanceList[0].replaceableMaintenanceId]}]
        if (req.body.nextScheduledMaintenanceDate) unit.nextScheduledMaintenanceDate = req.body.nextScheduledMaintenanceDate
        if (req.body.maintenanceLog) unit.maintenanceLog = req.body.maintenanceLog
        if (req.body.materials) unit.materials = req.body.materials


        // order.title = orderForUpdate.title;
        // order.executeId = orderForUpdate.executeId

        // order.correctionId = orderForUpdate.correctionId
        // order.consignmentNoteId = orderForUpdate.consignmentNoteId
        // order.KS2Id = orderForUpdate.KS2Id
        // order.writeOffActId = orderForUpdate.writeOffActId
        // order.billOfQuantities = orderForUpdate.billOfQuantities






        unit.save(function (err) {
            if (!err) {
                log.info('Unit with id: %s updated', unit.id);
                console.log('saved unit ', unit)
                return res.json({
                    status: 'OK',
                    unit: unit
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
