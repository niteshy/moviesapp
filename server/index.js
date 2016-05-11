/**
 * Created by niteshyadavcse on 1/5/16.
 */

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var _ = require('lodash');

// Create the application.
var app = express();

// Add Middleware necessary for REST API's
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Connect to MongoDB
var dbURI = 'mongodb://localhost/meanapp';
mongoose.connect(dbURI, function (err) {
    if (err) {
        console.log("Could not able to connect mongo - %s, err - %s", dbURI, err)
    } else {
        console.log("Connected to Mongo");
    }
});

mongoose.connection.error("error", function (err, val) {
    console.log('connection error:', err, val);
});


mongoose.connection.error("connected", function (err) {
    console.log('connection connected', err);
});

mongoose.connection.once('open', function() {

    // Load the models.
    app.models = require('./models/index');

    // Load the routes.
    var routes = require('./routes');
    _.each(routes, function(controller, route) {
        app.use(route, controller(app, route));
    });

    console.log('Listening on port 3000...');
    app.listen(3000);
});

