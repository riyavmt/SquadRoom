const jwt = require("jsonwebtoken");
const User = require("../model/user");


const secretKey = process.env.JWT_SECRET


// jwt.verify decodes the token, verifies its signature using the provided secret key, 
// and performs optional checks to ensure the token's validity. 
// If everything checks out, it returns the decoded payload, which often includes user information. 
// If any part of the verification fails, an error is raised.

const authenticate = async (req,res,next)=>{
    try{
        const token = req.header("Authorization");
        // console.log(token);
        const user = jwt.verify(token, secretKey);
        const userFound = await User.findByPk(user.userId);
        if(userFound){
            // console.log(JSON.stringify(user));
            req.user = user;
            next();
        }
        else{
            throw new Error("User not Found")
        }
            
    }
    catch(err){
        console.log(err);
        return res.status(401).json({userDetails:false})
    }
        
}
 module.exports = {authenticate}