// JavaScript to handle the form submission
async function handleRegister(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Send the registration data to the backend
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            const error = await response.text(); // Fetch error message
            throw new Error(error);
        }

        const result = await response.json();
        alert('Account successfully created! Redirecting to your activity page...');
        window.location.href = 'Friday App.html'; // Redirect to activity page after registration
    } catch (error) {
        console.error('Error registering:', error);
        alert(`Failed to create account: ${error.message}`);
    }
}

// Attach event listener after the page content is loaded
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', handleRegister);
});
