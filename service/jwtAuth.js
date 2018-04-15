const config = require('../config/keys'); // get our config file
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const _ = require('lodash')
const User = require('../models/user')

module.exports = async (req, res, next) => {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.cookie;
    if (_.isEmpty(token)) { return res.status(401).send('Unauthenticated')}
    
    try {
        let authData = await jwt.verify(token, config.jwtSecret)
        next()
    } catch(err){
        console.log(err)
        return res.status(403).send(err)
1    }
    // decode token
    // if (token) {
    //     // verifies secret and checks exp
    //     jwt.verify(token, config.jwtSecret, function(err, decoded) {
    //         if (err){
    //             return res.json({
    //                 success: false,
    //                 message: 'Failed to authenticate token.'
    //             });
    //         } else {
    //             User.findOne({token: token}, function(err, user){
    //                 if(err) throw err;
    //                 // if everything is good, save to request for use in other routes
    //                 if(user){
    //                     req.decoded = decoded;
    //                     next();
    //                 }else{
    //                     return res.json({
    //                         success: false,
    //                         message: 'Failed to authenticate token.'
    //                     });
    //                 }
    //             })
    //         }
    //     });

    // } else {
    //     return res.status(403).send({
    //         success: false,
    //         message: 'No token provided.'
    //     });
    // }
}
