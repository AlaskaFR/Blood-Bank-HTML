function onSignInSubmit() {
  let firstName = document.getElementsByClassName("input-signin-form")[0].value;
  let lastName = document.getElementsByClassName('input-signin-form')[1].value;
  let email = document.getElementsByClassName('input-signin-form')[2].value;
  let password = document.getElementsByClassName('input-signin-form')[3].value;
  let location = document.getElementsByClassName('input-signin-form')[4].value;
  let repeatPassword = document.getElementsByClassName('input-signin-form')[5].value;
  let bloodType = document.getElementsByClassName('input-signin-form')[6].value;

  const url = `http://localhost:8081/user/register?email=${email}&firstName=${firstName}&lastName=${lastName}&address=${location}&bloodType=${bloodType}&password=${password}&repeatPassword=${repeatPassword}`;
  fetch(url, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json '
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data === true) {
        window.location.href = "../../login/dist/login.html";
      } else {
        showToast("Ooops! Something went wrong!");
      }
    });

}

function showToast(message) {
  var toast = document.getElementById("toast");
  toast.innerHTML = message;
  toast.classList.add("show");
  setTimeout(function(){
    toast.classList.remove("show");
  }, 3000);
}
