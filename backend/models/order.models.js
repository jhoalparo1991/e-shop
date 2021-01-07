const { Schema,model,ObjectId } = require('mongoose');

const orderSchema = new Schema({
    orderItems:[{
        type: ObjectId,
        ref:'OrderItems',
        require:true
    }],
    shippingAddress1:{
        type:String,
        required:true
    },
    shippingAddress2:{
        type:String,
        default:''
    },
    city:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'Pending'
    },
    totalPrice:{
        type:Number        
    },
    user:{
        type:ObjectId,
        ref:'User',
        required:true
    },
    dateOrder:{
        type:Date,
        default:Date.now
    }
})

orderSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

orderSchema.set('toJSON',{
    virtuals:true
})

exports.Orders = model('Order',orderSchema);
