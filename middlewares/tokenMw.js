const jwt = require("jsonwebtoken");
const secretKey = require ("../config/configSecretKey");

const adminModel = require ("../models/adminsModel");
const guideModel = require ("../models/guidesModel");
const userModel = require ("../models/usersModel");

async function token (req, res, next) 
{
    const token = String(req.get("Authorization")).split(" ")[1];

    //Verifing if token is valid
    if (!token)
    {
        return res.status(401).json({message:"Aucun token trouvé"});
    }

    try
    {
        const decodedToken = jwt.verify(token, secretKey);
        console.log(decodedToken);

        //if valid, get acess to user id
        const userId = decodedToken.userId;
        console.log("userId " + userId);
        //Getting the user id
        const admin = await adminModel.findById(userId);
        const guide = await guideModel.findById(userId);
        const user = await userModel.findById(userId);
        // Verification du user
        if (!admin && !guide && !user)
        {
            console.log("Pas d'utilisateur trouvé");
            throw new Error ("Aucun utilisateur trouvé");
        }
        if (admin || guide || user)
        {
            console.log("personne trouvée");
            if (admin)
            {
                let user = admin;
                return res.json({user});
            } 
            if (guide)
            {
                let user = guide;
                return res.json({user});
            } 
            if (user)
            {
                return res.json({user});
            } 
        }
        next();
    }
    catch(error)
    {
        return res.status(400).json({message:"Token invalide"});
    }
}
module.exports = token;  