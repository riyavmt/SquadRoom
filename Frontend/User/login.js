const form = document.getElementById('myForm');
form.addEventListener("submit",login);

async function login(e){
    e.preventDefault();
    let loginData ={//login details submitted
        email:e.target.email.value,
        password: e.target.password.value
    }
    try{
        const res = await axios.post("http://localhost:3000/login",loginData);//loginData is sent to the backend along with the post req
        const alert = document.getElementById('messageAlert');
        if(res.data.userData){
            alert.innerHTML = res.data.message;
            alert.style.color = "Blue";
            localStorage.setItem('token',res.data.token);
            localStorage.setItem('userName',res.data.userName);
            window.location.href="/Chat/chat.html"
            
        }
        else{
            alert.innerHTML = res.data.message;
            alert.style.color = "Red";
        }
        
    }
    catch(err){
        console.log(err)
    } 
}