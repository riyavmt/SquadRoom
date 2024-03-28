const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click",logout);
const list = document.getElementById("usersList");
const container = document.querySelector(".message-container");
const token = localStorage.getItem('token');
const username = localStorage.getItem('userName');
const form = document.getElementById("chatPage");
const div = document.querySelector(".user-list");
const chatdiv = document.querySelector(".chat-name");
const groupName = document.getElementById("groupname");
const groupChatName = document.getElementById("groupChatName");

form.addEventListener("submit",sendMessage);
var io;
const socket = io('http://16.170.165.137/');
let users=[];
let flag=false;
let currentGroupId;

socket.on('connect',()=>{
    console.log(`Connected to ${socket.id}`)
})
socket.on('received-message',(data)=>{
    console.log(data)
    displayMessage(data);
})


function searchUser(){
    alert("Here is the user you are trying to find");
}

async function fetchUsersList(){
    try{
        const userListResponse = await axios.get("http://16.170.165.137/users-list",{
            headers:{
                'Authorization':`${token}`
            }
        });
        console.log(userListResponse.data);
        users =[...userListResponse.data];
        console.log(users)
    }
    catch(err){
        console.log(err);
    }
}
   
function showUsersList(element){
    // console.log(users);
    const listContainer = document.querySelector('.list-container');
    flag=!flag;
    list.innerHTML='';
    listContainer.style.display='none';

    if(flag){
        listContainer.style.display='block';
        list.innerHTML='<p>List of users:</p>';
        users.forEach((element) =>{
            const li = document.createElement('li');
            li.innerHTML = `<span>${element.name}</span>
            <button class = "btn btn-sm btn-dark" id = "chat" onclick = "chat()"> Chat </button>`;
            list.appendChild(li);
        })
    }
    
}

function showUsersListInModal(){
    users.forEach((element) =>{
        console.log(element);
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" name="element.name" value="${element.id}" >${element.name}</input>`;
        div.appendChild(li);
    });
    
}

async function createGroup(){
        // alert("Group Created");
        try{
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const checkedValues = [];
            checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkedValues.push(checkbox.value);
            }
            });
        
            console.log(checkedValues);

            


            document.getElementById('close').click();
            const groupNameValue = `${groupName.value}`;
            const groupDetails = {
                name:groupNameValue,
                userIds:checkedValues
            }
            const res = await axios.post("http://16.170.165.137/createGroup",groupDetails,{
                headers:{
                    'Authorization':`${token}`
                }
            });
            showGroup(res.data.id,groupNameValue);
            showChat(res.data.id);
            showGroupInfo(res.data.id);
            
        }
        catch(err){
            console.log(err);
        }

}

async function getGroup(){
    try{
        
        const res = await axios.get("http://16.170.165.137/getGroup",{
            headers:{
                'Authorization':`${token}`
            }
        }); 
        res.data.forEach(group => {showGroup(group.groupId , group.groupName)});
    }
    catch(err){
        console.log(err);
    }
}

function showGroup(id,groupName){
        const li = document.createElement("li");
        li.innerHTML=`${groupName}`;
        li.addEventListener("click",()=>showChat(id,groupName));
        chatdiv.prepend(li);
        
}

const groupInfo = document.querySelector(".group-info");

async function showGroupInfo(id){
    groupInfo.style.display = "block"
    try{
        const res = await axios.get(`http://16.170.165.137/get-members?groupId=${currentGroupId}`);
        const membersList = document.getElementById('members-list');  
        document.getElementById('total-members').innerHTML=`Total Members - ${res.data.length}`;
        //to clear the memberslist ul
        membersList.innerHTML='';
        
        res.data.forEach(member => {
            const li = document.createElement('li');
            li.id = member.userId;
            li.innerHTML = `<span>${member.name}</span>`;
            console.log(li)
            membersList.appendChild(li);
        })

    }
    catch(err){
        console.log(err);
    }

}


