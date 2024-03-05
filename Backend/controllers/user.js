const jwt = require('jsonwebtoken');
const Users = require('../model/user');
const bcrypt = require('bcrypt');
const Sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

exports.postSignup = async(req,res)=>{//post req received by the backend
    const password = req.body.password;//password is retrieved from the data sent in the req
    try{
        const userData = await Users.findOne({where:{email:req.body.email}}); //checking if email exists in the user model
        if(!userData){//if email doesnt exist, we proceed to the password part
            const saltRounds = 10;// string randomization number
            bcrypt.hash(password,saltRounds,async(err,hash)=>{//hashing the password
                if(err){
                    console.log(err)//error during hashing
                }
                else{
                    const newUser = await Users.create({name:req.body.name,email:req.body.email,contact:req.body.contact,password:hash});// hashed password is stored along with other signup details
                    res.json({user:newUser,message:"Account Created Successfully!!"});
                }
            })
        }
        else{
            res.json({message:"Email already exists! Please login.",userFound:true});//account already exists with the given email
        }
    }
    catch(err){
        console.log(err);
    }
}

const secretKey = process.env.JWT_SECRET


function generateToken(id,name){//function to generate token for authentication
    return jwt.sign({userId:id,name:name},secretKey)
}
exports.postLogin = async(req,res)=>{//req received by the BE
    try{
        const userData = await Users.findOne({where:{email:req.body.email}});//checking if email exists
        console.log(userData);
        if(userData){//if email exists
            const userPassword = userData.password; //password is retrieved
            const result = await bcrypt.compare(req.body.password,userPassword,(err,result)=>{//the password submitted and hashed password is compared
                if(err){
                    throw new err("Something went wrong")//error during comparison
                }
                else if(result===true){//if paassword matches
                    res.json({message:"Successfully logged in!",userData:true,token:generateToken(userData.id, userData.name)});//
                }
                else{
                    res.json({message:"Incorrect Password"});//if password doesn't match
                }
            })
        }
        else{
            res.json({message:"Invalid Email/Password"})//if email doesnt exist
        }
    }
    catch(err){
        console.log(err);
    }

}

exports.getUsersList = async(req,res)=>{
    try{
        const userList = await Users.findAll({
            attributes: ['name']
        });
        res.json(userList); 
    }
    catch(err){
        console.log(err);
    }
}