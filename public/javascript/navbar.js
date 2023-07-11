// cchecck bottom of this file and search.js
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

    //maybe remove
    

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

    

    // Create the login_pop div
    let loginPop = document.createElement('div');
    loginPop.id = 'login_pop';
    loginPop.className = 'login_pop';

    // Create the login_form
    let loginForm = document.createElement('form');
    loginForm.className = 'login_form';

    // Create the close button
    let logCloseButton = document.createElement('button');
    logCloseButton.className = 'login_x';
	logCloseButton.onclick = function() {
        hideLogPopup();
    };
    // closeButton.onclick = hidePopup;
    logCloseButton.textContent = 'X';
	
    // Create the heading
    let logHeading = document.createElement('h3');
    logHeading.textContent = 'Login Here';

    // Create the username label and input
    let logUsernameLabel = document.createElement('label');
    logUsernameLabel.className = 'login_label';
    logUsernameLabel.setAttribute('for', 'username');
    logUsernameLabel.textContent = 'Username';

    let logUsernameInput = document.createElement('input');
    logUsernameInput.type = 'text';
    logUsernameInput.className = 'login_input';
    logUsernameInput.placeholder = 'Username';

    // Create the password label and input
    let logPasswordLabel = document.createElement('label');
    logPasswordLabel.className = 'login_label';
    logPasswordLabel.setAttribute('for', 'password');
    logPasswordLabel.textContent = 'Password';

    let logPasswordInput = document.createElement('input');
    logPasswordInput.type = 'password';
    logPasswordInput.className = 'login_input';
    logPasswordInput.placeholder = 'Password';

    // Create the "Remember me" checkbox
    let logRememberCheckbox = document.createElement('input');
	let logRememberme = document.createElement('p');
	logRememberme.className= 'remember';
	logRememberme.textContent=' Remember me';
    logRememberCheckbox.type = 'checkbox';

    // Create the login button
    let loginButton = document.createElement('button');
    loginButton.type='button';
    loginButton.className = 'login_button';
    loginButton.textContent = 'Log In';

    // Append all the elements to their respective parents
    loginForm.appendChild(logCloseButton);
    loginForm.appendChild(logHeading);
    loginForm.appendChild(logUsernameLabel);
    loginForm.appendChild(logUsernameInput);
    loginForm.appendChild(logPasswordLabel);
    loginForm.appendChild(logPasswordInput);
    loginForm.appendChild(document.createElement('br'));
    loginForm.appendChild(logRememberCheckbox);
	loginForm.appendChild(logRememberme);
    loginForm.appendChild(loginButton);

    loginPop.appendChild(loginForm);

    // Append the login_pop div to the document body
    document.body.appendChild(loginPop);

    loginButton.addEventListener('click', getInfo);

    // function getInfo(event) {
    //     //const username = document.getElementById('username').value;
    //     //const password = document.getElementById('password').value;
    //     const username = logUsernameInput.value;
    //     const password = logPasswordInput.value;
    //     const url = `user_profiles/${username}.html`
    //     for (let i = 0; i < objPeople.length; i++) {
    //       // Check if user input matches username and password of a current index of the objPeople array
    //       if (username === objPeople[i].username && password === objPeople[i].password) {
    //         console.log(username + ' is logged in!!!');
            
    //         // goes to user homepage
    //         window.location.href = url;
    //         return;
    //       }
    //     }
    //     alert('Incorrect username or password');
    //     console.log('Incorrect username or password!');
    //     //const loginFail = document.getElementById('loginFail');
    //     //loginFail.style.display = 'block';
    //   }

    function getInfo(event) {
        // console.log("hi");
        event.preventDefault();
        const username = logUsernameInput.value;
        const password = logPasswordInput.value;
        // console.log(username);
        // Retrieve the stored user from localStorage
        const storedUser = localStorage.getItem('newUser');
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          
          // Check if user input matches the stored username and password
          if (username === user.username && password === user.password) {
            console.log(username + ' is logged in!!!');
            
            // Redirect to the user's homepage
            isLoggedIn = true;
            //login_button.style.display="none";
            //sign_up_button.style.display="none";
            const url = `profile.html`;
            window.location.href = url;
            return;
          }
        }
        
        // Check against the objPeople array
        for (let i = 0; i < objPeople.length; i++) {
          if (username === objPeople[i].username && password === objPeople[i].password) {
            console.log(username + ' is logged in!!!');
            
            // Redirect to the user's homepage
            isLoggedIn = true; 
            login.removeChild(table);
            let loggeddiv = document.createElement('div');
            let pfp = document.createElement('img');
            // pfp.src="data/sample users/${username}.jpg";
            loggeddiv.className='wrapping_login';
            let currentURL = window.location.href;
            if (currentURL.endsWith('index.html'))  {
                pfp.src=`data/sample users/${username}.jpg`;
              } else if (currentURL.endsWith('denial.html') || currentURL.endsWith('Ecola.html') || currentURL.endsWith('Kinkey.html') || currentURL.endsWith('Matrix.html') || currentURL.endsWith('bandit.html')) {
                pfp.src=`../data/sample users/${username}.jpg`;
              } else {
                pfp.src=`../../data/sample users/${username}.jpg`;
              }


              // pfp.src=`data/sample users/${username}.jpg`;
              pfp.id=username;
              pfp.className= 'pfp_login';
              console.log(username);
              loggeddiv.appendChild(pfp);
              let logout = document.createElement('div');
              logout.textContent = "Logout";
              logout.className = 'logout_login';
              loggeddiv.appendChild(logout);
              login.appendChild(loggeddiv);
              pfp.onclick = function() {
                currentURL = window.location.href;
                // Check if the current HTML file is named 'index.html'
                if (currentURL.endsWith('index.html'))  {
                  window.location.href = `user_profiles/${username}.html`;
                } else if (currentURL.endsWith('denial.html') || currentURL.endsWith('Ecola.html') || currentURL.endsWith('Kinkey.html') || currentURL.endsWith('Matrix.html') || currentURL.endsWith('bandit.html')) {
                  window.location.href = `../user_profiles/${username}.html`;
                } else {
                  window.location.href = `../../user_profiles/${username}.html`;
                }
              };
              logout.onclick = function(){
                login.removeChild(loggeddiv);
                login.appendChild(table);
              }
            hideLogPopup();
            return;
          }
        }
        alert('Incorrect username or password');
        console.log('Incorrect username or password!');
      }
      
    



    //sign up

    let signPop = document.createElement('div');
    signPop.id = 'sign_pop';
    signPop.className = 'login_pop';


    let signForm = document.createElement('form');
    signForm.className = 'login_form';


    let signCloseButton = document.createElement('button');
    signCloseButton.className = 'login_x';
	signCloseButton.onclick = function() {
        hideSignPopup();
    };

    signCloseButton.textContent = 'X';
	

    let signHeading = document.createElement('h3');
    signHeading.textContent = 'Sign Up Here';


    let signUsernameLabel = document.createElement('label');
    signUsernameLabel.className = 'login_label';
    signUsernameLabel.setAttribute('for', 'username');
    signUsernameLabel.textContent = 'Username';

    let signUsernameInput = document.createElement('input');
    signUsernameInput.type = 'text';
    signUsernameInput.className = 'login_input';
    signUsernameInput.placeholder = 'Username';
    signUsernameInput.required = true;


    let signPasswordLabel = document.createElement('label');
    signPasswordLabel.className = 'login_label';
    signPasswordLabel.setAttribute('for', 'password');
    signPasswordLabel.textContent = 'Password';

    let signPasswordInput = document.createElement('input');
    signPasswordInput.type = 'password';
    signPasswordInput.className = 'login_input';
    signPasswordInput.placeholder = 'Password';
    signPasswordInput.required = true;



    let signRePasswordLabel = document.createElement('label');
    signRePasswordLabel.className = 'login_label';
    signRePasswordLabel.setAttribute('for', 're-type password');
    signRePasswordLabel.textContent = 'Re-type Password';

    let signRePasswordInput = document.createElement('input');
    signRePasswordInput.type = 'password';
    signRePasswordInput.className = 'login_input';
    signRePasswordInput.placeholder = 'Re-type Password';
    signRePasswordInput.required = true;


    let signButton = document.createElement('button');
    signButton.className = 'login_button';
    signButton.textContent = 'Sign Up';


    signForm.appendChild(signCloseButton);
    signForm.appendChild(signHeading);
    signForm.appendChild(signUsernameLabel);
    signForm.appendChild(signUsernameInput);
    signForm.appendChild(signPasswordLabel);
    signForm.appendChild(signPasswordInput);
    signForm.appendChild(signRePasswordLabel);
    signForm.appendChild(signRePasswordInput);
    signForm.appendChild(signButton);

    signPop.appendChild(signForm);


    document.body.appendChild(signPop);

    signButton.addEventListener('click', signUpUser);
    function signUpUser(event){
        event.preventDefault();
        const username = signUsernameInput.value;
        const password = signPasswordInput.value;
        const repassword = signRePasswordInput.value;
        if(username === '' || password === ''){
            alert('Username/Password cannot be empty!');
            return;
        }
        
        for (let i = 0; i < objPeople.length; i++) {
            if (username === objPeople[i].username) {
                alert('Username already exists! Please use a different username.');
                return;
              }
             } 
        if (password !== repassword) {
            alert('Passwords do not match! Please try again.');
            return;
            }
            
        const newUser = {
                username: username,
                password: password
              };
            
              // Save the new user in local storage
        localStorage.setItem('newUser', JSON.stringify(newUser));

        // If the loop completes without finding a matching username or passwords not matching,
        // it means the username is unique and the passwords match
        console.log('User ' + username + ' has been created!');
        alert('User ' + username + ' has been created. You may now Log In');
        return;
      }   
  }


function yes() {
	console.log('yes')
}