function showChat(id,groupName){
    console.log(id);
    currentGroupId=id;
    groupInfo.style.display='none';
    if(currentGroupId) {
        socket.emit('leave-group', currentGroupId);
    } 
    socket.emit('group-join',id);
    document.getElementById('groupname').innerText=groupName;
    // document.getElementById('groupChatName').innerText=groupName;
    groupChatName.textContent = groupName; 
    groupChatName.addEventListener("click",()=>showGroupInfo(id));
    fetchMessages();
    
}

async function sendMessage(e){
    e.preventDefault();
    const message = e.target.message.value;
    const messageData = {
        message : message,
        groupId: currentGroupId,
        username:username,
        type:"text"
    }
    try{
        socket.emit("message",messageData);
        displayMessage(messageData);
        form.reset();
        const res = await axios.post("http://16.170.165.137/message",messageData,{
            headers: {
                'Authorization' : `${token}`
            }
        });
        
    }
    catch(err){ 
        console.log(err);
    }
}

function sendFile(){
    document.getElementById('fileInput').click();
}

async function handleFile(files){
    console.log(files);
        try {
            const formData = new FormData();
            formData.append("file", files[0]);

            const response = await axios.post(`http://16.170.165.137/sendFile?groupId=${currentGroupId}`, formData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('in ')
            console.log(response.data.chat.message);
            const messageData = {
                message : response.data.chat.message,
                groupId: currentGroupId,
                username:username,
                type:"image/png"
            }
            socket.emit("message",messageData);
            displayMessage(messageData);
        } catch (error) {
            console.error('Upload failed:', error);
        }

}

function displayMessage(messageData){
    console.log("display:",messageData);
    const div = document.createElement('div');
    let messageInput = '';
    const img = `<img style="width: 150px; height: 150px;" src="${messageData.message}" alt="Image"></img>`
    // if(username===messageData.username){
    //     div.innerHTML = `<p class = "self"> You: ${messageData.message}</p>`;
    // }
    // else  div.innerHTML = `<p class = "other"> ${messageData.username}: ${messageData.message}</p>`;
    if(messageData.type==="text"){
         messageInput = username===messageData.username?`<p class = "self"> You: ${messageData.message}</p>`:`<p class = "other"> ${messageData.username}: ${messageData.message}</p>`
    }
    else if(messageData.type=="image/png"){
         messageInput = username===messageData.username?`<p class = "self"> You: ${img}</p>`:`<p class = "other"> ${messageData.username}: ${img}</p>`
    }
    
    div.innerHTML = messageInput
    container.appendChild(div);
}


async function fetchMessages(){
    try{
        container.innerHTML = ""; 
        const response = await axios.get(`http://16.170.165.137/message?groupId=${currentGroupId}`,
        {
            headers:{
                'Authorization': `${token}`
            }
        });
        console.log("resdata",response.data);
        localStorage.setItem("Messages",JSON.stringify(response.data));
        
        response.data.forEach((element) =>{
            displayMessage({message:element.message,username:element.user.name,type:element.type});
        });
    }
    catch (err){
        console.log(err);
    }
};
window.addEventListener("DOMContentLoaded", async () =>{
    try{
        await fetchMessages(); 
        // startInterval();
        await fetchUsersList();
        showUsersListInModal();
        await getGroup();
        document.querySelector('.chat-name').firstElementChild.click();
    } 
    catch(err){
        console.log(err);
    }
});

// let intervalId =null;

// function startInterval(){
//     if(intervalId){
//         clearInterval(intervalId);
//         intervalId = null; // Set intervalId to null after clearing
//     }
//     else{
//         intervalId = setInterval(fetchMessages, 100000);
//     }
// } 

function logout(e){
    e.preventDefault();
    const logoutConfirmed = window.confirm("Are you sure you want to logout?");
    if(logoutConfirmed){
        window.location.href = "/User/login.html"
    }
};