const express = require('express');
const app = express();
// const path = require('path');
// const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const keys = require('./config/keys');



//connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);

//setting View Engine using Handlebars
// app.set('views', path.join(__dirname, 'views'));
// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ================================
// routes =========================
// ================================
//require Routing
var auth = require('./route/authController')
//Routing for API
app.use('/auth', auth);
//Routing for page

// =======================
// start the server ======
// =======================
//Set port
const PORT = process.env.PORT || 3000;
//For Heroku
app.use(function (req, res, next) {
    if (req.headers['x-forwarded-proto'] === 'https') {
        res.redirect('http://' + req.hostname + req.url);
    } else {
        next();
    }
})
//Launch
app.listen(PORT, function () {
    console.log('Express server is up on port ' + PORT)
});
