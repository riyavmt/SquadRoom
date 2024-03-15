const Message = require("../model/message");
const Group = require("../model/group");
const UserGroup = require("../model/userGroup");
const User = require("../model/user");
exports.postMessage = async(req,res)=>{
    try{
        console.log(req.user);
        const newMessage = await Message.create({message:req.body.message, userId: req.user.userId, groupId:req.body.groupId});
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
exports.postCreateGroup = async(req,res)=>{
    try{
        const newGroup = await Group.create({name:req.body.name});
        console.log(req.body);
        console.log(newGroup);
        const userIds = req.body.userIds;
        for (const userid of userIds) {


            const userGroup = await UserGroup.create({
                userId: userid,
                groupId: newGroup.id,

            });
            console.log(userGroup);
        }
        res.json(newGroup);
    }
    catch(err){
        console.log(err);
    }
}

exports.getGroup = async(req,res)=>{
    try{
        const groups = await UserGroup.findAll({where:{userId:req.user.userId}});
        console.log("userid",req.user);
        console.log("Group",groups);
        const result = [];
        for(const group of groups){
            const groupId = group.groupId
            const groupName = await Group.findOne({where:{id:groupId}});
            // console.log("Hi",groupName.name);
            
            result.push({groupId,groupName:groupName.name});
            console.log("Result",result);
            
        }
        res.json(result);
    }
    catch(err){
        console.log(err);
    }
}