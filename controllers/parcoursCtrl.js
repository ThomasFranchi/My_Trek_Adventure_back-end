const parcoursModel = require("../models/parcoursModel");

const parcoursCtrl = {

  // Get all parcours in database
  async getParcoursList(req, res) {
    const list = await parcoursModel.find({});
    console.log (list);
    if (!list) {
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
    return res.json(list);
  },
  
  // Create a parcours in the database
  createParcours(req, res) {
    const { name, duration, description, price, difficulty, country } = req.body;

    // Check if evertyhing is good (typeof, unemptiness, regexp validation)
    if (typeof name !== "string" || typeof description !== "string" ||  typeof country !== "string") {
      return res.status(422).json({ message: "Un ou plusieurs champs ne sont pas du bon type" });
    }
    if ( name === "" || description === ""  || country === "") {
      return res.status(422).json({ message: "Un ou plusieurs champs sont vides" });
    }

    let parcoursSlug = name.toLowerCase();
    parcoursSlug = parcoursSlug.replaceAll(" ", "-");

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
      country: country
    });

    newParcours.save().then(() => {
        return res.status(201).json({ message: "Parcours crée" });
    })
      .catch((err) => {
        return res.status(422).json({ message: "Une erreur inattendue est survenue" });
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

    if (req.file) {
      parcours.parcoursPicture = "/uploads/"+req.file.filename;
    }
    if (body.duration) {
      parcours.duration = body.duration;
    }
    if (body.description) {
      parcours.description = body.description;
    }
    if (body.price) {
      parcours.price = body.price;
    }
    if (body.difficulty) {
      parcours.difficulty = body.difficulty;
    }
    if (body.country) {
      parcours.country = body.country;
    }

    // Update the parcours

    try {
      await parcours.save();
      return res.status(200).json({ status: 200, message: "Parcours modifié" });
    } catch(e) {
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Delete a parcours
  async deleteParcours(req, res) {
    const { slug } = req.body;

    const parcours = await parcoursModel.deleteOne({ slug: slug });
    if (!parcours) {
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
    return res.status(200).json({ message: "Parcours supprimé" });
  },

  // Create a step in the parcours
  async createStep(req, res) {
    // Update the slug pertaining to the new name
    let stepSlug = req.body.stepName.toLowerCase().replaceAll(" ", "-");

    let imgPath = "/uploads/"+req.file.filename;

    // Update the slug pertaining to the new name
    const newStep = await parcoursModel.updateOne({slug: req.body.slug}, {$push: { 
        steps:{
          stepName: req.body.stepName, 
          stepLatitude: req.body.stepLatitude,
          stepLongitude: req.body.stepLongitude,
          stepPicture: imgPath,
          stepDescription: req.body.stepDescription,
          stepSlug: stepSlug
      }}}, {new: true, upsert:true});
  
      if (!newStep) {
        return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
      }
      return res.status(200).json({ message: "Etape ajoutée" });
  },

    // Update a step in the parcours
  async updateStep(req, res) {
    const body = req.body; 
    console.log(body);
    console.log(body);
    console.log(req.file);
    // Look if the step exists
    const parcoursStep = await parcoursModel.findOne ({steps: { $elemMatch: { stepSlug: body.stepSlug } } }).exec();
    if (!parcoursStep) {
      return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }

    if (body.name) {
      parcoursStep.name = body.name;
      parcoursStep.slug = body.name.toLowerCase().replaceAll(" ", "-")
    }
    if (req.file) {
      parcoursStep.stepPicture = "/uploads/"+req.file.filename;
    }
    if (body.latitude) {
      parcoursStep.stepLatitude = body.latitude;
    }
    if (body.longitude) {
      parcoursStep.stepLongitude = body.longitude;
    }
    if (body.description) {
      parcoursStep.stepDescription = body.description;
    }
    
    try {
      await parcoursStep.save();
      return res.status(200).json({ status: 200, message: "Etape modifiée" });
    } catch(e) {
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Delete a step in the parcours
  async deleteStep(req, res) {
    const {slug, stepSlug} = req.body;

    // Look if the parcours exists
    const parcours = await parcoursModel.findOne ({slug: slug}).exec();
    if (!parcours) {
      return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }

    // Update the parcours by deleting the step
    const step = await parcoursModel.updateOne({$pull:{steps:{stepSlug: stepSlug }}});
    if (!step) {
      return res.status(500).json({ message: "Une erreur inattendue s'est produite" });
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

  // Get a single parcours, according to its id 
  async getSingleParcoursById(req, res) {
    const parcours = await parcoursModel.findOne ({_id: req.params.id}).exec();
    if (!parcours) {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }
    return res.json(parcours);
  },
  // Get a single parcours, according to its id 
  async filterParcoursByName(req, res) {
    console.log("filterParcoursByName");
    const parcours = await parcoursModel.find ({name: { '$regex' : req.params.name, '$options' : 'i' } }).exec();
    if (!parcours) {
      return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }
    return res.json(parcours);
  },
  async duoFilter(req, res) {
    console.log(req.params);
    console.log(req.params.price);
    console.log(req.params.difficulty);
    let parcours;
    // Si prix > 0 et difficulté > 0
    if (req.params.price > 0 && req.params.difficulty > 0)
    {
      console.log("Option 1");
      parcours = await parcoursModel.find ({difficulty: {$eq: req.params.difficulty}, price:{$lt: req.params.price}} ).exec();
    }
    else{
    // Si prix > 0 et difficulté = 0
    if (req.params.price > 0)
    {
      console.log("Option 2");
      parcours = await parcoursModel.find ({price:{$lte: req.params.price}} ).exec();
    }
    // Si prix = 0 et difficulté > 0
    if (req.params.difficulty > 0)
    {
      console.log("Option 3");
      parcours = await parcoursModel.find ({difficulty: {$eq: req.params.difficulty}} ).exec();
    }
  }

    /*const parcours = await parcoursModel.find ({difficulty: {$eq: req.params.difficulty}, price:{$lt: req.params.price}} ).exec();*/
    if (!parcours) {
      return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }
    return res.json(parcours);
    return res.status(200).json({message:"Retour"});
  }
};
module.exports = parcoursCtrl;