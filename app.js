const express = require('express');
const logger = require('morgan');
const mwCORS = require('./middlewares/corsMw');
const loginRoute = require("./routes/loginRoute");
const registerRoute = require("./routes/registerRoute");
const parcoursRoute = require("./routes/parcoursRoute");
const treksRoute = require("./routes/treksRoute");
const guidesRoute = require("./routes/guidesRoute");

require(".//dbConnect/connect");

const app = express();
app.use(logger('dev'));
app.use(express.json());

app.use(mwCORS);
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/parcours", parcoursRoute);
app.use("/treks", treksRoute);
app.use("/guides", guidesRoute);

module.exports = app;