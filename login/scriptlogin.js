// Store the timestamp of the last login attempt
let lastAttemptTime = 0;

// Function to handle the login submission
function handleLogin(event) {
    event.preventDefault();
    
    // Get current time
    const currentTime = Date.now();
    
    // Check if less than 1 second has passed since the last attempt
    if (currentTime - lastAttemptTime < 1000) {
        showMessage("Please wait 1 second between login attempts", "error");
        return;
    }
    
    // Update the last attempt time
    lastAttemptTime = currentTime;
    
    // Get form inputs
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validate inputs
    if (!username || !password) {
        showMessage("Both username and password are required", "error");
        return;
    }

    // Show loading message
    showMessage("Logging in...", "info");
    
    // Make an AJAX call to authenticate.php
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    fetch('authenticate.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(data.message, "success");
            // Redirect to the appropriate dashboard
            setTimeout(() => {
                window.location.href = data.redirect;
            }, 1000);
        } else {
            showMessage(data.message, "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage("An error occurred while logging in. Please try again.", "error");
    });
}

// Function to display messages to the user
function showMessage(message, type) {
    let messageContainer = document.getElementById('message-container');
    
    if (!messageContainer) {
        // Create message container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'message-container';
        container.style.padding = '10px';
        container.style.marginBottom = '15px';
        container.style.borderRadius = '5px';
        container.style.textAlign = 'center';
        
        // Insert at the top of the form container
        const form = document.querySelector('.login-container');
        form.insertBefore(container, form.firstChild);
        
        messageContainer = container;
    }
    
    messageContainer.textContent = message;
    
    // Style based on message type
    if (type === 'error') {
        messageContainer.style.backgroundColor = '#ffebee';
        messageContainer.style.color = '#d32f2f';
        messageContainer.style.border = '1px solid #d32f2f';
    } else if (type === 'info') {
        messageContainer.style.backgroundColor = '#e3f2fd';
        messageContainer.style.color = '#1976d2';
        messageContainer.style.border = '1px solid #1976d2';
    } else {
        messageContainer.style.backgroundColor = '#e8f5e9';
        messageContainer.style.color = '#388e3c';
        messageContainer.style.border = '1px solid #388e3c';
    }
}

// Add event listener when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});