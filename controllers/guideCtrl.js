const guidesModel = require("../models/guidesModel");

const guidesCtrl = {
  async getGuidesList(req, res) {
    const list = await guidesModel.find({});
    if (!list) {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    console.log(list);
    return res.json(list);
  },
  updateGuide(req, res) {},
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
  async getSingleGuide(req, res) {
    const slug = req.params.slug;
    const guide = await guidesModel.findOne({ slug: slug }).exec();
    console.log(guide);
    if (!guide) {
      return res
        .status(422)
        .json({ message: "L'opération n'a pas pu être effectuée" });
    }
    return res.json(guide);
  },
  async getSingleGuideById(req, res) {
    const slug = req.params.id;
    const guide = await guidesModel.findOne({ _id: id }).exec();
    console.log(guide);
    if (!guide) {
      return res
        .status(422)
        .json({ message: "L'opération n'a pas pu être effectuée" });
    }
    return res.json(guide);
  }
};
module.exports = guidesCtrl;
