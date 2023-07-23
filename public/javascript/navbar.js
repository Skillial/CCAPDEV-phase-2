// const express = require('express');
// const session = require('express-session');
// const app = express();
//const { isLoggedInMiddleware } = import('../lib/middleware');
//app.use(isLoggedInMiddleware);
//if(remember)
  //console.log("i remember");
// const { log } = require("handlebars");

function showSignPopup() {
    hideLogPopup();
    document.getElementById("sign_pop").style.display = "block";
}

function hideSignPopup() {
    document.getElementById("sign_pop").style.display = "none";
}

function showLogPopup() {
    hideSignPopup();
    document.getElementById("login_pop").style.display = "block";
}

function hideLogPopup() {
    document.getElementById("login_pop").style.display = "none";
}
var objPeople = [
    { // Object @ 0 index
        username: "denial",
        password: "password"
    },
    { // Object @ 1 index
        username: "Ecola",
        password: "password"
    },
    { // Object @ 2 index
        username: "Kinkey",
        password: "password"
    },
    { // Object @ 3 index
        username: "Matrix",
        password: "password"
    },
    { // Object @ 4 index
        username: "poop bandit",
        password: "password"
    }
]


function createNavbar(isLoggedIn) {

    let navbar = document.createElement('div'),
        title = document.createElement('div'),
        logo = document.createElement('img'),
        search_bar = document.createElement('div'),
        form = document.createElement('form'),
        search_label = document.createElement('label'),
        search_input = document.createElement('input'),
        search_button = document.createElement('button'),
        search_button_img = document.createElement('img'),
        left_div = document.createElement('div'),
        right_div = document.createElement('div');

	left_div.className = 'navbar-div';
	right_div.className = 'navbar-div';

	search_label.className = 'search_label';
	form.className = 'search_form';
	search_button.className = 'search_button';
	search_input.className = 'search_input'
    let home = document.createElement('a');
    home.href = "/index";;
    home.appendChild(logo);
    logo.setAttribute('height', '100%');
    logo.setAttribute('width', 'auto');
    logo.setAttribute('margin', 'auto');
    logo.src = '/images/dark/logo.png';
    search_button_img.src = '/images/search.png';
    title.className = 'title';
    search_bar.className = 'searchbar';


    form.setAttribute('onsubmit', 'event.preventDefault();');
    form.setAttribute('role', 'search');
    
    form.appendChild(search_label);
    form.appendChild(search_input);
    
    

    let search_choices_user = document.createElement('ul');
    search_choices_user.className = 'search_choices';
    search_choices_user.id = 'search_choices_user'


    let search_choices_post = document.createElement('ul');
    search_choices_post.className = 'search_choices';
    search_choices_post.id = 'search_choices_post';

    

    search_label.setAttribute('for', 'search');
    search_label.textContent = 'Search for stuff';

    search_input.id = 'search';
    // search_input.setAttribute('type', 'search');
    // search_button.appendChild(search_button_img);
    // form.appendChild(search_button); // for search
    search_input.setAttribute('placeholder', 'Search...');
    search_input.setAttribute('autofocus', 'required');

    // search_input.addEventListener('input', async (event) => {
    //     const key = event.target.value;
    //     searchForKey(key);
    //   });

    search_button.setAttribute('type', 'submit');
    
    search_bar.appendChild(form);
    search_bar.appendChild(search_choices_user);
    search_bar.appendChild(search_choices_post);
    

    var login_button = document.createElement('div'),
        sign_up_button = document.createElement('div');
        logout_button = document.createElement('div');
        profile_button = document.createElement('div');

    login_button.textContent = 'Log In';
    login_button.className = 'navbar-button';
    sign_up_button.className = 'navbar-button';
    login_button.onclick = function() {
        window.location.href = "/login";
    };

    sign_up_button.textContent = 'Sign Up';
    sign_up_button.onclick = function() {
      window.location.href = "/register";
    };

    logout_button.textContent = 'Log Out';
    logout_button.className = 'navbar-button';
    logout_button.onclick = function() {
        window.location.href = "/logout";
    };

    profile_button.textContent = 'Profile';
    profile_button.className = 'navbar-button';
    profile_button.onclick = function() {
        window.location.href = "/profile" ;
    };
    if (isLoggedIn){
        login_button.style.display='none';
        sign_up_button.style.display='none';
    } else{
        logout_button.style.display='none';
        profile_button.style.display='none';
    }
    
    navbar.className = 'navbar';

    left_div.appendChild(home);
    right_div.appendChild(login_button);
    right_div.appendChild(sign_up_button);
    right_div.appendChild(profile_button);
    right_div.appendChild(logout_button);   
	
    navbar.appendChild(left_div);
    navbar.appendChild(search_bar);
    navbar.appendChild(right_div);
	
    document.body.appendChild(navbar);
}


