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
        const res = await axios.post("http://localhost:3000/signup",data);
        const alert = document.getElementById('messageAlert');
        if(res.data.userFound){
            alert.innerHTML = res.data.message;
            alert.style.textDecoration = "bold";
            alert.style.display = "block";
            alert.style.color = "Red";
        }
        else{
            alert.innerHTML= res.data.message;
            alert.style.display = "block";
            window.location.href="/login.html"
        }

    }
    catch(err){
        console.log(err)
    }
}