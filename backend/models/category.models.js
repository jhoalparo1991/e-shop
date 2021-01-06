const { Schema, model, ObjectId } = require('mongoose');

const categorySchema = new Schema({
        name:{
            type:String,
            required:true
        },
        icon:{
            type:String,
        },
        color:{
            type:String,
        }
},{
    skipVersioning:true
})

exports.Category = model('Category', categorySchema);