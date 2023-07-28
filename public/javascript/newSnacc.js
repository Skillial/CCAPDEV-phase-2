const writePostButton = document.getElementById("newPostWrite");
const postFormContainer = document.getElementById("newPostFormContainer");
const postForm = document.getElementById("postForm");
const cancelButton = document.getElementById("cancelButton");
const loginMessage = document.getElementById("loginMessage");
const okButton = document.getElementById("okButton");
const yCancelButton = document.getElementById("yCancelButton");
const nCancelButton = document.getElementById("nCancelButton");
writePostButton.addEventListener("click", () => {
  // Check if the user is logged in
  const isLoggedIn = writePostButton.getAttribute("data-is-loggedin") === "true";

  if (!isLoggedIn) {
    // Show the login message and OK button
    loginMessage.style.display = "block";
    okButton.style.display = "block";
  } else {
    // Show the post form and other elements
    postFormContainer.style.display = "block";
    cancelButton.style.display = "block";
  }
});

cancelButton.addEventListener("click", (e) => { 
  e.preventDefault();
  postForm.reset();
  yCancelButton.style.display = "none";
  nCancelButton.style.display = "none";
  postFormContainer.style.display = "none";
});
okButton.addEventListener("click", (e) => {
  e.preventDefault();
  // Hide the login message and OK button
  loginMessage.style.display = "none";
  okButton.style.display = "none";
});



