const jwt = require('jsonwebtoken');
const Users = require('../model/user');
const bcrypt = require('bcrypt');
const Sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

exports.postSignup = async(req,res)=>{
    const password = req.body.password;
    try{
        const userData = await Users.findOne({where:{email:req.body.email}});
        if(!userData){
            const saltRounds = 10;
            bcrypt.hash(password,saltRounds,async(err,hash)=>{
                if(err){
                    console.log(err)
                }
                else{
                    const newUser = await Users.create({name:req.body.name,email:req.body.email,contact:req.body.contact,password:hash});
                    res.json({user:newUser,message:"Account Created Successfully!!"});
                }
            })
        }
        else{
            res.json({message:"Email already exists! Please login.",userFound:true});
        }
    }
    catch(err){
        console.log(err);
    }
}

const secretKey = process.env.JWT_SECRET


function generateToken(id,name){
    return jwt.sign({userId:id,name:name},secretKey)
}
exports.postLogin = async(req,res)=>{
    try{
        const userData = await Users.findOne({where:{email:req.body.email}});
        console.log(userData);
        if(userData){
            const userPassword = userData.password;
            const result = await bcrypt.compare(req.body.password,userPassword,(err,result)=>{
                if(err){
                    throw new err("Something went wrong")
                }
                else if(result===true){
                    res.json({message:"Successfully logged in!",userData:true,token:generateToken(userData.id, userData.name)});
                }
                else{
                    res.json({message:"Incorrect Password"});
                }
            })
        }
        else{
            res.json({message:"Invalid Email/Password"})
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