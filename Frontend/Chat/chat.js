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
const socket = io('http://localhost:3000/');
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
        const userListResponse = await axios.get("http://localhost:3000/users-list",{
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
            const res = await axios.post("http://localhost:3000/createGroup",groupDetails,{
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
        
        const res = await axios.get("http://localhost:3000/getGroup",{
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
        const res = await axios.get(`http://localhost:3000/get-members?groupId=${currentGroupId}`);
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
        username:username
    }
    try{
        socket.emit("message",messageData);
        displayMessage(messageData);
        form.reset();
        const res = await axios.post("http://localhost:3000/message",messageData,{
            headers: {
                'Authorization' : `${token}`
            }
        });
    }
    catch(err){ 
        console.log(err);
    }
}

function displayMessage(messageData){
    console.log("display:",messageData);
    const div = document.createElement('div');
    if(username===messageData.username){
        div.innerHTML = `<p class = "self"> You: ${messageData.message}</p>`;
    }
    else  div.innerHTML = `<p class = "other"> ${messageData.username}: ${messageData.message}</p>`;
    container.appendChild(div);
}

async function fetchMessages(){
    try{
        container.innerHTML = ""; 
        const response = await axios.get(`http://localhost:3000/message?groupId=${currentGroupId}`,
        {
            headers:{
                'Authorization': `${token}`
            }
        });
        console.log("resdata",response.data);
        localStorage.setItem("Messages",JSON.stringify(response.data));
        
        response.data.forEach((element) =>{
            displayMessage({message:element.message,username:element.user.name});
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