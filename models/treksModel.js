const mongoose = require ("mongoose");

const treksSchema = new mongoose.Schema(
    {
        name: {type: String, unique: true, required: true},
        duration: {type: Number, required: true}, // Number of days
        description: {type: String, required: true},
        price: {type: Number, required: true},
        picture: {type: String, required: true},
        difficulty: {type: Number, required: true},
        steps:[{
            stepName: {type: String, required: true},
            stepLocation: [{
                latitude: {type: String, required: true},
                longitude: {type: String, required: true},
            }],
            stepPicture: {type: String, required: true},
            stepDescription: {type: String, required: true}
        }]
    }
)

module.exports = mongoose.model("treks", treksSchema);