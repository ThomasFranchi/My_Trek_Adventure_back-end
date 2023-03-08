const treksModel = require("../models/treksModel");
const parcoursModel = require ("../models/parcoursModel");

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
  createTrek(req, res) {
    const {
      beginDate,
      endDate,
      /*parcoursID,
       *guideID,*/
      minPlaces,
      maxPlaces,
    } = req.body;

    // recuperer le nom du parcours ?
    //let treksSlug = ?.toLowerCase();
    //treksSlug = treksSLug.replace(" ", "-");

    let newTreks = new treksModel({
      beginDate: beginDate,
      endDate: endDate,
      minPlaces: minPlaces,
      maxPlaces: maxPlaces,
      trekID: "TEST01",
      guideID: "GUIDE01",
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
