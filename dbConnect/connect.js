const mongoose = require ("mongoose");
const dbURI = require('../config/configDB');

mongoose.connect(dbURI).then(() => 
    {
        console.log("Connecté à la base de données");
    }
);