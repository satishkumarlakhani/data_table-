const itemsPerPage = 10;
let currentPage = 1;
fetch("http://localhost:3000/users")
  .then((response) => response.json())
  .then((users) => {
    const tableBody = document.getElementById("tableData");
    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.gender}</td>
      <td id = "personAge"></td>
      <td>${user.dob}</td>
      <td>${user.password}</td>
    `;
      tableBody.appendChild(row);
      calculateAgeFromDOB();
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
function signInUser() {
  var email = document.getElementById("signinEmail").value;
  var password = document.getElementById("signinPassword").value;

  fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .then((users) => {
      const matchedUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (matchedUser) {
        closeSigninForm();
        // Redirect to index.html after successful authentication
        window.location.href = "index.html";
      } else {
        // Alert for unsuccessful authentication
        alert("Invalid email or password. Please try again.");
      }
    })
    .catch((error) => {
      // Provide a meaningful error message for debugging
      console.error("Error fetching data:", error);
    });
}
function postSignupData() {
  var formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    gender: document.getElementById("gender").value,
    dob: document.getElementById("dob").value,
    password: document.getElementById("password").value,
  };
  for (var key in formData) {
    if (formData[key] === "") {
      alert("Please fill out all fields.");
      return;
    }
  }

  // Make a POST request to add the user on the server
  fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      alert("Sign-up successful!");
      closeSignupForm();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred during sign-up. Please try again later.");
    });
}
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("signupForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      postSignupData();
    });

  document
    .getElementById("signinForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      signInUser();
    });
});

function calculateAgeFromDOB(dob) {
  var birthDate = new Date(dob);
  var currentDate = new Date();

  var age = currentDate.getFullYear() - birthDate.getFullYear();

  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}
function displayUsers(users) {
  const tableBody = document.getElementById("tableData");
  tableBody.innerHTML = "";
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  for (let i = startIndex; i < endIndex && i < users.length; i++) {
    const user = users[i];
    const row = document.createElement("tr");
    const age = calculateAgeFromDOB(user.dob);
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.gender}</td>
      <td>${age}</td>
      <td>${user.dob}</td>
      <td>${user.password}</td>
    `;
    tableBody.appendChild(row);
  }
  displayPagination(users.length);
}
function displayPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.innerText = i;
    pageButton.classList.add("btn");
    pageButton.addEventListener("click", () => {
      currentPage = i;
     });
    paginationContainer.appendChild(pageButton);
  }
}

function fetchAndDisplayUsers() {
  fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .then((users) => {
      const searchInput = document
        .getElementById("searchInput")
        .value.toLowerCase();
      const filteredUsers = users.filter((user) => {
        return (
          user.name.toLowerCase().includes(searchInput) ||
          user.email.toLowerCase().includes(searchInput) ||
          user.gender.toLowerCase().includes(searchInput) ||
          user.dob.toLowerCase().includes(searchInput)
        );
      });

      displayUsers(filteredUsers);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
fetchAndDisplayUsers();
function setSortDirection(columnIndex) {
  const table = document.getElementById("userTable");
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  const isStringColumn = isNaN(
    parseFloat(rows[0].cells[columnIndex].textContent)
  );
  rows.sort((a, b) => {
    const aValue = a.cells[columnIndex].textContent;
    const bValue = b.cells[columnIndex].textContent;

    if (isStringColumn) {
      return aValue.localeCompare(bValue);
    } else {
      return parseFloat(aValue) - parseFloat(bValue);
    }
  });

  if (table.dataset.sortDirection === "desc") {
    rows.reverse();
    table.dataset.sortDirection = "asc";
  } else {
    table.dataset.sortDirection = "desc";
  }
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";
  rows.forEach((row) => tbody.appendChild(row));
}
document.addEventListener("DOMContentLoaded", () => {
  const headerCells = document.querySelectorAll("th");
  headerCells.forEach((cell, index) => {
    cell.addEventListener("click", () => setSortDirection(index));
  });
});
