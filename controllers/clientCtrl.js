const bcrypt = require('bcrypt');
const usersModel = require ("../models/usersModel");

const clientsCtrl = {

  // Get the users list form the database
  async getClientsList(req, res) {
    const list = await usersModel.find({});
    if (!list) {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    return res.json(list);
  },

  // Update the user with all the new informations 
  async updateClient(req, res) {
    const body = req.body; 
    const client = await usersModel.findOne({ slug: body.slug }).exec();
    if (!client) {
      return res
        .status(422)
        .json({ message: "L'opération n'a pas pu être effectuée" });
    }
    if (body.firstName && body.lastName) {
      client.firstName = body.firstName;
      client.lastName = body.lastName;
      client.slug = body.firstName.toLowerCase().replaceAll(" ", "-") + client.lastName.toLowerCase().replaceAll(" ", "-");
    }
    else 
    {
      if (body.firstName) {
        client.firstName = body.firstName;
        client.slug = body.firstName.toLowerCase().replaceAll(" ", "-") + client.lastName.toLowerCase().replaceAll(" ", "-");
      }
      if (body.lastName) {
        client.lastName = body.lastName;
        client.slug = client.firstName.toLowerCase().replaceAll(" ", "-") + body.lastName.toLowerCase().replaceAll(" ", "-");
      }
    }   
    client.mail = body.mail ?? client.mail;

    client.userPicture = "/uploads/"+req.file.filename ?? client.userPicture;

    if (body.password) {
      const hashedPwd = bcrypt.hashSync(body.password, 10, (err, hash) => {
        if (err)
        {
            return res.status(500).json({message: "Erreur inconnue"});
        }
        body.password = hash;
      })
    }
    try {
      await client.save();
      return res.status(200).json({ message: "Client modifié" });
    } catch(e) {
      return res
      .status(500)
      .json({ message: "Une erreur inattendue s'est produite" });
    }
  },

  // Delete a client
  async deleteClient(req, res) {
    const {slug} = req.body;
    const client = await usersModel.deleteOne({ slug: slug });
    if (!client) {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    return res.status(200).json({ status: "200", message: "Client supprimé" });
  },

  // Get a single client by its slug
  async getSingleClient(req, res) {
    const slug = req.params.slug;
    const client = await usersModel.findOne({ slug: slug }).exec();
    if (!client) {
      return res
        .status(422)
        .json({ message: "L'opération n'a pas pu être effectuée" });
    }
    return res.status(422).json(client);
  },
  async getSingleClientById(req, res) {
    const client = await usersModel.findOne({ _id: req.params.id }).exec();
    if (!client) {
      return res
        .status(422)
        .json({ message: "L'opération n'a pas pu être effectuée" });
    }
    return res.json(client);
  }
};
module.exports = clientsCtrl;