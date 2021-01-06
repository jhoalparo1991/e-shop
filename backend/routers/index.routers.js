const { Router } = require('express');
const product = require('./products.routers');
const category = require('./category.routers');
const user = require('./user.routers');
const order = require('./order.routers');

//Initialization
const router = Router();

//variables
const api = process.env.API;


//Routes
router.use(`${api}/products`,product);
router.use(`${api}/categories`,category);
router.use(`${api}/users`,user);
router.use(`${api}/orders`,order);

//Export routes
module.exports = router;