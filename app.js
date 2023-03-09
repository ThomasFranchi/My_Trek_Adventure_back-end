const mongoose = require ("mongoose");

const adminSchema = new mongoose.Schema(
    {
        mailAdress: {type: String, unique: true, required: true},
        password: {type: String, required: true, select: false}
    }
)

module.exports = mongoose.model("admins", adminSchema);
