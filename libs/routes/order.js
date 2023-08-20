const express = require('express');
const passport = require('passport');
const router = express.Router();

const libs = process.cwd() + '/libs/';
const log = require(libs + 'log')(module);

const db = require(libs + 'db/mongoose');
const Order = require(libs + 'model/order');
const Material = require(libs + 'model/material')

// List all orders
router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    console.log('getOrders')
    const userId = req.user._id
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
});

// Create order
router.post('/', passport.authenticate('bearer', { session: false }), function (req, res) {

    const order = new Order({
        userId: req.body.userId,
        description: req.body.description,
        orderId: req.body.orderId,
        yearOfExecution: req.body.yearOfExecution
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

    Order.findById(orderId, function (err, order) {
        if (!order) {
            res.statusCode = 404;
            log.error('Article with id: %s Not Found', orderId);
            return res.json({
                error: 'Not found'
            });
        }

        order.title = req.body.title;
        order.description = req.body.description;
        order.orderId = req.body.orderId
        order.executeId = req.body.executeId
        order.description = req.body.description
        order.orderStatus = req.body.orderStatus
        order.correctionId = req.body.correctionId
        order.consignmentNoteId = req.body.consignmentNoteId
        order.KS2Id = req.body.KS2Id
        order.writeOffActId = req.body.writeOffActId
        order.yearOfExecution = req.body.yearOfExecution
        order.billOfQuantities = req.body.billOfQuantities
        order.modified = Date.now()


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
