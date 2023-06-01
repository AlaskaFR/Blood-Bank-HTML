window.onload = function () {
    const donorId = localStorage.getItem('donorId');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const emailInput = document.getElementById('email');
    const bloodTypeInput = document.getElementById('blood-type');
    const saveButton = document.getElementById('save-button');

    // Fetch donor data and populate the form
    fetch(`http://localhost:8081/donor/${donorId}`)
      .then(response => response.json())
      .then(donor => {
        firstNameInput.value = donor.firstName;
        lastNameInput.value = donor.lastName;
        emailInput.value = donor.email;
        bloodTypeInput.value = donor.bloodType;
      })
      .catch(error => {
        console.error('Error fetching donor data:', error);
      });

    // Add event listener to save button
    saveButton.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent form submission

      const updatedFirstName = firstNameInput.value;
      const updatedLastName = lastNameInput.value;
      const updatedEmail = emailInput.value;
      const updatedBloodType = bloodTypeInput.value;

      updateDonor(donorId, updatedFirstName, updatedLastName, updatedEmail, updatedBloodType);
    });
  }

  function updateDonor(donorId, firstName, lastName, email, bloodType) {
    const url = `http://localhost:8081/user/edit`;
    const requestBody = {
      id: donorId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      bloodType: bloodType
    };

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(result => {
        if (result) {
          // Changes saved successfully
          console.log('Donor information updated.');
        } else {
          console.error('Failed to update donor information.');
        }
      })
      .catch(error => {
        console.error('Error updating donor information:', error);
      });
  }