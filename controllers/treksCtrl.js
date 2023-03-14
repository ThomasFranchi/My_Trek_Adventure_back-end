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
    return res.json(list);
  },
  async getTreksForParcours(req, res) {
    const slug = req.params.slug;
    const parcours = await parcoursModel.findOne({slug: slug});
    if (!parcours)
    {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    console.log(parcours._id)

    const list = await treksModel.find({parcoursID: parcours._id});
    if (!list) {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
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
    if (!parcoursId) {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }

    const guideId = await guidesModel.findOne({ slug: guide }).exec();
    if (!guideId) {
      return res
        .status(422)
        .json({ message: "L'opération n'a pas pu être effectuée" });
    }
    let trekName = "Trek du " + beginDate.slice(0,10);
    let trekSlug = "trek-" + beginDate.slice(0,10) + endDate.slice(0,10);

    let newTreks = new treksModel({
      trekName: trekName,
      beginDate: beginDate,
      endDate: endDate,
      minPlaces: minPlaces,
      maxPlaces: maxPlaces,
      parcoursID: parcoursId._id,
      guideID: guideId._id,
      slug: trekSlug,
      trekState: "En attente"
    });

    newTreks.save().then(()=> {
        return res
        .status(201)
        .json({message: "Trek crée"});
    })
    .catch((err)=> {
        return res
        .status(422)
        .json({message: "Une erreur inattendue est survenue"}); 
    })
  },
  updateTrek(req, res) {},
  async getSingleTrek(req, res) {
    const slug = req.params.slug;
    console.log (slug);
    const trek = await treksModel.findOne ({slug: slug}).exec();
    if (!trek) {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }
    return res.json(trek);
  },
  async getTrekListForGuide(req, res) {
    const slug = req.params.slug;
    let guideSlug = slug.slice(6);
    const guideId = await guidesModel.findOne({ slug: guideSlug }).exec();
    if (!guideId) {
      return res
        .status(422)
        .json({ message: "L'opération n'a pas pu être effectuée" });
    }

    const trekList = await treksModel.find ({guideID: guideId._id}).exec();
    if (!trekList) {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }
    return res.json(trekList);
    /*return res
        .status(200)
        .json({ message: "L'opération n'a pas pu être effectuée" });*/
  }
};
module.exports = treksCtrl;
