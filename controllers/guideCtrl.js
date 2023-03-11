const guidesModel = require("../models/guidesModel");

const guidesCtrl = {

  //Get all the guides in the database
  async getGuidesList(req, res) {
    const list = await guidesModel.find({});
    if (!list) {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    return res.json(list);
  },

  // Update a guide with all the new informations 
  updateGuide(req, res) {},

  // Delete a guide form the database
  async deleteGuide(req, res) {
    const { slug } = req.body;

    const guide = await guidesModel.deleteOne({ slug: slug });
    if (!guide) {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    return res.status(200).json({ message: "Guide supprimé" });
  },

  // Get a single guide with its slug
  async getSingleGuide(req, res) {
    const slug = req.params.slug;
    const guide = await guidesModel.findOne({ slug: slug }).exec();
    if (!guide) {
      return res
        .status(422)
        .json({ message: "L'opération n'a pas pu être effectuée" });
    }
    return res.json(guide);
  },

  // Get a single guide with its ObjectID
  async getSingleGuideById(req, res) {
    let guideID = req.params.id.slice(4);
    console.log("guideID " + guideID);
    const guide = await guidesModel.findOne ({_id: guideID}).exec();
    if (!guide)
    {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }
    return res.json(guide);
  }
};
module.exports = guidesCtrl;
