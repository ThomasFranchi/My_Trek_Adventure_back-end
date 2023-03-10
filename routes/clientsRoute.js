const express = require('express');
const router = express.Router();
const clientsCtrl = require("../controllers/clientCtrl");
const loginCtrl = require("../controllers/loginCtrl");
const mwToken = require('../middlewares/tokenMw');

router.get("/", clientsCtrl.getClientsList);
router.put("/update", clientsCtrl.updateClient);
router.delete("/delete", clientsCtrl.deleteClient);
router.get("/:slug", clientsCtrl.getSingleClient);
router.get("/userinfos", mwToken, loginCtrl.getCurrentUser);

module.exports = router;