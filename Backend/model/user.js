const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("user",{
    id:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    contact: Sequelize.INTEGER
});

module.exports = User;