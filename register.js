document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form from refreshing the page

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Account created successfully!');
                window.location.href = '/Friday%20App.html'; // Redirect to Friday App page
            } else {
                throw new Error(result.message || 'Error creating account');
            }
        } catch (error) {
            alert(`Failed to create account: ${error.message}`);
        }
    });
});
