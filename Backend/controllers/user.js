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
            res.json({message:"Email already exists",userFound:true});
        }
    }
    catch(err){
        console.log(err);
    }
}