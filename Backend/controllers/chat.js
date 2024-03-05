const Message = require("../model/message");

exports.postMessage = async(req,res)=>{
    try{
        console.log(req.user);
        const newMessage = await Message.create({message:req.body.message, userId: req.user.userId});

    }
    catch(err){
        console.log(err);
    }
}