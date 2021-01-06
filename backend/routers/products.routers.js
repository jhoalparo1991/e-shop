const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const { Product } = require('../models/products.model');
const { Category } = require('../models/category.models');

const router = Router();

//Get product by id
router.get('/:id',async (req,res)=>{
    try {
        const products = await Product.findById(req.params.id).populate('category');
        if(!products){
            return res.status(404).send('No tienes productos para mostrar')
        }
        res.json({
         success : true, 
         products
        })
    } catch (error) {
        return res.status(404).json({
            success:false,
            error
        })
    }
})

//Create new product
router.post('/',async (req,res)=>{
    try {

        const categorySearch = await Category.findById(req.body.category);
        if(!categorySearch) return res.status(400).send('Categoria invalida');

        const {
             name,
            description,
            richDescription,
            image,
            images,
            brand,
            price,
            category,
            countInStock,
            rating,
            numReviews,
            isFeatured 
        } = req.body; 
        const product = new Product({
            name,
            description,
            richDescription,
            image,
            images,
            brand,
            price,
            category,
            countInStock,
            rating,
            numReviews,
            isFeatured
        })

        await product.save( (err,data)=>{
            if(err) return res.status(500).json({ success:false,err });
            res.json({ success:true, data});
        })
    } catch (error) {
        return res.status(404).json({
            success : false,
            error
        })
    }
})

//Update product
router.put('/:id',async (req,res)=>{
    try {
        if(!isValidObjectId(req.params.id)){
            return res.status(400).
                json({
                     success:false,
                     message: 'El id del producto no es valido'
                })
        }
        const categorySearch = await Category.findById(req.body.category);
        if(!categorySearch) return res.status(400).send('Categoria invalida');

        await Product.findByIdAndUpdate(req.params.id,req.body,{new:true}, (err,data)=>{
            if(err) return res.status(500).json({ success:false,err });
            res.json({ success:true, data});
        })
    } catch (error) {
        return res.status(404).json({
            success : false,
            error
        })
    }

})

//Delete product
router.delete('/:id',(req,res)=>{
    try {
        if(!isValidObjectId(req.params.id)){
            return res.status(400).
                json({
                     success:false,
                     message: 'El id del producto no es valido'
                })
        }
        Product.findByIdAndRemove(req.params.id).then( product =>{
            if(product) { return res.status(200).send('Producto eliminado')}
            else { return res.status(404).
                json({
                     success:true,
                     message: 'Hubo un error, no se pudo eliminar'
                })
                }
        })
        .catch( error =>{
            return res.status(404).json({
                success : false,
                error
            })
        })
    } catch (error) {
        return res.status(404).json({
            success : false,
            error
        })
    }
})

//Count number products in database
router.get('/get/count',async (req,res)=>{
    try {
        const productCount = await Product.countDocuments( count => count);
        if(!productCount){
            return res.status(404).send('No tienes productos para mostrar')
        }
        res.json({
         success : true, 
         productCount
        })
    } catch (error) {
        return res.status(404).json({
            success:false,
            error
        })
    }
})


//Get Feature products
router.get('/get/featured/:count',async (req,res)=>{
    try {
        const count = req.params.count ?  req.params.count : 0;
        const product = await Product.find({isFeatured:true}).limit(+count);
        if(!product){
            return res.status(404).send('No tienes productos para mostrar')
        }
        res.json({
         success : true, 
         product
        })
    } catch (error) {
        return res.status(404).json({
            success:false,
            error
        })
    }
})

//Filtering product by categories
router.get('/',async (req,res)=>{
    try {

        let filter = {};

        if(req.query.categories){
            filter = { category: req.query.categories.split(',')};
        }

        const product = await Product.find(filter).populate('category');

        if(!product){
            return res.status(404).send('No tienes productos para mostrar')
        }
        res.json({
         success : true, 
         product
        })
    } catch (error) {
        return res.status(404).json({
            success:false,
            error
        })
    }
})

module.exports = router;