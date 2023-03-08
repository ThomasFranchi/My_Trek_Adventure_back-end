const parcoursModel = require("../models/parcoursModel");

const parcoursCtrl = {
  async getParcoursList(req, res) {
    const list = await parcoursModel.find({});
    if (!list) {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    console.log(list);
    return res.json(list);
  },
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

    // Save ne parcours to the parcours database
    let newParcours = new parcoursModel({
      name: name,
      duration: duration,
      description: description,
      price: price,
      slug: parcoursSlug,
      picture: picture,
      difficulty: difficulty,
    });

    newParcours
      .save()
      .then(() => {
        return res.status(201).json({ message: "Parcours crée" });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(422)
          .json({ message: "Une erreur inattendue est survenue" });
      });
  },
  updateParcours(req, res) {},
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
  async createStep(req, res) {
    const {
      step: [
        {
          stepName,
          stepLocation: [{ lattitude, longitude }],
          stepPicture, 
          stepDescription,
        },
      ],
    } = req.body;

    let newStep = new parcoursModel({
        stepName: stepName, 
        lattitude: lattitude, 
        longitude: longitude, 
        stepPicture: stepPicture, 
        stepDescription: stepDescription,
    }); 

    newStep.save().then(()=>
    {
        return res
        .status(201)
        .json({message: "Etapes crée"});
    })
    .catch((err)=>
    {
        console.log(err); 
        return res
        .status(422)
        .json({message: "Une erreur inattendue est survenue"}); 
    })
  },
  async updateStep(req, res) {},
  async deleteStep(req, res) {
    const { stepName } = req.body;
  },
};
module.exports = parcoursCtrl;
