const treksModel = require("../models/treksModel");
const parcoursModel = require ("../models/parcoursModel");
const guidesModel = require ("../models/guidesModel");

const dateFormatting = Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short"
});

const treksCtrl = {
  // Get all dates for all parcours
  async getTreksList(req, res) {
    const list = await treksModel.find({});
    if (!list) {
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
    return res.json(list);
  },
  // Get a list of dates for a parcours
  async getTreksForParcours(req, res) {
    const parcours = await parcoursModel.findOne({slug: req.params.slug});
    if (!parcours)
    {
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }

    const list = await treksModel.find({parcoursID: parcours._id});
    if (!list) {
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
    return res.json(list);
  },
  async createTrek(req, res) {
    const { beginDate, endDate, parcours, guide, minPlaces, maxPlaces } = req.body;

    const parcoursId = await parcoursModel.findOne ({slug: parcours} ).exec();
    if (!parcoursId) {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }

    const guideId = await guidesModel.findOne({ slug: guide }).exec();
    if (!guideId) {
      return res.status(422).json({ message: "L'opération n'a pas pu être effectuée" });
    }

    // Create a name
    const dateFormat = body.user.beginDate.slice(8)+"/"+body.user.beginDate.slice(5,7)+"/"+body.user.beginDate.slice(0,4);
    let trekName = "Trek du " + dateFormat;
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
      trekState: "A venir"
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
  async updateTrek(req, res) {
    const body = req.body;   
    console.log(req.body);
    const trek = await treksModel.findOne({slug: body.slug}).exec();
    if (!trek) {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }

    // Update the slug pertaining to the new name
    if (body.user.beginDate !== "" && body.user.endDate !== "") {
      const dateFormat = body.user.beginDate.slice(8)+"/"+body.user.beginDate.slice(5,7)+"/"+body.user.beginDate.slice(0,4);
      let trekName = "Trek du " + dateFormat;
      let trekSlug = "trek-" + body.user.beginDate.slice(0,10) + body.user.endDate.slice(0,10);
    }
    else
    {
      if (body.user.beginDate !== "") {
        const dateFormat = body.user.beginDate.slice(8)+"/"+body.user.beginDate.slice(5,7)+"/"+body.user.beginDate.slice(0,4);
        let trekName = "Trek du " + dateFormat;
        let trekSlug = "trek-" + body.user.beginDate.slice(0,10) + trek.endDate.toString().slice(0,10);
      }
      if (body.user.endDate !== "") {
        let trekSlug = "trek-" + trek.beginDate.toString().slice(0,10) + body.user.endDate.slice(0,10);
      }
    }
    
    if (body.user.minPlaces !== "") {
      trek.minPlaces = body.user.minPlaces;
    }
    if (body.user.maxPlaces !== "") {
      trek.maxPlaces = body.user.maxPlaces;
    }
    if (body.user.trekState !== "") {
      trek.trekState = body.user.trekState;
    }

    // Update the trek
    try {
      await trek.save();
      return res.status(200).json({ status: 200, message: "Trek modifié" });
    } catch(e) {
      console.log(e);
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },
  async getSingleTrek(req, res) {
    console.log (req.params.slug);
    const trek = await treksModel.findOne ({slug: req.params.slug}).exec();
    if (!trek) {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }
    return res.json(trek);
  },
  async getTrekListForGuide(req, res) {
    const guideId = await guidesModel.findOne({ slug: req.params.slug }).exec();
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
  }
};
module.exports = treksCtrl;
