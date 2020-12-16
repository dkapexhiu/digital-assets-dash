var username = document.querySelector("#username");
var password = document.querySelector("#password");

var regBtn = document.querySelector("#regBtn");
var login = document.querySelector("#LoginBtn");
var USERDETAILS = "";
login.addEventListener("click", function(e) {
  let adminUsers = JSON.parse(localStorage.getItem("admin"));

  let isAdmin = false;

  for (let i = 0; i < adminUsers.length; i++) {
    if (username.value == adminUsers[i].usr) {
      if (password.value == adminUsers[i].pass) {
        isAdmin = true;
        USERDETAILS = username.value;
        break;
      }
    }
  }

  if (isAdmin) {
    alert("Welcome Admin");
    // window.location.assign("./admin.html");
    window.location.href = `./admin.html`;
    sessionStorage.setItem("currentAdmin", JSON.stringify(USERDETAILS));
  } else {
    alert("Invalid User");
  }

  console.log(username.value);
  console.log(password.value);

  e.preventDefault();
});

regBtn.addEventListener("click", function(e) {

  adminUsers = [
    { usr: "siva", pass: "123" },
    { usr: "arjun", pass: "456" }
  ];

  localStorage.setItem("admin", JSON.stringify(adminUsers));

  console.log("item added to localStorage");
  e.preventDefault();
});

function register() {
  console.log("register..");
}
