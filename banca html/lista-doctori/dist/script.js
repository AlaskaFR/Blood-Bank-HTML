
function onAddDoctorBtnClicked() {
    let firstName = document.getElementsByClassName('input-edit-doctor')[0].value;
    let lastName = document.getElementsByClassName('input-edit-doctor')[1].value;
    let locationId = parseInt(document.getElementsByClassName('input-edit-doctor')[2].value);
    let email = document.getElementsByClassName('input-edit-doctor')[3].value;
    let password = document.getElementsByClassName('input-edit-doctor')[4].value;
    const url = `http://localhost:8081/doctor/add?email=${email}&password=${password}&firstName=${firstName}&lastName=${lastName}&locationId=${locationId}`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json '
        },
    });
}

window.onload = function () {
    const personList = document.getElementById('doctorList');
    const urlGetDoctors = `http://localhost:8081/doctors`;
    fetch(urlGetDoctors, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json '
        },
    }
    )
        .then(response => response.json()) //deserializez contentul venit din backend
        .then(doctors => {
            doctors.forEach(doctor => {
                fetch(`http://localhost:8081/user/getById?id=${doctor.userId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json '
                        },
                    })
                    .then(response => response.json()) //deserialization x2 cu email si parola
                    .then(user => {
                        const tr = document.createElement('tr'); //tr= tabel row
                        const firstNameTd = document.createElement('td'); //td=table data
                        const lastNameTd = document.createElement('td');
                        const locationsTd = document.createElement('td');
                        const emailTd = document.createElement('td');
                        const passwordTd = document.createElement('td');
                        const actionTd = document.createElement('td');

                        const addBtn = document.querySelector('.add-btn');
                        const form = document.querySelector('.form-update');

                        firstNameTd.innerText = doctor.firstName;
                        firstNameTd.id = doctor.id;
                        lastNameTd.innerText = doctor.lastName;
                        locationsTd.innerText = doctor.locationId;
                        emailTd.innerText = user.email;
                        passwordTd.innerText = user.password;

                        const editBtn = document.createElement('button');
                        editBtn.classList.add("edit-btn");
                        editBtn.setAttribute("data-doctor-id", doctor.id);
                        editBtn.innerText = 'Edit';
                        editBtn.addEventListener('click', () => { //cand se da click incarcam in form ce este deja 
                            const row = editBtn.closest('tr');
                            const cells = row.querySelectorAll('td');
                            const firstName = cells[0].textContent;
                            const lastName = cells[1].textContent;
                            const locations = cells[2].textContent;
                            const email = cells[3].textContent;
                            const password = cells[4].textContent;
                            const editRowInput = form.querySelector('input[name="edit-row"]');
                            const firstNameInput = form.querySelector('input[type="text"][placeholder="First Name"]');
                            const lastNameInput = form.querySelector('input[type="text"][placeholder="Last Name"]');
                            const locationsInput = form.querySelector('input[type="text"][placeholder="Locations"]');
                            const emailInput = form.querySelector('input[type="text"][placeholder="Email"]');
                            const passwordInput = form.querySelector('input[type="text"][placeholder="Password"]');
                            editRowInput.value = row.rowIndex;
                            firstNameInput.value = firstName;
                            firstNameInput.id = doctor.id;
                            lastNameInput.value = lastName;
                            locationsInput.value = locations;
                            emailInput.value = email;
                            passwordInput.value = password;
                            form.style.display = 'block';
                            addBtn.style.display = 'none';
                        });

                        actionTd.appendChild(editBtn);
                        const deleteBtn = document.createElement('button');
                        deleteBtn.classList.add("delete-btn");
                        deleteBtn.innerText = 'Delete';
                        deleteBtn.addEventListener('click', () => {
                            const row = deleteBtn.closest('tr'); //sterge din front doctorul
                            row.parentNode.removeChild(row);
                            deleteDoctor(doctor.id); //aici sterg din backend
                        });

                        actionTd.appendChild(deleteBtn);

                        tr.appendChild(firstNameTd);
                        tr.appendChild(lastNameTd);
                        tr.appendChild(locationsTd);
                        tr.appendChild(emailTd);
                        tr.appendChild(passwordTd);
                        tr.appendChild(actionTd);

                        personList.appendChild(tr);
                    })
            })
        })
        .catch(error => {
            console.error('Error fetching doctors:', error);
        });
};

function updateDoctor(firstNameInput, lastNameInput, locationsInput, emailInput, passwordInput, doctorId) { //cal catre backend de update
    const url = `http://localhost:8081/doctor/edit?id=${doctorId}&email=${emailInput}&password=${passwordInput}&firstName=${firstNameInput}&lastName=${lastNameInput}&locationId=${locationsInput}`;
    fetch(url, {
        method: 'PUT',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json '
        },
    }
    );
}

function deleteDoctor(doctorId){
    const url = `http://localhost:8081/doctor/delete?id=${doctorId}`;
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json '
        },
    }
    );
}
