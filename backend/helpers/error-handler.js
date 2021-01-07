function errorHandler(err,req,res,next){
    if(err.name === 'UnauthorizedError'){
        //validation error token
        return res.status(401).json({message:'User is not authorized'});
    }
    if(err.name === 'ValidationError'){
        //validation error default
        return res.status(401).json({message:err});
    }
    //validation error server
    return res.status(500).json({message:err});
}
module.exports = errorHandler;