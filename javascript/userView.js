// const profile = {
//     username: usernameInput.value,
//     bio: bioInput.value,
//     // other profile properties
//   };
  
//   localStorage.setItem('profile', JSON.stringify(profile));

//   const storedProfile = localStorage.getItem('profile');
//   if (storedProfile) {
//     const profile = JSON.parse(storedProfile);
//     // Access the profile properties
//     console.log('Username:', profile.username);
//     console.log('Bio:', profile.bio);
//     // other profile properties
//   }
  
//   function isLoggedInUser(){
//     if(isLoggedIn === true){
//         login_button.style.display="none";
//         sign_up_button.style.display="none";
//     }
//     createNavbar('');
//   }
var isLoggedIn = false;
//the problem is, this file needs to be declared in every thing that has a navbar
//so, isLoggedIn will get re-defined every time!