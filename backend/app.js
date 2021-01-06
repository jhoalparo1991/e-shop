const express = require('express');
const bodyParser = require('body-parser'); 
const morgan = require('morgan');
const cors = require('cors');
require('dotenv/config');

//Initialization
const app = express();


//Setting
app.set('port',process.env.PORT || 3000);

//middlewares
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.options('*',cors());



//routes
app.use('/',require('./routers/index.routers'));

//Database
require('./database');

//Starting server
app.listen(app.get('port'), ()=> 
    console.log(`Server on port ${app.get('port')}`)
);