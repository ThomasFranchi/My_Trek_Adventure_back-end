require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const mwCORS = require('./middlewares/corsMw');
const mwToken = require('./middlewares/tokenMw');
const loginRoute = require("./routes/loginRoute");
const registerRoute = require("./routes/registerRoute");
const parcoursRoute = require("./routes/parcoursRoute");
const treksRoute = require("./routes/treksRoute");
const guidesRoute = require("./routes/guidesRoute");
const clientsRoute = require("./routes/clientsRoute");

require(".//dbConnect/connect");

const app = express();
app.use(logger('dev'));
app.use(express.json());

app.use("/register", registerRoute);
app.use(mwCORS);
app.use("/login", loginRoute);

app.use("/parcours", mwToken, parcoursRoute);
app.use("/treks", mwToken, treksRoute);
app.use("/guides", mwToken, guidesRoute);
app.use("/clients", mwToken,clientsRoute);

module.exports = app;