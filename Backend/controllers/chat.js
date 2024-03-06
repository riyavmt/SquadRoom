const Message = require("../model/message");

exports.postMessage = async(req,res)=>{
    try{
        console.log(req.user);
        const newMessage = await Message.create({message:req.body.message, userId: req.user.userId, groupId:1});

    }
    catch(err){
        console.log(err);
    }
}
exports.getMessage = async(req,res)=>{
    try{
        const messages = await Message.findAll({where:{groupId:req.query.groupId}});
        console.log(messages);
        res.json(messages);
    }
    catch(err){
        console.log(err);
    }
}