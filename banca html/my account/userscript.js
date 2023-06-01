window.onload = function () {
    // Called when the appointments page is loaded
    fetchAppointments();
    fetchUserInformation();
  }
  
  function fetchUserInformation() {
    const donorTable = document.getElementById('donorTable');
    const urlGetDonor = `http://localhost:8081/user/register?firstName=${firstName}&lastName=${lastName}&email=${email}&bloodType=${bloodType}`; // Replace loggedDonorId with the ID of the logged donor
    fetch(urlGetDonor, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(donor => {
            const tr = document.createElement('tr');
            const firstNameTd = document.createElement('td');
            const lastNameTd = document.createElement('td');
            const emailTd = document.createElement('td');
            const bloodTypeTd = document.createElement('td');
            
            firstNameTd.innerText = donor.firstName;
            lastNameTd.innerText = donor.lastName;
            emailTd.innerText = donor.email;
            bloodTypeTd.innerText = donor.bloodType;
            
            tr.appendChild(firstNameTd);
            tr.appendChild(lastNameTd);
            tr.appendChild(emailTd);
            tr.appendChild(bloodTypeTd);
            
            donorTable.appendChild(tr);
        })
        .catch(error => {
            console.error('Error fetching donor:', error);
        });
}


  
  // Function to fetch and display appointments for the logged-in user
function fetchAppointments() {
  const loggedUserId = localStorage.getItem("loggedUser"); // Retrieve the user's ID from local storage

  // Make a request to fetch appointments for the logged-in user
  fetch(`http://localhost:8081/appointments?donorId=${loggedUserId}`)
    .then(response => response.json())
    .then(appointments => {
      const appointmentsBody = document.getElementById('appointments-body');
      appointmentsBody.innerHTML = '';

      // Pagination setup
      const itemsPerPage = 4; // Number of items to display per page
      let currentPage = 1; // Current page
      const totalItems = appointments.length; // Total number of items
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Total number of pages

      // Update page number
      const currentPageSpan = document.getElementById('current-page');
      currentPageSpan.textContent = currentPage;

      // Update visibility of previous and next buttons
      const previousPageBtn = document.getElementById('previous-page-btn');
      const nextPageBtn = document.getElementById('next-page-btn');
      previousPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;

      // Calculate start and end index of items to display
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      // Slice the appointments array to get the items for the current page
      const appointmentsForCurrentPage = appointments.slice(startIndex, endIndex);

      // Display the appointments for the current page
      appointmentsForCurrentPage.forEach(appointment => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const timeCell = document.createElement('td');

        dateCell.textContent = appointment.date;
        timeCell.textContent = appointment.time;

        row.appendChild(dateCell);
        row.appendChild(timeCell);
        appointmentsBody.appendChild(row);
      });

      // Previous page button click event
      previousPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          fetchAppointments(); // Fetch and display appointments for the new page
        }
      });

      // Next page button click event
      nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          fetchAppointments(); // Fetch and display appointments for the new page
        }
      });
    })
    .catch(error => {
      console.error('Error fetching appointments:', error);
    });
}