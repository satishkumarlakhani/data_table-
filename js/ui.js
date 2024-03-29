function showSignupForm() {
  document.getElementById("signupPopup").style.display = "block";
}
function closeSignupForm() {
  document.getElementById("signupPopup").style.display = "none";
}
function showSigninForm() {
  document.getElementById("signinPopup").style.display = "block";
}

function closeSigninForm() {
  document.getElementById("signinPopup").style.display = "none";
}
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
