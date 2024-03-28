const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const { text } = require("body-parser");

const ArchivedChat = sequelize.define("archivedChat",{
    id:{
       type: Sequelize.INTEGER,
       allowNull: false,
       autoIncrement:true,
       primaryKey:true
    },
    message:Sequelize.STRING,
    groupId:Sequelize.INTEGER,
    type:{
        defaultValue:"text",
        type:Sequelize.STRING
    }
})
module.exports = ArchivedChat;