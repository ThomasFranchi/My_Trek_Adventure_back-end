const express = require('express');
const router = express.Router();
const parcoursCtrl = require("../controllers/parcoursCtrl");

router.get("/", parcoursCtrl.getParcoursList);
router.post("/add", parcoursCtrl.createParcours);
router.put("/update", parcoursCtrl.updateParcours);
router.delete("/delete", parcoursCtrl.deleteParcours);

router.put("/addstep", parcoursCtrl.createStep);
router.put("/updatestep", parcoursCtrl.updateStep);
router.delete("/deletestep", parcoursCtrl.deleteStep);

router.get("/:slug", parcoursCtrl.getSingleParcours);

module.exports = router;