const usersModel = require ("../models/usersModel");

const clientsCtrl = {
  async getClientsList(req, res) 
  {
    const list = await usersModel.find({});
    console.log(list);
    if (!list) 
    {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    console.log(list);
    return res.json(list);
  },
  updateClient(req, res) {},
  async deleteClient(req, res) 
  {
    const {slug} = req.body;
    console.log(slug);
    const client = await usersModel.deleteOne({ slug: slug });
    if (!client) 
    {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    return res.status(200).json({ status: "200", message: "Client supprimé" });
  },
  async getSingleClient(req, res) {
    const slug = req.params.slug;
    const client = await usersModel.findOne({ slug: slug }).exec();
    if (!client) {
      return res
        .status(422)
        .json({ message: "L'opération n'a pas pu être effectuée" });
    }
    return res.status(422).json(client);
  }
};
module.exports = clientsCtrl;