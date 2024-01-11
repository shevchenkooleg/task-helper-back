const express = require('express');
const passport = require('passport');
const router = express.Router();

const libs = process.cwd() + '/libs/';
const log = require(libs + 'log')(module);

const db = require(libs + 'db/mongoose');
const Order = require(libs + 'model/order');
const Material = require(libs + 'model/material')
const {params} = require("superagent/lib/utils");
const url = require("url");

// List all orders
router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    const userId = req.user._id

    const sortFieldMapper = {
        'order-id': 'orderId',
        'execute-id': 'executeId',
        'order-status': 'orderStatus',
        'correction-id': 'correctionId',
        'consignment-note-id': 'consignmentNoteId',
        'bill-of-quantities': 'billOfQuantities',
        'ks2-id': 'KS2Id',
        'write-off-act-id': 'writeOffActId',
        'year-of-execution': 'yearOfExecution',
        'order-execution-type': 'orderExecutionType',
        'order-type': 'orderType',
    }

    if (Object.keys(req.query).length > 0){
        console.log('req.query: ', req.query)
        console.log('getOrders with query params')
        const sortOrder = req.query['order'] ?? 'asc'
        const sortParam = req.query['sort'] ?? 'order-id'
        const yearOfExecution = req.query['yearOfExecution']
        const orderType = req.query['orderType']
        const orderExecutionType = req.query['orderExecutionType']
        const statusFields = req.query['status'] && req.query['status'].replaceAll('-','_').replaceAll('none', '').split('%')

        // console.log('sortOrder: ', sortOrder)
        // console.log('sortParam: ', sortParam)
        // console.log('yearOfExecution: ', yearOfExecution)

        // console.log('sortFieldMapper[sortParam]: ', sortFieldMapper[sortParam])


        const searchParams = {
            userId: userId
        };

        if (yearOfExecution !== 'any'){
            searchParams.yearOfExecution = yearOfExecution;
        }

        if (orderType !== 'any'){
            searchParams.orderType = orderType;
        }

        if (orderExecutionType !== 'any'){
            searchParams.orderExecutionType = orderExecutionType;
        }

        if (statusFields && statusFields[0] !== 'all'){
            searchParams.orderStatus = statusFields
        } else if (statusFields && statusFields[0] === 'all'){

        } else {
            searchParams.orderStatus = []
        }

        console.log('searchParams: ', searchParams)


        Order.find(searchParams).sort({[sortFieldMapper[sortParam]]: sortOrder === 'desc' ? -1 : 1}).exec(function (err, order) {
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
        console.log('getOrders')
        Order.find({userId: userId}, function (err, order) {
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

// Create order
router.post('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    const order = new Order({
        userId: req.body.userId,
        description: req.body.description,
        orderId: req.body.orderId,
        yearOfExecution: req.body.yearOfExecution,
        orderType: req.body.orderType,
        orderExecutionType: req.body.orderExecutionType,
    });

    order.save(function (err) {
        if (!err) {
            log.info('New order created with id: %s', order.id);
            return res.json({
                status: 'OK',
                order: order
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

// Get order
router.get('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {

    Order.findById(req.params.id, function (err, order){
        if (!order) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {

            return res.json({
                status: 'OK',
                order: order
            });

        }

        else {
                    res.statusCode = 500;
                    log.error('Internal error(%d): %s', res.statusCode, err.message);

                    return res.json({
                        error: 'Server error'
                    });
                }
    })




    // Order.findById(req.params.id, function (err, order) {
    //
    //
    //     if (!order) {
    //         res.statusCode = 404;
    //
    //         return res.json({
    //             error: 'Not found'
    //         });
    //     }
    //
    //     if (!err) {
    //         // console.log(result)
    //
    //
    //
    //
    //     //     if (query._expand === 'material'){
    //     //         const materialId = []
    //     //         let expandMaterials = []
    //     //         order.materials.map(material => materialId.push(material.materialId))
    //     //         materialId.forEach((id, i)=>{
    //     //             Material.findById(id, function (err, material) {
    //     //                 if (!material) {
    //     //                     return
    //     //                 }
    //     //                 if (!err) {
    //     //                     // console.log('material ', material)
    //     //                     // console.log('qqq.materials ', qqq.materials
    //     //                     expandMaterials.push(JSON.parse(JSON.stringify(order.materials[i])));
    //     //                     // const newData = {....__parentArray[i]}
    //     //
    //     //                     // qqq = [...order.materials[i] = {...qqq.materials[i], ...material}]
    //     //                     // qqq.push(order.materials[i])
    //     //                     console.log('expandMaterials ', expandMaterials)
    //     //                 }
    //     //             })
    //     //         })
    //     //         console.log('expandMaterials ', expandMaterials)
    //     //
    //     //     }
    //     //
    //     //
    //     //     // console.log('qqq ', qqq)
    //     //
    //         return res.json({
    //             status: 'OK',
    //             order: order
    //         });
    //     } else {
    //
    //         res.statusCode = 500;
    //         log.error('Internal error(%d): %s', res.statusCode, err.message);
    //
    //         return res.json({
    //             error: 'Server error'
    //         });
    //     }
    // });
});

// Update order
router.put('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {
    const orderId = req.params.id;
    const keyArray = [
        '_id', 'materialName', 'KSUId', 'dimension', 'fullVolume', '__v'
    ]


    const orderForUpdate = req.body
    // console.log('before ', orderForUpdate)
    orderForUpdate.materials.forEach(material=>{
        keyArray.forEach((el)=>delete material[el])
    })
    // console.log('after ', orderForUpdate)

    console.log('orderForUpdate ', orderForUpdate)

    Order.findById(orderId, function (err, order) {
        if (!order) {
            res.statusCode = 404;
            log.error('Article with id: %s Not Found', orderId);
            return res.json({
                error: 'Not found'
            });
        }

        order.title = orderForUpdate.title;
        order.description = orderForUpdate.description;
        order.orderId = orderForUpdate.orderId
        order.executeId = orderForUpdate.executeId
        order.description = orderForUpdate.description
        order.orderStatus = orderForUpdate.orderStatus
        order.correctionId = orderForUpdate.correctionId
        order.consignmentNoteId = orderForUpdate.consignmentNoteId
        order.KS2Id = orderForUpdate.KS2Id
        order.writeOffActId = orderForUpdate.writeOffActId
        order.yearOfExecution = orderForUpdate.yearOfExecution
        order.billOfQuantities = orderForUpdate.billOfQuantities
        order.modified = Date.now()
        order.materials = orderForUpdate.materials
        order.orderType = orderForUpdate.orderType
        order.orderExecutionType = orderForUpdate.orderExecutionType


        order.save(function (err) {
            if (!err) {
                log.info('Order with id: %s updated', order.id);
                return res.json({
                    status: 'OK',
                    order: order
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

//Delete order
router.delete('/:id', passport.authenticate('bearer', { session: false }), function (req, res) {

    Order.findByIdAndDelete(req.params.id, function (err, order) {

        if (!order) {
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



//Note.findByIdAndDelete(targetId)

module.exports = router;
