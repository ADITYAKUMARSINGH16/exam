document.addEventListener('DOMContentLoaded', function() {
    // Check login status and fetch user info on page load
    fetch('php/check_session.php')
        .then(response => response.json())
        .then(data => {
            const authButtons = document.querySelector('.auth-buttons');
            const userInfo = document.querySelector('.user-info');

            if (!authButtons || !userInfo) {
                console.error('DOM elements not found:', { authButtons, userInfo });
                return;
            }

            if (data.loggedIn) {
                console.log('User is logged in, fetching user info...'); // Debug log
                // If user is logged in and on login.html, redirect to index.html
                if (window.location.pathname.includes('login.html')) {
                    window.location.href = 'index.html';
                    return;
                }

                // Fetch user info to get the username
                fetch('php/get_user_info.php')
                    .then(response => response.json())
                    .then(userData => {
                        console.log('User data response:', userData); // Debug log
                        if (userData.status === 'success' && userData.username) {
                            // Update navigation bar
                            userInfo.textContent = `Welcome, ${userData.username} | `;
                            userInfo.style.display = 'inline'; // Ensure visibility
                            // Clear authButtons and re-append userInfo with Account/Logout links
                            authButtons.innerHTML = ''; // Clear existing content
                            authButtons.appendChild(userInfo); // Append userInfo first
                            authButtons.insertAdjacentHTML('beforeend', `
                                <a href="account.html" class="btn">Account</a>
                                <a href="php/logout.php" class="btn">Logout</a>
                            `);
                            console.log('Navigation bar updated with username:', userData.username);
                            // If on account.html, display the username
                            if (window.location.pathname.includes('account.html')) {
                                const usernameDisplay = document.getElementById('username-display');
                                if (usernameDisplay) {
                                    usernameDisplay.textContent = `Logged in as: ${userData.username}`;
                                }
                            }
                        } else {
                            console.error('Failed to fetch username:', userData.message);
                            userInfo.textContent = 'Welcome, Guest | ';
                            authButtons.innerHTML = ''; // Clear existing content
                            authButtons.appendChild(userInfo);
                            authButtons.insertAdjacentHTML('beforeend', `
                                <a href="account.html" class="btn">Account</a>
                                <a href="php/logout.php" class="btn">Logout</a>
                            `);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching user info:', error);
                        userInfo.textContent = 'Welcome, Guest | ';
                        authButtons.innerHTML = ''; // Clear existing content
                        authButtons.appendChild(userInfo);
                        authButtons.insertAdjacentHTML('beforeend', `
                            <a href="account.html" class="btn">Account</a>
                            <a href="php/logout.php" class="btn">Logout</a>
                        `);
                    });
            } else {
                console.log('User is not logged in'); // Debug log
                userInfo.textContent = '';
                authButtons.innerHTML = ''; // Clear existing content
                authButtons.appendChild(userInfo);
                authButtons.insertAdjacentHTML('beforeend', `
                    <a href="login.html" class="btn">Login</a>
                    <a href="register.html" class="btn btn-primary">Sign Up</a>
                `);
            }

            // Check for URL parameters to display success message on login page
            const urlParams = new URLSearchParams(window.location.search);
            const successMessage = urlParams.get('success');
            if (successMessage && window.location.pathname.includes('login.html')) {
                const messageDiv = document.getElementById('login-message');
                messageDiv.innerHTML = `<p class="success">${successMessage}</p>`;
            }
        })
        .catch(error => {
            console.error('Error checking session:', error);
        });
});

// Handle registration form submission
function handleRegister(event) {
    event.preventDefault();
    const form = document.getElementById('register-form');
    const messageDiv = document.getElementById('reg-message');
    const formData = new FormData(form);

    fetch('php/register_process.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            messageDiv.innerHTML = `<p class="success">${data.message}</p>`;
            setTimeout(() => {
                window.location.href = 'login.html?success=Registration successful! Please login.';
            }, 2000);
        } else {
            messageDiv.innerHTML = `<p class="error">${data.message}</p>`;
        }
    })
    .catch(error => {
        messageDiv.innerHTML = '<p class="error">Error: Registration failed.</p>';
    });
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    const form = document.getElementById('login-form');
    const messageDiv = document.getElementById('login-message');
    const formData = new FormData(form);

    fetch('php/login_process.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href = data.redirect;
        } else {
            messageDiv.innerHTML = `<p class="error">${data.message}</p>`;
        }
    })
    .catch(error => {
        messageDiv.innerHTML = '<p class="error">Error: Login failed.</p>';
    });
}

// Handle password change form submission
function handleChangePassword(event) {
    event.preventDefault();
    const form = document.getElementById('change-password-form');
    const messageDiv = document.getElementById('account-message');
    const formData = new FormData(form);

    fetch('php/change_password.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            messageDiv.innerHTML = `<p class="success">${data.message}</p>`;
        } else {
            messageDiv.innerHTML = `<p class="error">${data.message}</p>`;
        }
    })
    .catch(error => {
        messageDiv.innerHTML = '<p class="error">Error: Password change failed.</p>';
    });
}