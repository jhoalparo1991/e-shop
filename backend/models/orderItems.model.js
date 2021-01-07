const { Schema,model,ObjectId } = require('mongoose');

const OrderItemsSchema = new Schema({
    
    product:{
        type:ObjectId,
        ref:'Product',
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
})
OrderItemsSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

OrderItemsSchema.set('toJSON',{
    virtuals:true
})

exports.OrderItems = model('OrderItems',OrderItemsSchema);