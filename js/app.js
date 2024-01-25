const itemsPerPage = 10;
let currentPage = 1;
let totalItems;
let sortDirection = {};
   
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

ShowSearchUsers();

function displayUsers(users) {
  const tableBody = document.getElementById("tableData");
  tableBody.innerHTML = "";
  let startIndex = (currentPage - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;

  if (startIndex > users.length - 1) {
    currentPage = Math.ceil(users.length/itemsPerPage);
    startIndex = (currentPage - 1) * itemsPerPage;
    endIndex = startIndex + itemsPerPage;
  }

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
function displayPagination(totalItems, filteredUsers) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.innerText = i;
    pageButton.classList.add("btn");
    pageButton.addEventListener(
      "click",
      createPageButtonClickHandler(i, filteredUsers)
    );
    paginationContainer.appendChild(pageButton);
  }
}
function createPageButtonClickHandler(pageNumber, filteredUsers) {
  return function () {
    currentPage = pageNumber;
    ShowSearchUsers(filteredUsers);
  };
}
function ShowSearchUsers(currentPage) {
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
      displayPagination(filteredUsers.length);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
