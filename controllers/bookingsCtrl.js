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
  },
  
  // Get a bookings list for a user, using its id
  async getBookingsForUser(req, res) {
  }
};
module.exports = bookingsCtrl;