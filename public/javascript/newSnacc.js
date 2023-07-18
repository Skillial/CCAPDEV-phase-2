const writePostButton = document.getElementById("newPostWrite");
const postFormContainer = document.getElementById("newPostFormContainer");
const postForm = document.getElementById("postForm");
const cancelButton = document.getElementById("cancelButton");
const yCancelButton = document.getElementById("yCancelButton");
const nCancelButton = document.getElementById("nCancelButton");
writePostButton.addEventListener("click", () => {
   postFormContainer.style.display = "block";
});


cancelButton.addEventListener("click", () => { 
  yCancelButton.style.display = "block";
  nCancelButton.style.display = "block";
});

yCancelButton.addEventListener("click", () => {
    postForm.reset();
    yCancelButton.style.display = "none";
    nCancelButton.style.display = "none";
    postFormContainer.style.display = "none";
});

nCancelButton.addEventListener("click", () => {
  yCancelButton.style.display = "none";
  nCancelButton.style.display = "none";
});