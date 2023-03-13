const parcoursModel = require("../models/parcoursModel");

const parcoursCtrl = {

  // Get all parcours in database
  async getParcoursList(req, res) {
    const list = await parcoursModel.find({});
    console.log (list);
    if (!list) {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    return res.json(list);
  },
  
  // Create a parcours in the database
  createParcours(req, res) {
    const { name, duration, description, price, picture, difficulty } =
      req.body;

    // Check if evertyhing is good (typeof, unemptiness, regexp validation)
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof picture !== "string"
    ) {
      return res
        .status(422)
        .json({ message: "Un ou plusieurs champs ne sont pas du bon type" });
    }
    if (
      name === "" ||
      duration === "" ||
      description === "" ||
      picture === ""
    ) {
      return res
        .status(422)
        .json({ message: "Un ou plusieurs champs sont vides" });
    }

    let parcoursSlug = name.toLowerCase();
    parcoursSlug = parcoursSlug.replace(" ", "-");

    let imgPath = "/uploads/"+req.file.filename;

    // Save new parcours to the parcours database
    let newParcours = new parcoursModel({
      name: name,
      duration: duration,
      description: description,
      price: price,
      slug: parcoursSlug,
      parcoursPicture: imgPath,
      difficulty: difficulty,
    });

    newParcours
      .save()
      .then(() => {
        return res.status(201).json({ message: "Parcours crée" });
    })
      .catch((err) => {
        return res
          .status(422)
          .json({ message: "Une erreur inattendue est survenue" });
      });
  },

  // Update a parcours according to the new informations
  async updateParcours(req, res) {
    const body = req.body;   

    const parcours = await parcoursModel.findOne({slug: body.slug}).exec();
    if (!parcours) {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }

    // Update the slug pertaining to the new name
    if(body.name) {
      parcours.name = body.name;
      parcours.slug = body.name.toLowerCase().replaceAll(" ", "-")
    }

    parcours.duration = body.duration ?? parcours.duration;
    parcours.description = body.description ?? parcours.description;
    parcours.price = body.price ?? parcours.price;
    parcours.picture = body.picture ?? parcours.picture;
    parcours.difficulty = body.difficulty ?? parcours.difficulty;

    // Update the parcours

    try {
      await parcours.save();
      return res.status(200).json({ message: "Parcours modifié" });
    } catch(e) {
      return res
      .status(500)
      .json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Delete a parcours
  async deleteParcours(req, res) {
    const { slug } = req.body;

    const parcours = await parcoursModel.deleteOne({ slug: slug });
    if (!parcours) {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    return res.status(200).json({ message: "Parcours supprimé" });
  },

  // Create a step in the parcours
  async createStep(req, res) {
    const { slug, stepName, stepLatitude, stepLongitude, stepDescription } = req.body;

    // Update the slug pertaining to the new name
    let stepSlug = stepName.toLowerCase().replaceAll(" ", "-");

    let imgPath = "/uploads/"+req.file.filename;

    // Update the slug pertaining to the new name
    const newStep = await parcoursModel.updateOne({slug: slug}, {
      $push: { 
        steps:{
          stepName: stepName, 
          stepLatitude: stepLatitude,
          stepLongitude: stepLongitude,
          stepPicture: imgPath,
          stepDescription: stepDescription,
          stepSlug: stepSlug
      }}}, {new: true, upsert:true});
  
      if (!newStep) {
        return res
          .status(500)
          .json({ message: "Une erreur inattendue s'est produite" });
      }
      console.log(newStep);
      return res.status(200).json({ message: "Etape ajoutée" });
  },

    // Update a step in the parcours
  async updateStep(req, res) {
    const body = req.body; 

    // Look if the step exists
    const parcoursStep = await parcoursModel.findOne ({steps: { $elemMatch: { stepSlug: body.slug } } }).exec();
    console.log("parcoursStep");
    console.log(parcoursStep);

    if (body.name) {
      parcoursStep.name = body.name;
      parcoursStep.slug = body.name.toLowerCase().replaceAll(" ", "-")
    }

    if (body.stepPicture) {
      parcoursStep.stepPicture = "/uploads/"+req.file.filename;
    }

    parcoursStep.stepLatitude = body.stepLatitude ?? parcoursStep.stepLatitude;
    parcoursStep.stepLongitude = body.stepLongitude ?? parcoursStep.stepLongitude;
    parcoursStep.stepDescription = body.stepDescription ?? parcoursStep.stepDescription;

    // Update the step (TO-DO)
    try {
      await parcoursStep.save();
      return res.status(200).json({ message: "Etape modifiée" });
    } catch(e) {
      return res
      .status(500)
      .json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Delete a step in the parcours
  async deleteStep(req, res) {
    const {slug, stepSlug} = req.body;

    // Look if the parcours exists
    const parcours = await parcoursModel.findOne ({slug: slug}).exec();
    if (!parcours){
      return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }

    // Update the parcours by deleting the step
    const step = await parcoursModel.updateOne({$pull:{steps:{stepSlug: stepSlug }}});
    if (!step) {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    return res.status(200).json({ message: "Etape supprimée" });
  },

   // Get a single parcours, according to its slug 
  async getSingleParcours(req, res) {
    const slug = req.params.slug;
    const parcours = await parcoursModel.findOne ({slug: slug}).exec();
    if (!parcours) {
      return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }
    return res.json(parcours);
  },
  async getSingleParcoursById(req, res) {
    let parcoursID = req.params.id.slice(4);
    const parcours = await parcoursModel.findOne ({_id: parcoursID}).exec();
    if (!parcours) {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }
    return res.json(parcours);
  }
};
module.exports = parcoursCtrl;