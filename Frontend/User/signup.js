const form = document.getElementById('myForm');
form.addEventListener("submit",create);

async function create(e){
    e.preventDefault();
    let data = {
        name:e.target.name.value,
        email:e.target.mail.value,
        contact:e.target.contact.value,
        password:e.target.password.value,
    };
    try{
        const res = await axios.post("http://16.170.165.137:3000/signup",data);
        const alert = document.getElementById('messageAlert');
        if(res.data.userFound){//if account already exists
            alert.innerHTML = res.data.message;
            alert.style.textDecoration = "bold";
            alert.style.display = "block";
            alert.style.color = "Red";
        }
        else{
            alert.innerHTML= res.data.message;
            alert.style.display = "block";
            window.location.href="/Frontend/User/login.html"//moving to the login page as soon as the account is created successfully
        }

    }
    catch(err){
        console.log(err)
    }
}