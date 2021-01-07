const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { isValidObjectId } = require('mongoose');
const jwt = require('jsonwebtoken');
const { User,UserSchema } = require('../models/user.model');
const router = Router();

//Get all users
router.get('/', async(req,res)=>{
    try {
        const user = await User.find().select('-passwordHash');
        if(!user) return res.status(400).json({ 
            success:false,
            message:'Users not found'
        })
        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            error
        })
    }
})

//Get user by id
router.get('/:id', async(req,res)=>{
    try {

        if(!isValidObjectId(req.params.id)){
            return res.status(400).json({ 
                success:false,
                message:'This id of user not found'
            })
        }
        const user = await User.findById(req.params.id).select('-passwordHash');
        if(!user) return res.status(400).json({ 
            success:false,
            message:'Users not found'
        })
        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            error
        })
    }
})

//Count users
router.get('/get/count', async(req,res)=>{
    try {

        const user = await User.countDocuments( count => count)
        if(!user) return res.status(400).json({ 
            success:false,
        })
        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            error
        })
    }
})

//Login
router.post('/login', async(req,res)=>{
    try {
        
       
        const secret = process.env.SECRET_JWT;
        const user = await User.findOne({email:req.body.email});
        const token = jwt.sign(
                { 
                userId : user.id,
                userIsAdmin : user.isAdmin
                },
                secret,
                {
                    expiresIn:'1d'
                }
            )
        if(!user) return res.status(404).send('Invalid email');

        if(user && bcrypt.compareSync(req.body.passwordHash,user.passwordHash)){
            return res.status(202).json({
                 success:true,
                 user : user.email,
                 token
                });
        }else{
            return res.status(404).send('Invalid password');
        }
    } catch (error) {
        return res.status(400).json({
            success:false,
            error
        })
    }
})

//Create new user
router.post('/register', async(req,res)=>{
    try {

        const user = new User({
            name:req.body.name,
            email:req.body.email,
            passwordHash: bcrypt.hashSync(req.body.passwordHash),
            street:req.body.street,
            apartment:req.body.apartment,
            city:req.body.city,
            zip:req.body.zip,
            country:req.body.country,
            phone:req.body.phone,
            isAdmin:req.body.isAdmin
        });

        user.save((err,data)=>{
            if(err) return res.status(400).json({success:false,err});
            return res.status(200).json({data});
        })


    } catch (error) {
        return res.status(400).json(
            {
                success : false,
                error
            }
        )
    }
})

//Delete users
router.delete('/:id', async(req,res)=>{
    try {

        if(!isValidObjectId(req.params.id)){
            return res.status(400).json({ 
                success:false,
                message : 'the user id  invalid'
            })
        }

        const user = await User.findByIdAndRemove(req.params.id);

        if(!user) return res.status(400).json({ 
            success:false,
            message:'Error deleting user'
        })
        return res.status(200).json({
            success:true,
            message:'User deleting successfully'
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            error
        })
    }
})

module.exports = router;

