const { Router } = require('express');
const { Orders } = require('../models/order.models');
const { OrderItems } = require('../models/orderItems.model');
const { isValidObjectId } = require('mongoose');
const router = Router();

//get all orders
router.get('/', async (req, res) => {
    try {
        const orderList = await Orders.find().populate('user', 'name').sort({ 'dateOrder': -1 });

        if (!orderList) return res.status(401).json({ success: false, message: 'Orders no found' });

        return res.json({ success: true, orderList });
    } catch (error) {
        return res.status(401).json({ success: false, error });
    }
});

//get orders by id
router.get('/:id', async (req, res) => {
    try {
        if (!isValidObjectId(req.param.id)) {
            return res.status(401).json({ success: false, message: 'Order id not found' });
        }
        const order = await Orders.findById(req.params.id)
            .populate('user', 'name')
            .populate({
                path: 'orderItems', populate: {
                    path: 'product', populate: 'category'
                }
            });

        if (!order) return res.status(401).json({ success: false, message: 'Orders not found' });

        return res.json({ success: true, order });
    } catch (error) {
        return res.status(401).json({ success: false, error });
    }
});


//Create order
router.post('/', async (req, res) => {
    try {

        let orderItemId = Promise.all(req.body.orderItems.map(async items => {
            let newOrderItem = new OrderItems({
                quantity: items.quantity,
                product: items.product
            });

            newOrderItem = await newOrderItem.save();

            return newOrderItem._id;

        }));

        const orderItemsIds = await orderItemId;

        const totalPrices = await Promise.all(orderItemsIds.map(async itemsId => {
            let orderItem = await OrderItems.findById(itemsId).populate('product', 'price');
            let total = orderItem.product.price * orderItem.quantity;
            return total;
        }))

        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);


        let order = new Orders({
            orderItems: orderItemsIds,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user
        })

        order = await order.save()

        if (!order) return res.status(401).json({ success: false, message: 'Order not created' });
        return res.json({ success: true, order });

    } catch (error) {
        return res.status(400).json({ success: false, error });
    }
});

//Update order
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        Orders.findByIdAndUpdate(id, { status: req.body.status }, { new: true })
            .then(order => {
                if (order) { return res.status(200).send('Order update successfully') }
                else {
                    return res.status(404).json({
                        success: false,
                        message: 'Cannot update order'
                    })
                }
            })

    } catch (error) {
        return res.status(404).json({
            success: false,
            error
        })
    }
})

//Delete order with details
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let order = await Orders.findByIdAndRemove(id);

        const items = order.orderItems;

        for (let item of items) {
            await OrderItems.findByIdAndDelete(item);
        }

        if (!order) return res.status(400).json({ success: false, message: 'Cannot delete order' })
        return res.status(200).json({ success: true, order })


    } catch (error) {
        return res.status(500).json({
            success: false,
            error
        })
    }
})
//Get total sales
router.get('/get/totalsales', async (req, res) => {
    try {

        const totalSales = await Orders.aggregate(
            [
                {
                    $group: {
                        _id: null,
                        totalSales: {
                            $sum: '$totalPrice'
                        }
                    }
                }
            ]
        )

        if (!totalSales) return res.status(400).json({ success: false, message: 'Order not created' })
        res.send({ totalSales: totalSales.pop().totalSales })
        //return res.status(200).json({success:true,totalSale})


    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error
        })
    }
})

//Count orders
router.get('/get/count', async (req, res) => {
    try {
        const order = await Orders.countDocuments(count => count);
        if (!order) {
            return res.status(404).send('Don`t have orders')
        }
        res.json({
            success: true,
            order
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            error
        })
    }
})

//Get order by user
router.get('/get/orderuser/:userid', async (req, res) => {
    try {
        if (!isValidObjectId(req.param.userid)) {
            return res.status(401).json({ success: false, message: 'User id not found' });
        }
        const order = await Orders.find({user : req.params.userid})
            .populate('user', 'name')
            .populate({
                path: 'orderItems', populate: {
                    path: 'product', populate: 'category'
                }
            }).sort({ 'dateOrder': -1 });

        if (!order) return res.status(401).json({ success: false, message: 'Orders not found' });

        return res.json({ success: true, order });
    } catch (error) {
        return res.status(401).json({ success: false, error });
    }
});

module.exports = router;