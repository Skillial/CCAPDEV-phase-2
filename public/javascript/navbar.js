// const express = require('express');
// const session = require('express-session');
// const app = express();
const { isLoggedInMiddleware } = import('../lib/middleware');
//app.use(isLoggedInMiddleware);
if(remember){
  console.log("i remember");
}
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


function createNavbar(location) {

    let navbar = document.createElement('div'),
        title = document.createElement('div'),
        logo = document.createElement('img'),
        search_bar = document.createElement('div'),
        form = document.createElement('form'),
        search_label = document.createElement('label'),
        search_input = document.createElement('input'),
        search_button = document.createElement('button'),
        search_button_img = document.createElement('img'),
        login = document.createElement('div');

	search_label.className = 'search_label';
	form.className = 'search_form';
	search_button.className = 'search_button';
	search_input.className = 'search_input'
    let home = document.createElement('a');
    home.href = "/index";;
    home.appendChild(logo);
    logo.setAttribute('height', '50px');
    logo.setAttribute('margin', 'auto');
    logo.src = location + './images/dark/logo.png';
    search_button_img.src = location + './images/search.png';
    title.className = 'title';
    search_bar.className = 'searchbar';


    form.setAttribute('onsubmit', 'event.preventDefault();');
    form.setAttribute('role', 'search');
    search_bar.appendChild(form);
    form.appendChild(search_label);
    form.appendChild(search_input);
    form.appendChild(search_button);

    search_label.setAttribute('for', 'search');
    search_label.textContent = 'Search for stuff';

    search_input.id = 'search';
    search_input.setAttribute('type', 'search');
    search_input.setAttribute('placeholder', 'Search...');
    search_input.setAttribute('autofocus', 'required');

    search_button.setAttribute('type', 'submit');
    search_button.appendChild(search_button_img);


    

    var table = document.createElement('table'),
        tbody = document.createElement('tbody'),
        tr = document.createElement('tr'),
        login_button = document.createElement('td'),
        sign_up_button = document.createElement('td');

    login_button.textContent = 'Login';
    login_button.className = 'pointer';
    sign_up_button.className = 'pointer';
    login_button.onclick = function() {
        window.location.href = "/login";
    };

    sign_up_button.textContent = 'Sign Up';
    sign_up_button.onclick = function() {
      window.location.href = "/register";
    };
    tr.appendChild(login_button);
    tr.appendChild(sign_up_button);
    tbody.appendChild(tr);
    table.appendChild(tbody);
    login.appendChild(table);

    navbar.className = 'navbar';
    navbar.appendChild(title);
    title.appendChild(home);
    navbar.appendChild(search_bar);
    navbar.appendChild(login);

    document.body.appendChild(navbar);


      
      
  }


function yes() {
	console.log('yes')
}