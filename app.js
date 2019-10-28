const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const pathRoutes = require("./src/routes/pathRoute");
const resourceRoutes = require("./src/routes/resourceRoute");
const rootController = require('./src/controllers/rootController');


let headers = {};
app['setConfig'] = (configFileName) => {
    const config = require(`./${configFileName}`);
    // setting db connection - config
    const db = config && config['db'] ? config['db'] : {};
    mongoose.connect(db.url, db.options)
        .catch(err =>
            // FgRed = "\x1b[31m"
            console.error("\x1b[31m", "MongoDB connection error:", err)
        );

    headers = config && config['headers'] ? config['headers'] : {};
};

// setting headers - config
app.use((req, res, next) => {
    const all = headers && headers['all'] ? headers['all'] : {};
    res.set(all);
    if (req.method === "OPTIONS") {
        const options = headers && headers['options'] ? headers['options'] : {};
        res.set(options);
        return res.status(204).json({});
    }
    next();
});



// using jquery & jquery.json-viewer in views 
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery.json-viewer/json-viewer')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use(express.static(path.join(__dirname, 'node_modules/open-iconic/font')));
app.use(express.static(path.join(__dirname, 'public')));

// seting view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// for logging
app.use(morgan("dev"));

// for flashing success/error messages
app.use(cookieParser('keyboard cat'));
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'cookie_secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// middleware bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes which should handle requests
app.use("/r", resourceRoutes);
app.use("/p", pathRoutes);
app.use("/", (req, res, next) => {
    const urlPath = req.url.toLowerCase();
    urlPath === '/' ? res.redirect('/p') : next();
});
app.use(rootController.compareThenMockRes);

// handling path/recource errors
app.use((error, req, res, next) => {
    req.flash('error', error.message);
    console.error("error: ", error);
    res.redirect('back');
});

module.exports = app;