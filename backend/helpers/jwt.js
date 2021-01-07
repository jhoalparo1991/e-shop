const expressJwt = require('express-jwt');

function authJwt(){

    const secret = process.env.SECRET_JWT;
    const api_url = process.env.API;
    return expressJwt({
        secret,
        algorithms:['HS256']
    }).unless({
        path:[
            { url: /\/api\/v1\/products(.*)/, methods:['GET','OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods:['GET','OPTIONS'] },
        `${api_url}/users/login`,
        `${api_url}/users/register`
        ]
    })
}

module.exports = authJwt;