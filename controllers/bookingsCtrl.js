const bcrypt = require('bcrypt');
const treksModel = require("../models/treksModel");

const bookingsCtrl = {

  // Get the bookings list form the database
  async getBookingsList(req, res) {
    const list = await treksModel.find({});
    if (!list) {
      return res
        .status(500)
        .json({ message: "Une erreur inattendue s'est produite" });
    }
    return res.json(list);
  },

  // Add a booking to a trek
  async addBooking(req, res) {
    const {trekID, userID } = req.body;

    // Find if the parcours exists, and if it exists, add a new booking
    const newBooking = await treksModel.updateOne({_id: trekID}, {
      $push: { 
        bookings:{
          userID: userID, 
          bookingDate: Date.now(),
          state: "En attente de paiement"
      }}}, {new: true, upsert:true});

      if (!newBooking) {
        return res
          .status(500)
          .json({ message: "Une erreur inattendue s'est produite" });
      }
      
      return res.status(200).json({ message: "Réservation ajoutée" });
  },
  
  // Get a bookings list for a user, using its id
  async getBookingsForUser(req, res) {
    let userID = req.params.id.slice(4);
    console.log("userID " + userID);
    const bookings = await treksModel.find ({_id: userID}).exec();
    if (!bookings)
    {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }
    return res.json(bookings);
  },
  async getMyBookings(req, res) {
    let userID = req.user._id;
    const bookings = await treksModel.find ({bookings:{$elemMatch:{userID: userID}}}, "beginDate endDate parcoursID guideID minPlaces maxPlaces trekName trekState").exec();
    if (!bookings)
    {
        return res.status(422).json({message:"L'opération n'a pas pu être effectuée"});
    }

    return res.json(bookings);
  },
};
module.exports = bookingsCtrl;