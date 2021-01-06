const { Router } = require('express');
const { Category } = require('../models/category.models');
const router = Router();

//get all categories
router.get('/', async (req, res) => {
    try {
        const categoryList = await Category.find();
        if (!categoryList) {
            return res.status(500).send('No tienes categorias para mostrar')
        }
        res.json({
            success:true,
            categoryList
        })
    } catch (error) {
        return res.status(404).json({
            success : false,
            error
        })
    }
});

//Get one category by id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(500).send('No se consiguio ninguna categoria con este parametro ' + id);
        }
        res.json({
            success: true,
            category
        })
    } catch (error) {
        return res.status(404).json({
            success : false,
            error
        })
    }
});

//create new category
router.post('/', async (req, res) => {
    try {
        const { name,icon,color } = req.body;

        const newCategory = new Category({
            name,
            icon,
            color
        });

        let category = await newCategory.save();
        if (!category) {
            return res.status(500).send('No se pudo crear la categoria')
        }
        res.json({
            category
        })

    } catch (error) {
        return res.status(404).json({
            success : false,
            error
        })
    }
})

//delete categoria by id
router.delete('/:id',(req,res)=>{
    try {
        const { id } = req.params;
        Category.findByIdAndRemove(id).then( category => {
            if (category){ return res.status(200).send('Categoria eliminada con exito')}
            else { return res.status(404).send('No se pudo eliminar la categoria')}
         
        }).catch(err => {
            return res.status(404).json({
                success : false,
                error : err
            })
        })

     
    } catch (error) {
        return res.status(404).json({
            success : false,
            error
        })
    }
})

//update new category
router.put('/:id',(req, res) => {
    try {
        const { id } = req.params;
        Category.findOneAndUpdate(id,req.body,{new:true})
            .then( category => {
                if(category) { return res.status(200).send('Categoria actualizada')}
                else { return res.status(404).json({
                    success:false,
                    message:'No se pudo modificar la categoria'
                })}
            })
        
    } catch (error) {
        return res.status(404).json({
            success : false,
            error
        })
    }
})

//export routes
module.exports = router;