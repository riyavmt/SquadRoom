const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click",logout);
const list = document.getElementById("usersList");
let users=[];
let flag=false;
function searchUser(){
    alert("Here is the user you are trying to find");
}
window.addEventListener('DOMContentLoaded',async() =>{
    try {
        
        const userListResponse = await axios.get("http://localhost:3000/users-list");
        console.log(userListResponse.data);
        users =[...userListResponse.data];
        console.log(users)
    } catch (error) {
        
    }    
})

function createGroup(){
    // alert("Group Created");
    const checkboxes = document.querySelectorAll('.user-list input[type="checkbox"]');
    const checkedValues = [];
  
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        checkedValues.push(checkbox.value);
      }
    });
  
    console.log(checkedValues);
    document.getElementById('close').click();
}


function showUsersList(element){
    // console.log(users)
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



function logout(e){
    e.preventDefault();
    const logoutConfirmed = window.confirm("Are you sure you want to logout?");
    if(logoutConfirmed){
        window.location.href = "/Frontend/User/login.html"
    }
}
