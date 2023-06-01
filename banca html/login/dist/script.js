
function onLoginBtnClicked() {
  let email = document.getElementsByClassName("input-login-form")[0].value;
  let password = document.getElementsByClassName('input-login-form')[1].value;
  const url = `http://localhost:8081/user/login?email=${email}&password=${password}`;
  fetch(url, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json '
    },
  })
    .then(response =>{
      if(response.headers.get('Content-Length') !== '0'){
        return response.json();
      }
      else{
        showToast("Incorrect credentials provided!");
        return;
      }
    })
    .then(data => {
      localStorage.setItem("loggedUser", data.id); //se seteaza in localstorafe id user
      if(data.role === 2){
        window.location.href = "../../homepage/dist/loggedDonor.html";
      }
      else if(data.role === 1){
        window.location.href = "../../my account/doctoraccount.html";
      }
      else if(data.role === 0){
        window.location.href = "../../lista-doctori/dist/list.html";
      }
    });

}

function showToast(message) { //mesajul de credentiale gresite
  var toast = document.getElementById("toast");
  toast.innerHTML = message;
  toast.classList.add("show");
  setTimeout(function(){
    toast.classList.remove("show");
  }, 3000);
}