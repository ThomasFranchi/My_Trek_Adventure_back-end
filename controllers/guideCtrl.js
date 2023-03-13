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
  async updateGuide(req, res) {
    const body = req.body; 
    const guide = await guidesModel.findOne({ slug: body.slug }).exec();
    if (!guide) {
      return res
        .status(422)
        .json({ message: "L'opération n'a pas pu être effectuée" });
    }
    if (body.firstName && body.lastName) {
      guide.firstName = body.firstName;
      guide.lastName = body.lastName;
      guide.slug = body.firstName.toLowerCase().replaceAll(" ", "-") + client.lastName.toLowerCase().replaceAll(" ", "-");
    }
    else 
    {
      if (body.firstName) {
        guide.firstName = body.firstName;
        guide.slug = body.firstName.toLowerCase().replaceAll(" ", "-") + client.lastName.toLowerCase().replaceAll(" ", "-");
      }
      if (body.lastName) {
        guide.lastName = body.lastName;
        guide.slug = client.firstName.toLowerCase().replaceAll(" ", "-") + body.lastName.toLowerCase().replaceAll(" ", "-");
      }
    }
    guide.mail = body.mail ?? client.mail;

    guide.userPicture = "/uploads/"+req.file.filename ?? client.userPicture;

    if (body.password)
    {
      const hashedPwd = bcrypt.hashSync(guide.password, 10, (err, hash) =>
      {
        if (err)
        {
            return res.status(500).json({message: "Erreur inconnue"});
        }
        body.password = hash;
      })
    }
    
    guide.description = body.description ?? guide.description;
    guide.experienceYears = body.experienceYears ?? guide.experienceYears;
    guide.state = body.state ?? guide.state;

    try {
      await guide.save();
      return res.status(200).json({ message: "Guide modifié" });
    } catch(e) {
      return res
      .status(500)
      .json({ message: "Une erreur inattendue s'est produite" });
    }
  },

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
    const guide = await guidesModel.findOne ({_id: guideID}).exec();
    if (!guide)
    {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }
    return res.json(guide);
  }
};
module.exports = guidesCtrl;
