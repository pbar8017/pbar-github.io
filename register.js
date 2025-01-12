// Register form submission handler
async function handleRegister(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Send registration data to the backend
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
        alert('Account successfully created! Redirecting to your activity feed...');

        // Redirect to the Friday App activity feed page after registration
        window.location.href = 'Friday App.html'; // Make sure this is the correct file path
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
