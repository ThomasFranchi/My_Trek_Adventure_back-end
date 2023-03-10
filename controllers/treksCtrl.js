const treksModel = require("../models/treksModel");
const parcoursModel = require ("../models/parcoursModel");
const guidesModel = require ("../models/guidesModel");

const treksCtrl = {
  async getTreksList(req, res) {
    const list = await treksModel.find({});
    if (!list) {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    console.log(list);
    return res.json(list);
  },
  async createTrek(req, res) {
    const {
      beginDate,
      endDate,
      parcours,
      guide,
      minPlaces,
      maxPlaces,
    } = req.body;

    const parcoursId = await parcoursModel.findOne ({slug: parcours} ).exec();
    if (!parcoursId)
    {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }

    const guideId = await guidesModel.findOne({ slug: guide }).exec();
    if (!guideId) {
      return res
        .status(422)
        .json({ message: "L'opération n'a pas pu être effectuée" });
    }

    let newTreks = new treksModel({
      beginDate: beginDate,
      endDate: endDate,
      minPlaces: minPlaces,
      maxPlaces: maxPlaces,
      parcoursID: parcoursId._id,
      guideID: guideId._id,
    });

    newTreks.save().then(()=>
    {
        return res
        .status(201)
        .json({message: "Trek crée"});
    })
    .catch((err)=>
    {
        console.log(err); 
        return res
        .status(422)
        .json({message: "Une erreur inattendue est survenue"}); 
    })
  },
  updateTrek(req, res) {},
};
module.exports = treksCtrl;
