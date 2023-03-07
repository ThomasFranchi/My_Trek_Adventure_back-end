const express = require('express');
const logger = require('morgan');
const mwCORS = require('./middlewares/corsMw');
const loginRoute = require("./routes/loginRoute");
const registerRoute = require("./routes/registerRoute");

require(".//dbConnect/connect");

const app = express();
app.use(logger('dev'));
app.use(express.json());

app.use(mwCORS);
app.use("/login", loginRoute);
app.use("/register", registerRoute);

module.exports = app;