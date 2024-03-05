const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Group = sequelize.define("group",{
    id:{
       type: Sequelize.INTEGER,
       allowNull: false,
       autoIncrement:true,
       primaryKey:true
    },
    name:Sequelize.STRING,

})
module.exports = Group;