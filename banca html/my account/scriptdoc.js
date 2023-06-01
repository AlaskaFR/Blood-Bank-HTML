window.onload = function () {
    fetchAppointments();
};

function fetchAppointments() {
    const loggedUserId = localStorage.getItem("loggedUser"); // Retrieve the doctor's ID from local storage

    // Make a request to fetch appointments for the logged-in doctor
    fetch(`http://localhost:8081/appointments?doctorId=${loggedUserId}`)
        .then(response => response.json())
        .then(appointments => {
            const appointmentsBody = document.getElementById('appointments-body');
            appointmentsBody.innerHTML = '';

            appointments.forEach(appointment => {
                const row = document.createElement('tr');
                const dateCell = document.createElement('td');
                const timeCell = document.createElement('td');
                const actionsCell = document.createElement('td');

                dateCell.textContent = appointment.date;
                timeCell.textContent = appointment.time;

                const acceptButton = document.createElement('button');
                acceptButton.textContent = 'Accept';
                acceptButton.classList.add('accept-button');
                acceptButton.addEventListener('click', function() {
                    acceptButton.classList.add('accepted');
                    row.classList.add('accepted');
                    // Add your logic for accepting the appointment here
                    // For example, you can send an API request to update the appointment status to accepted
                });

                const declineButton = document.createElement('button');
                declineButton.textContent = 'Decline';
                declineButton.classList.add('decline-button');
                declineButton.addEventListener('click', function() {
                    declineButton.classList.add('declined');
                    row.classList.add('declined');
                    // Add your logic for declining the appointment here
                    // For example, you can send an API request to update the appointment status to declined
                });

                actionsCell.appendChild(acceptButton);
                actionsCell.appendChild(declineButton);

                row.appendChild(dateCell);
                row.appendChild(timeCell);
                row.appendChild(actionsCell);

                appointmentsBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching appointments:', error);
        });
}
