const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const rememberInput = document.getElementById('remember');
const loginError = document.getElementById('login_error');

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const username = usernameInput.value;
    const password = passwordInput.value;
    const remember = rememberInput.checked;
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
                remember: remember,
            }),
        });
        if (response.ok) {
            window.location.href = '/profile';
        } else {
            const errorMessage = await response.json();
            loginError.textContent = errorMessage.error;
        }
    } catch (error) {
        loginError.textContent = "An error occurred while logging in.";
    }
});
