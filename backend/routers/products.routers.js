const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const { Product } = require('../models/products.model');
const { Category } = require('../models/category.models');
const multer = require('multer');
const path = require('path');

//Initialization
const router = Router();

const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg',
}

//Setting multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Ivalid image type : ');

        if(isValid){
            uploadError = null;
        }

        cb(uploadError, './public/uploads')
    },
    filename: function (req, file, cb) {



        const fileName = file.originalname;
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}${Date.now()}.${extension}`)
    }
})

const multerSetting = multer({ storage: storage })

//Get product by id
router.get('/:id', async (req, res) => {
    try {
        const products = await Product.findById(req.params.id).populate('category');
        if (!products) {
            return res.status(404).send('No tienes productos para mostrar')
        }
        res.json({
            success: true,
            products
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            error
        })
    }
})

//Create new product
router.post('/', multerSetting.single('image'), async (req, res) => {
    try {

        const categorySearch = await Category.findById(req.body.category);
        if (!categorySearch) return res.status(400).send('Categoria invalida');

        const file = req.file;
        if (!file) return res.status(400).send('No image in the request');
        const imageUpload = req.file.image;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${imageUpload}`,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        })

        await product.save((err, data) => {
            if (err) return res.status(500).json({ success: false, err });
            res.json({ success: true, data });
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            error
        })
    }
})

//Update product
router.put('/:id', async (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).
                json({
                    success: false,
                    message: 'El id del producto no es valido'
                })
        }
        const categorySearch = await Category.findById(req.body.category);
        if (!categorySearch) return res.status(400).send('Categoria invalida');

        await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, data) => {
            if (err) return res.status(500).json({ success: false, err });
            res.json({ success: true, data });
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            error
        })
    }

})

//Delete product
router.delete('/:id', (req, res) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).
                json({
                    success: false,
                    message: 'El id del producto no es valido'
                })
        }
        Product.findByIdAndRemove(req.params.id).then(product => {
            if (product) { return res.status(200).send('Producto eliminado') }
            else {
                return res.status(404).
                    json({
                        success: true,
                        message: 'Hubo un error, no se pudo eliminar'
                    })
            }
        })
            .catch(error => {
                return res.status(404).json({
                    success: false,
                    error
                })
            })
    } catch (error) {
        return res.status(404).json({
            success: false,
            error
        })
    }
})

//Count number products in database
router.get('/get/count', async (req, res) => {
    try {
        const productCount = await Product.countDocuments(count => count);
        if (!productCount) {
            return res.status(404).send('No tienes productos para mostrar')
        }
        res.json({
            success: true,
            productCount
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            error
        })
    }
})


//Get Feature products
router.get('/get/featured/:count', async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 0;
        const product = await Product.find({ isFeatured: true }).limit(+count);
        if (!product) {
            return res.status(404).send('No tienes productos para mostrar')
        }
        res.json({
            success: true,
            product
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            error
        })
    }
})

//Filtering product by categories
router.get('/', async (req, res) => {
    try {

        let filter = {};

        if (req.query.categories) {
            filter = { category: req.query.categories.split(',') };
        }

        const product = await Product.find(filter).populate('category');

        if (!product) {
            return res.status(404).send('No tienes productos para mostrar')
        }
        res.json({
            success: true,
            product
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            error
        })
    }
})

//Gallery images products
router.put('/gallery-images/:id', multerSetting.array('images',10), async (req, res) => {
    try {

        if (!isValidObjectId(req.params.id)) {
            return res.status(400).
                json({
                    success: false,
                    message: 'The product id invalid'
                })
        }
        const files = req.files;
        let imagesPath = [];
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        if(files){
            files.map( f => {
                imagesPath.push(`${basePath}${f.filename}`);
            })
        }
       
   let productGallery = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images:imagesPath
            },{
                new:true
            });

            if (!productGallery) {
                return res.status(404).send('The product cannot updated')
            }
            return res.json({
                success: true,
                productGallery
            });

    } catch (error) {
        return res.status(404).json({
            success: false,
            error
        })
    }
})

module.exports = router;