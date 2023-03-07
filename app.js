const express = require('express');
const logger = require('morgan');

const mwCORS = require('./middlewares/corsMw');

var app = express();

require(".//dbConnect/connect");

app.use(logger('dev'));
app.use(express.json());

app.use(mwCORS);

module.exports = app;