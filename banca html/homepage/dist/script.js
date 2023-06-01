window.onload = function () { //se apeleaza cand intru in pagina de appoinment
    getAllDoctors();
    getAllLocations();
    onHourChange();
}

function onHourChange(){
    const selectHour = document.getElementById('hour');
    const emptyOptionHour = document.createElement('option');
    emptyOptionHour.text = "";
    selectHour.innerHTML = '';
    selectHour.appendChild(emptyOptionHour);
    let urlGetHours = `http://localhost:8081/appointment/hours`;
    
    const select = document.getElementById('doctor');
    const selectedDoctor = select.selectedOptions[0];

    if(selectedDoctor.text !== ""){
        try{
            const date = document.getElementById('date').value;
            const dateObject = new Date(date);
            const isoDate = dateObject.toISOString().substr(0, 10); //transformam data in string YYYY-MM-DD
            urlGetHours = `http://localhost:8081/appointment/hours?doctorId=${selectedDoctor.id}&date=${isoDate}`
        }
        catch(e){
            urlGetHours = `http://localhost:8081/appointment/hours?doctorId=${selectedDoctor.id}`
        }
    }

    fetch(urlGetHours, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json '
        },
    })
        .then(response => response.json())
        .then(hours => {
            hours.forEach(hour => {
                const hourOption = document.createElement('option');
                hourOption.text = hour;
                selectHour.appendChild(hourOption);
            })
        })
}

function getAllDoctors(){
    const selectDoctor = document.getElementById('doctor');
    const emptyOptionDoctor = document.createElement('option');
    emptyOptionDoctor.text = "";
    selectDoctor.appendChild(emptyOptionDoctor);
    const urlGetDoctors = `http://localhost:8081/doctors`;
    fetch(urlGetDoctors, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json '
        },
    })
        .then(response => response.json())
        .then(doctors => {
            doctors.forEach(doctor => {
                const optionDoctor = document.createElement('option');
                optionDoctor.text = `${doctor.firstName}  ${doctor.lastName}`;
                optionDoctor.id = doctor.id;
                optionDoctor.value = doctor.locationId;
                selectDoctor.appendChild(optionDoctor);
            })
        })
}

function getAllLocations(){ //call din backend si iteram prin lista si creez options in frontend cu elementele din lista
    const urlGetLocations = `http://localhost:8081/locations`;
    const selectLocation = document.getElementById('location');
    const emptyOptionLocation = document.createElement('option');
    emptyOptionLocation.text = "";
    selectLocation.appendChild(emptyOptionLocation);
    fetch(urlGetLocations, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json '
        },
    })
        .then(response => response.json())
        .then(locations => {
            locations.forEach(location => {
                const optionLocation = document.createElement('option');
                optionLocation.text = location.address;
                optionLocation.id = location.id;
                selectLocation.appendChild(optionLocation);
            })
        })
}

function onLocationChange(){ //viceversa same logic
    const select = document.getElementById('location');
    const selectedLocation = select.selectedOptions[0];
    const selectDoctor = document.getElementById('doctor');
    selectDoctor.innerHTML = "";
    if(selectedLocation.text === ""){
        getAllDoctors();
        return;
    }
    const urlGetDoctors = `http://localhost:8081/doctor?locationId=${selectedLocation.id}`;
    fetch(urlGetDoctors, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json '
        },
    })
    .then(response => response.json())
    .then(doctors =>{
        doctors.forEach(doctor => {
            const optionDoctor = document.createElement('option');
            optionDoctor.text = `${doctor.firstName}  ${doctor.lastName}`;
            optionDoctor.id = doctor.id;
            optionDoctor.value = doctor.locationId;
            selectDoctor.appendChild(optionDoctor);
        })
    });
}

function onDoctorChange(){ // se trigger cand se alege un doctor din dropdown list
    onHourChange();
    const select = document.getElementById('doctor');
    const selectedDoctor = select.selectedOptions[0]; 
    const selectLocation = document.getElementById('location');
    selectLocation.innerHTML = ""; //se da clear la lista de locatii din html
    if(selectedDoctor.text === ""){  //daca selectez stringul gol iau toate locatiile de pe back
        getAllLocations();
        return;
    }

    const urlGetLocation = `http://localhost:8081/location?id=${selectedDoctor.value}`;
    fetch(urlGetLocation, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json '
        },
    })
    .then(response => response.json())
    .then(location =>{
        const optionLocation = document.createElement('option');
        optionLocation.text = location.address;
        optionLocation.id = location.id;
        selectLocation.appendChild(optionLocation); //se pune fix locatia doctorului
    });
}

function onSubmitBtnClicked(event) {
    event.preventDefault();
    const select = document.getElementById('doctor');
    const selectedDoctor = select.selectedOptions[0];
    const time = document.getElementById('hour');
    const date = document.getElementById('date').value;
    const donorId = localStorage.getItem("loggedUser"); //id user logat din local storage
    const dateObject = new Date(date);
    const isoDate = dateObject.toISOString().substr(0, 10); //transformam data in string YYYY-MM-DD
    const urlAddApointment = `http://localhost:8081/appointment/add?doctorId=${selectedDoctor.id}&donorId=${donorId}&date=${isoDate}&time=${time.value}`; //call de appoinment catre backend
    fetch(urlAddApointment, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*', //transfer de json intre front-back
            'Content-Type': 'application/json '
        },
    })
    window.location.href = "../../homepage/dist/loggedDonor.html"; //redirectionare 
}

function getBadge() {
    const donorId = localStorage.getItem("loggedUser"); // ID-ul utilizatorului logat
  
    // Apelăm backend-ul pentru a obține badge-ul utilizatorului
    fetch(`http://localhost:8081/badge/${donorId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      // Actualizăm imaginea și numele badge-ului în HTML
      const badgeImage = document.getElementById('badge-image');
      const badgeName = document.getElementById('badge-name');
      
      badgeImage.src = data.imageUrl;
      badgeName.textContent = data.name;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  
  // Apelăm funcția pentru a obține și afișa badge-ul utilizatorului
  getBadge();

  <script>
  // Get the badge image URL from the backend or set it manually
  var badgeImageUrl = "silver.png";

  // Update the badge image source
  var badgeImage = document.getElementById("badge-image");
  badgeImage.src = badgeImageUrl;
</script>
  
  