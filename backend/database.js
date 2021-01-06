const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify:false
})
.then( db => {
    console.log(`Database is connected to : ${db.connection.name}`);
})
.catch( err => { console.log(err)} )
