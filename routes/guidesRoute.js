const express = require('express');
const router = express.Router();
const guideCtrl = require("../controllers/guideCtrl");
const mwToken = require('../middlewares/tokenMw');

router.get("/", guideCtrl.getGuidesList);
router.put("/update", guideCtrl.updateGuide);
router.delete("/delete", guideCtrl.deleteGuide);

router.post("/single-parcours", guideCtrl.getSingleGuide);

module.exports = router;