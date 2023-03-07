const express = require('express');
const router = express.Router();
const registerCtrl = require("../controllers/registerCtrl");

router.post("/admin", registerCtrl.registerAdmin);
router.post("/guide", registerCtrl.registerGuide);
router.post("/user", registerCtrl.registerUser);

module.exports = router;