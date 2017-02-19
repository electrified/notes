#!/usr/bin/env node
const http = require('http');
const path = require('path');
const flash = require('connect-flash');
const express = require('express');
const passport = require("passport");

const config = require('config');
require("./auth");
const app = express();
const favicon = require('serve-favicon');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const compress = require('compression');
const errorhandler = require('errorhandler');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'notes'
});

app.set('bookshelf', exports.bookshelf);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('x-powered-by', false);

app.use(compress());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(session({
  secret: '1112345678891',
  saveUninitialized: true,
  resave: true,
  cookie: {
    httpOnly: false
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

var oneWeek = 604800000 * 60;

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: oneWeek
}));

app.use('/', require('./routes/ui/index.js'));

/*
 *  API routes
 */
app.use('/api/users', require('./routes/api/user.js'));
app.use('/api/posts', require('./routes/api/post.js'));
app.use('/api/assets', require('./routes/api/asset.js'));
app.use('/api/comment', require('./routes/api/comment.js'));
app.use('/api/app', require('./routes/api/app.js'));

if ('development' === app.get('env')) {
  log.info("dev mode");
  app.use(errorhandler());

  var compiler = webpack(webpackConfig);

  app.use(require("webpack-dev-middleware")(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath
  }));

  app.use(require("webpack-hot-middleware")(compiler));
}

http.createServer(app).listen(config.get('port'), config.get('ipaddress'), () => {
  log.info('Node server started on %s:%d ...', config.get('ipaddress'), config.get('port'));
  log.info('DB user: %s Database: %s', config.get('connection.user'), config.get('connection.database'));
});
