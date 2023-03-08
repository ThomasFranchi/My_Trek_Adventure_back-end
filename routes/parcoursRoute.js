const express = require('express');
const router = express.Router();
const parcoursCtrl = require("../controllers/parcoursCtrl");
const mwToken = require('../middlewares/tokenMw');

router.get("/", parcoursCtrl.getParcoursList);
router.post("/add", parcoursCtrl.createParcours);
router.put("/update", parcoursCtrl.updateParcours);
router.delete("/delete", parcoursCtrl.deleteParcours);

router.put("/addstep", parcoursCtrl.createStep);
router.put("/updatestep", parcoursCtrl.updateStep);
router.delete("/deletestep", parcoursCtrl.deleteStep);

router.post("/single-parcours", parcoursCtrl.getSingleParcours);

module.exports = router;