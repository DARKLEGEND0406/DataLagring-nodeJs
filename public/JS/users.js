
async function fetchUsers() {
    try {
      const response = await fetch('/users');
      const users = await response.json();
      
      const container = document.getElementById('usersContainer');
      users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
  
        const userCardInner = document.createElement('div');
        userCardInner.className = 'user-card-inner';
  
        const userCardFront = document.createElement('div');
        userCardFront.className = 'user-card-front';
  
        const userCardBack = document.createElement('div');
        userCardBack.className = 'user-card-back';
  
        const nameDiv = document.createElement('div');
        nameDiv.className = 'user-name';
        nameDiv.textContent = `${user.firstName} ${user.lastName}`;
        userCardFront.appendChild(nameDiv);
  
        const imageDiv = document.createElement('div');
        const img = document.createElement('img');
        img.src = `/uploads/${user.image}`;
        img.alt = 'User Image';
        img.className = 'user-image';
        imageDiv.appendChild(img);
        userCardFront.appendChild(imageDiv);
  
        const usernameDiv = document.createElement('div');
        usernameDiv.className = 'user-field';
        usernameDiv.textContent = `Username: ${user.username}`;
        userCardBack.appendChild(usernameDiv);
  
        const birthdayDiv = document.createElement('div');
        birthdayDiv.className = 'user-field';
        birthdayDiv.textContent = `Birthday: ${user.birthday}`;
        userCardBack.appendChild(birthdayDiv);
  
        const occupationDiv = document.createElement('div');
        occupationDiv.className = 'user-field';
        occupationDiv.textContent = `Occupation: ${user.occupation}`;
        userCardBack.appendChild(occupationDiv);
  
        const editDiv = document.createElement('div');
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
          const editForm = userCard.querySelector('.user-edit');
          if (editForm.style.display === 'none') {
            editForm.style.display = 'flex';
          } else {
            editForm.style.display = 'none';
          }
        });
        editDiv.appendChild(editButton);
        userCardBack.appendChild(editDiv);
  
        const editFormDiv = document.createElement('div');
        editFormDiv.className = 'user-edit';
        editFormDiv.style.display = 'none';
        const editForm = document.createElement('form');
        editForm.innerHTML = `
          <input type="hidden" name="userId" value="${user.id}">
          <input name="firstName" value="${user.firstName}">
          <input name="lastName" value="${user.lastName}">
          <input name="username" value="${user.username}">
          <input name="birthday" value="${user.birthday}">
          <input name="occupation" value="${user.occupation}">
          <button type="submit">Save</button>`;
  
        editForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const updatedUser = {
            id: editForm.elements.userId.value,
            firstName: editForm.elements.firstName.value,
            lastName: editForm.elements.lastName.value,
            username: editForm.elements.username.value,
            birthday: editForm.elements.birthday.value,
            occupation: editForm.elements.occupation.value,
          };

          try {
            const updateResponse = await fetch(`/users/${updatedUser.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedUser),
            });
          
            const updatedUserData = await updateResponse.json();
             
            nameDiv.textContent = `${updatedUserData.firstName} ${updatedUserData.lastName}`;
            usernameDiv.textContent = `Username: ${updatedUserData.username}`;
            birthdayDiv.textContent = `Birthday: ${updatedUserData.birthday}`;
            occupationDiv.textContent = `Occupation: ${updatedUserData.occupation}`;
          } catch (error) {
            console.error("error");
          }
        });
        editFormDiv.appendChild(editForm);
        userCardBack.appendChild(editFormDiv);
  
        userCardInner.appendChild(userCardFront);
        userCardInner.appendChild(userCardBack);
  
        userCard.appendChild(userCardInner);
  
        container.appendChild(userCard);
      });
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }
  
  fetchUsers();