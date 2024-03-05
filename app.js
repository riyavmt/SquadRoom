const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');  
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const sequelize = require('./Backend/util/database');
const userRoute = require('./Backend/routes/user');
const chatRoute = require('./Backend/routes/chat');
const Users = require('./Backend/model/user');
const Group = require('./Backend/model/group');
const UserGroup = require('./Backend/model/userGroup');
const Message = require("./Backend/model/message");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors()); 
app.use(userRoute);
app.use(chatRoute);

Group.belongsToMany(Users, { through: UserGroup });
Users.belongsToMany(Group, { through: UserGroup });

Message.belongsTo(Users);


async function startServer(){
    try{
        await sequelize.sync({force:false});
        app.listen(3000,()=>{
            console.log("Server is running")
        })
    }
    catch(err){console.log(err)};
}
startServer();
