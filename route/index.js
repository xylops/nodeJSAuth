var express = require('express');
var router = express.Router();
var mongoose    = require('mongoose');

router.get('/', function(req, res, next){
    res.render('index')
})

//routing for pages
router.get('/dashboard', ensureAuthenticated,  function(req, res, next){
    console.log(req)

    res.render('dashboard', { title: 'Hey', message: 'Hello This is the backend page!' })
})

router.get('/register', function(req, res) {
    res.render('register');
});

router.get('/login', function(req, res, next){
    res.render('login')
})

function ensureAuthenticated (req, res, next){

    next()
}


module.exports = router
