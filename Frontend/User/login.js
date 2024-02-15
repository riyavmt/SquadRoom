const form = document.getElementById('myForm');
form.addEventListener("submit",login);

async function login(e){
    e.preventDefault();
    let loginData ={
        email:e.target.email.value,
        password: e.target.password.value
    }
    try{
        const res = await axios.post("http://localhost:3000/login",loginData);
        const alert = document.getElementById('messageAlert');
        if(res.data.userData){
            alert.innerHTML = res.data.message;
            alert.style.color = "Blue";
            window.location.href="/Frontend/Chat/chat.html"
            
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