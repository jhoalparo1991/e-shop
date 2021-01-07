const express = require('express');
const bodyParser = require('body-parser'); 
const morgan = require('morgan');
const cors = require('cors');
require('dotenv/config');

//Initialization
const app = express();
const authJwt =  require('./helpers/jwt');
const errorHandler =  require('./helpers/error-handler');

//Setting
app.set('port',process.env.PORT || 3000);

//middlewares
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.options('*',cors());
app.use(authJwt())
app.use(errorHandler)

//routes
app.use('/',require('./routers/index.routers'));

//Database
require('./database');

//Starting server
app.listen(app.get('port'), ()=> 
    console.log(`Server on port ${app.get('port')}`)
);