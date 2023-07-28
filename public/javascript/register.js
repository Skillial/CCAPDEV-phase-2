const registerForm = document.getElementById('register-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const repasswordInput = document.getElementById('repassword');
const registerError = document.getElementById('register_error');

registerForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const username = usernameInput.value;
    const password = passwordInput.value;
    const repassword = repasswordInput.value;
    console.log(username, password, repassword);
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
                repassword: repassword,
            }),
        });
        if (response.ok) {
            window.location.href = '/success';
        } else {
            const errorMessage = await response.json();
            registerError.textContent = errorMessage.error;
        }
    } catch (error) {
        registerError.textContent = "An error occurred while logging in.";
    }
});