function yes() {
	console.log('yes')
}

async function updateUserChoices(choices) {
    let search_choices = document.querySelector('#search_choices_user');
    search_choices.innerHTML = '';
    let search_bar_label = document.createElement('div');
    search_bar_label.textContent="Search from users";
    search_bar_label.className = "search_bar_label";
    search_choices.appendChild(search_bar_label);
    choices.forEach(choice => {
      let li = document.createElement('li');
      li.textContent = choice.username;
      li.onclick = () => {
        window.location.href = `/profile/${encodeURIComponent(choice.username)}`;
      };
      search_choices.appendChild(li);
    });
  }
  
  let isSearchResultDisplayed = false;

  let searchTimeout;

async function searchForUser(key) {
  try {
    clearTimeout(searchTimeout); // Cancel any pending search requests

    const searchChoices = document.querySelector('#search_choices_user');
    if (key.trim() === '') {
      // If the search key is empty, clear the search results and return
      searchChoices.innerHTML = '';
      isSearchResultDisplayed = false;
      return;
    }

    const response = await fetch(`/searchuser/${key}`);
    const data = await response.json();

    if (data.length > 0) {
      // If there are search results, update the choices
      updateUserChoices(data);
      isSearchResultDisplayed = true;
    } else {
      // If no search results, clear the choices
      searchChoices.innerHTML = '';
      isSearchResultDisplayed = false;
    }
  } catch (error) {
    console.error(error);
  }
}

async function updatePostChoices(choices) {
  const searchChoices = document.querySelector('#search_choices_post');
  searchChoices.innerHTML = '';
  const search_bar_label = document.createElement('div');
  search_bar_label.textContent = "Search from comments/posts";
  search_bar_label.className = "search_bar_label";
  searchChoices.appendChild(search_bar_label);

  const existingTextContent = new Set();

  for (const choice of choices) {
    const { title, parentPostID } = choice;
    let textContent = '';

    if (title) {
      textContent = choice;
      if (textContent && !existingTextContent.has(textContent)) {
        const li = document.createElement('li');
        li.textContent = choice.title;
        li.onclick = () => {
          window.location.href = `/post/${encodeURIComponent(choice._id)}`;
        };
        searchChoices.appendChild(li);
        existingTextContent.add(textContent);
      }
    } else if (parentPostID) {
      const response = await fetch(`/searchcomment/${parentPostID}`);
      const data = await response.json();
      textContent = data.post || '';
      // console.log(textContent);
      if (textContent.title && !existingTextContent.has(textContent.title)) {
        const li = document.createElement('li');
        // console.log(data);
        li.textContent = textContent.title  ;
        li.onclick = () => {
          window.location.href = `/post/${encodeURIComponent(textContent._id)}`;
        };
        searchChoices.appendChild(li);
        existingTextContent.add(textContent.title);
      }
    }

    
  }
}
  

async function searchForPost(key) {
  try {
    clearTimeout(searchTimeout); // Cancel any pending search requests

    const searchChoices = document.querySelector('#search_choices_post');
    if (key.trim() === '') {
      // If the search key is empty, clear the search results and return
      searchChoices.innerHTML = '';
      isSearchResultDisplayed = false;
      return;
    }

    const response = await fetch(`/searchpost/${key}`);
    const data = await response.json();

    if (data.length > 0) {
      // If there are search results, update the choices
      updatePostChoices(data);
      isSearchResultDisplayed = true;
    } else {
      // If no search results, clear the choices
      searchChoices.innerHTML = '';
      isSearchResultDisplayed = false;
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('keyup', (event) => {
  const searchInput = document.getElementById('search');
  const searchChoices = document.querySelector('.search_choices');
  const key = searchInput.value;

  if (event.target === searchInput) {
    clearTimeout(searchTimeout); // Cancel any pending search requests

    // Delay the search request by 300 milliseconds after the key is released
    searchTimeout = setTimeout(() => {
      searchForUser(key);
      searchForPost(key);
    },400); //can add ,300 after }

    if (key.trim() === '' && isSearchResultDisplayed) {
      // If the search input is empty and search results are displayed, clear the choices
      searchChoices.innerHTML = '';
      isSearchResultDisplayed = false;
    }
  }
});

