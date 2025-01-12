document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();  // Prevent form from reloading the page

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            if (!response.ok) {
                throw new Error('Failed to create account');
            }

            const result = await response.json();
            alert('Account created successfully!');
            window.location.href = '/login';  // Redirect to login page after successful registration
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    });
});
