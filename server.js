const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');  
const cors = require('cors');
require('dotenv').config();
const { CronJob } = require( 'cron');
const backup = require ('./Controllers/archivedChat');

const sequelize = require('./Backend/util/database');
const userRoute = require('./Backend/routes/user');
const chatRoute = require('./Backend/routes/chat');
const Users = require('./Backend/model/user');
const Group = require('./Backend/model/group');
const UserGroup = require('./Backend/model/userGroup');
const Message = require("./Backend/model/message");
const ArchivedChat = require("./Backend/model/archivedChat");
const socketIo = require('socket.io')
app.use(express.static(path.join(__dirname, 'Frontend')));
app.use(cors());

const http = require('http');
const server = http.createServer(app);
const io =socketIo(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(userRoute);
app.use(chatRoute);

Group.belongsToMany(Users, { through: UserGroup });
Users.belongsToMany(Group, { through: UserGroup });
Message.belongsTo(Users);
// Message.belongsTo(Group);

// io.on('connection',(socket)=>{
//     console.log(socket.id);
//     socket.on('group-join',(groupId)=>{
//         console.log('joined group=',groupId)
//         socket.join(groupId);
//     })

io.on("connection",(socket)=>{
    console.log(socket.id)

    socket.on("group-join",(groupId)=>{
        console.log("joined Group:",groupId);
        socket.join(groupId);
    })

    socket.on("message",(data)=>{
        console.log(data.groupId);
        socket.to(data.groupId).emit("received-message",data); 
        
    socket.on("leave-group",(groupId)=>{
        console.log("leftGroup: ",groupId);
        socket.leave(groupId);
    })    
    })
})

    // socket.on('message',(data)=>{
    //     console.log(data.groupId)
    //     console.log('helo')
    //     //this will send the message to everyone except the sender
    //     socket.to(data.groupId).emit('received-message',data);
    //     //this will send the message to everyone including the sender
    //     // io.broadcast.emit('received-message', data)
    // })
    // socket.on('leave-group',(groupId)=>{
    //     console.log('left group=',groupId)
    //     socket.leave(groupId);
    // })

// })


app.use((req,res)=>{
    if(req.url==='/') res.redirect('http://16.170.165.137/User/login.html')
    res.sendFile(path.join(__dirname,`Frontend/${req.url}`));
})
const job = new CronJob('00 00 00 * * *',backup);
job.start();
async function startServer(){
    try{
        await sequelize.sync({force:false});
        server.listen(3000,()=>{
            console.log("Server is running")
        })
    }
    catch(err){console.log(err)};
}
startServer();