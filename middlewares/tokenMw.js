const jwt = require("jsonwebtoken");

const secretKey = require ("../config/configSecretKey");

async function token (req, res, next) 
{
    /*console.log(req.body);
    const token = String(req.get("Authorization")).split(" ")[1];
    console.log(token);
    //Verifing if token is valid
    if (!token)
    {
        return res.status(401).json({message:"Aucun token trouvé"});
    }

    try
    {
        const decodedToken = jwt.verify(token, 'th3g4m1ngl41rs3cr3tk3y');
        console.log(decodedToken);

        //if valid, get acess to user id
        const userId = decodedToken.userId;

        //Getting the user id
        const user = await usersMDL.findById(userId);
        // Verification du user
        if (!user)
        {
            throw new Error ("Aucun utilisateur trouvé");
        }

        //Send the infos
        req.user = user;
        next();
    }
    catch(error)
    {
        return res.status(400).json({message:"Token invalide"});
    }*/
}
module.exports = token;  