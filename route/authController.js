const express = require('express');
const router = express.Router();
const mongoose    = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const jwt    = require('jsonwebtoken');
const _ = require('lodash')
const keys = require('../config/keys');

var User   = require('../models/user'); // get our mongoose model
const validateJWT = require('../service/jwtAuth')

//create users
router.post('/register', async (req, res) => {
    // var {id, pw, pw2} = req.body
    let { id, pw, pw2 } = req.body;

    if (pw !== pw2) { return res.status(400).json('invalid password');}

    let userExist = await User.findOne({name: id}) !== null;
    if(userExist){ return res.status(400).json('userExisted');}

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(pw, salt, async(err, hash) => {
            // create a sample user
            var newUser = new User({
                name: id,
                password: hash,
                admin: null
            });

            try {
                await newUser.save();
                return res.status(200).json({ success: true });
            } catch(err) {
                console.log(err)
                return res.status(500).json({ success: false, errMsg: 'cant create user' });
            }
        });
    });
})

router.post('/normalLogin', async(req, res) => {
    let { id, pw } = req.body

    try {
        let user = await User.findOne({ name: id }).select('name').select('password');
        if (user === null) { return res.status(401).json({ errMsg: 'Unauthenticated'});}

        let passwordMatch = await bcrypt.compare(pw, user.password);
        if(passwordMatch){
            let payload = {
                userInfo: {
                    name: user.name,
                    _id: user._id
                }
            }
            let jwtOptions = {
                algorithm: 'HS256',
                // expiresIn: keys.jwtExpiredIn,
            }
            let token = jwt.sign( payload, keys.jwtSecret, jwtOptions );
            await User.findOneAndUpdate({ _id: user._id }, { $set: { token } }, { upsert: true });
            return res.status(200).json({
                success: true,
                token
            });
        }else{
            return res.status(401).json({ success: false, errMsg: 'Unauthenticated'});
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({ success: false, errMsg: 'Server error' });
    }
})

router.get('/ha', validateJWT ,async(req, res, next) => {
    return res.status(200).json({msg: 'this is working'})
})

// router.post('/refreshToken', async (req, res, next) => {
//     let token = req.headers['x-access-token'];

// })


// router.post('/refreshToken', function(req, res, next){
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];

//     if( token ){
//         jwt.verify( token, config.secret, function(err, decoded) {
//             var payload = jwt.decode(token);
//             var currentTime = ( moment().format('x') )/1000;

//             if(err){                                        // check if there are any error with toke
//                 if (err.name === 'TokenExpiredError' ) {    //check if error is cause by token expired

//                     if(!payload.firstTokenIssueAt){
//                         var tokenTime = ( moment(err.expiredAt).format('x') )/1000;
//                     } else {
//                         var tokenTime = payload.firstTokenIssueAt;
//                     }
//                     var forceExpired = currentTime - tokenTime < config.forceExpired
//                     var payload = {
//                         user: payload.user,
//                         firstTokenIssueAt: tokenTime
//                     }

//                     if(forceExpired){
//                         jwt.sign(payload, config.secret, {
//                             algorithm: 'HS256',
//                             expiresIn: config.tokenExpiredIn,
//                         }, function(err, token) {
//                             User.findOneAndUpdate({name: payload.user.name}, {$set:{token: token}}, {upsert: true}, function(err, data){
//                                 if(err) throw err
//                                 return res.json({
//                                     success: true,
//                                     message: 'Enjoy your token!!!!!',
//                                     token: token
//                                 });
//                             })
//                         })
//                     }else{
//                         return res.json({
//                             success: false,
//                             message: 'Expired token.'
//                         });
//                     }
//                 } else {
//                     return res.json({
//                         success: false,
//                         message: 'Failed to authenticate token.'
//                     });
//                 }
//             }else{

//                 if(payload.firstTokenIssueAt){
//                     var firstTokenIssueAt = payload.firstTokenIssueAt
//                 }else{
//                     var firstTokenIssueAt = payload.iat
//                 }
//                 var payload = {
//                     user: payload.user,
//                     firstTokenIssueAt
//                 }

//                 jwt.sign(payload, config.secret, {
//                     algorithm: 'HS256',
//                     expiresIn: config.tokenExpiredIn
//                 }, function(err, token) {
//                     User.findOneAndUpdate({name: payload.user.name}, {$set:{token: token}}, {upsert: true}, function(err, data){
//                         if(err) throw err
//                         return res.json({
//                             success: true,
//                             message: 'Enjoy your token!!!!!',
//                             token: token
//                         });
//                     })
//                 })
//             }

//         });
//     }else{
//         return res.status(403).send({
//             success: false,
//             message: 'No token provided.'
//         });
//     }
// })


module.exports = router
