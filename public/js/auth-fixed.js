/**
 * BlueRock Asset Management - Authentication System
 * This file handles user authentication, session management, and form validation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = checkLoginStatus();
    
    // Login Form Handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate email
            const email = document.getElementById('email');
            if (email.value.trim() === '') {
                setError(email, 'Please enter your email address');
                isValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                setError(email, 'Please enter a valid email address');
                isValid = false;
            } else {
                setSuccess(email);
            }
            
            // Validate password
            const password = document.getElementById('password');
            if (password.value.trim() === '') {
                setError(password, 'Please enter your password');
                isValid = false;
            } else {
                setSuccess(password);
            }
            
            // If form is valid, attempt login
            if (isValid) {
                // For demo purposes, we'll check against some predefined users
                const validUsers = [
                    { email: 'user@example.com', password: 'password123', name: 'John Doe' },
                    { email: 'demo@bluerock.com', password: 'demo2025', name: 'Demo User' },
                    { email: 'client@test.com', password: 'client2025', name: 'Test Client' }
                ];
                
                // Find matching user
                const user = validUsers.find(u => 
                    u.email.toLowerCase() === email.value.trim().toLowerCase() && 
                    u.password === password.value
                );
                
                if (user) {
                    // Valid login
                    const userData = {
                        email: user.email,
                        name: user.name,
                        role: 'client'
                    };
                    
                    // Store user data in session storage
                    loginUser(userData);
                    
                    // Show success message
                    showNotification('Login successful! Redirecting to dashboard...', 'success');
                    
                    // Redirect to dashboard after a short delay
                    setTimeout(function() {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    // Invalid login
                    showNotification('Invalid email or password. Please try again.', 'error');
                }
            }
        });
    }
    
    // Signup Form Handling
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate first name
            const firstName = document.getElementById('first-name');
            if (firstName.value.trim() === '') {
                setError(firstName, 'Please enter your first name');
                isValid = false;
            } else {
                setSuccess(firstName);
            }
            
            // Validate last name
            const lastName = document.getElementById('last-name');
            if (lastName.value.trim() === '') {
                setError(lastName, 'Please enter your last name');
                isValid = false;
            } else {
                setSuccess(lastName);
            }
            
            // Validate email
            const email = document.getElementById('email');
            if (email.value.trim() === '') {
                setError(email, 'Please enter your email address');
                isValid = false;
            } else if (!isValidEmail(email.value.trim())) {
                setError(email, 'Please enter a valid email address');
                isValid = false;
            } else {
                setSuccess(email);
            }
            
            // Validate phone
            const phone = document.getElementById('phone');
            if (phone.value.trim() === '') {
                setError(phone, 'Please enter your phone number');
                isValid = false;
            } else if (!isValidPhone(phone.value.trim())) {
                setError(phone, 'Please enter a valid phone number');
                isValid = false;
            } else {
                setSuccess(phone);
            }
            
            // Validate password
            const password = document.getElementById('password');
            if (password.value === '') {
                setError(password, 'Please enter a password');
                isValid = false;
            } else if (password.value.length < 8) {
                setError(password, 'Password must be at least 8 characters');
                isValid = false;
            } else if (checkPasswordStrength(password.value) < 3) {
                setError(password, 'Password is too weak. Include uppercase, lowercase, numbers, and special characters');
                isValid = false;
            } else {
                setSuccess(password);
            }
            
            // Validate confirm password
            const confirmPassword = document.getElementById('confirm-password');
            if (confirmPassword.value === '') {
                setError(confirmPassword, 'Please confirm your password');
                isValid = false;
            } else if (confirmPassword.value !== password.value) {
                setError(confirmPassword, 'Passwords do not match');
                isValid = false;
            } else {
                setSuccess(confirmPassword);
            }
            
            // Validate terms
            const terms = document.getElementById('terms');
            if (!terms.checked) {
                setError(terms, 'You must agree to the terms to continue');
                isValid = false;
            } else {
                setSuccess(terms);
            }
            
            // If form is valid, create account
            if (isValid) {
                // In a real application, this would send data to the server to create an account
                // For demo purposes, we'll simulate account creation
                const userData = {
                    email: email.value.trim(),
                    name: firstName.value.trim() + ' ' + lastName.value.trim(),
                    role: 'client',
                    phone: phone.value.trim()
                };
                
                // Store user data in session storage
                loginUser(userData);
                
                // Show success message
                showNotification('Account created successfully! Redirecting to dashboard...', 'success');
                
                // Redirect to dashboard after a short delay
                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        });
    }
    
    // Password Reset Form Handling
    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const resetEmail = document.getElementById('reset-email').value.trim();
            
            if (resetEmail === '' || !isValidEmail(resetEmail)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // In a real application, this would send a reset link to the email
            // For demo purposes, we'll just show a success message
            showNotification('Password reset instructions have been sent to your email address.', 'success');
            
            // Close the modal
            const modal = document.getElementById('forgot-password-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Logout Button Handling
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
            window.location.href = 'index.html';
        });
    }
    
    // Add logout button to navigation if user is logged in
    if (isLoggedIn) {
        updateNavForLoggedInUser();
    }
    
    // Check if we're on the dashboard page and user is not logged in
    if (window.location.pathname.includes('dashboard.html') && !isLoggedIn) {
        // Redirect to login page
        window.location.href = 'login.html?redirect=dashboard.html';
    }
});

// Helper Functions

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in, false otherwise
 */
function checkLoginStatus() {
    return sessionStorage.getItem('user') !== null;
}

/**
 * Login user by storing user data in session storage
 * @param {Object} userData User data to store
 */
function loginUser(userData) {
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('loginTime', new Date().getTime());
}

/**
 * Logout user by removing user data from session storage
 */
function logoutUser() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('loginTime');
}

/**
 * Update navigation for logged in user
 */
function updateNavForLoggedInUser() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const authLinks = document.querySelector('.auth-links');
    
    if (authLinks && user) {
        // Create new auth links HTML
        let newAuthLinksHTML = '';
        
        if (user.role === 'admin') {
            newAuthLinksHTML = `
                <a href="admin.html" class="nav-login">Admin</a>
                <a href="#" id="logout-btn" class="nav-signup btn btn-accent btn-sm">Logout</a>
            `;
        } else {
            newAuthLinksHTML = `
                <a href="dashboard.html" class="nav-login">Dashboard</a>
                <a href="#" id="logout-btn" class="nav-signup btn btn-accent btn-sm">Logout</a>
            `;
        }
        
        // Update auth links HTML
        authLinks.innerHTML = newAuthLinksHTML;
        
        // Add event listener to logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logoutUser();
                window.location.href = 'index.html';
            });
        }
    }
}

/**
 * Show notification
 * @param {string} message Message to display
 * @param {string} type Type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists, if not create it
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Style notification
    notification.style.backgroundColor = type === 'success' ? '#28a745' : 
                                        type === 'error' ? '#dc3545' : 
                                        type === 'warning' ? '#ffc107' : '#17a2b8';
    notification.style.color = 'white';
    notification.style.padding = '15px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.width = '300px';
    notification.style.maxWidth = '100%';
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Add event listener to close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '1.5rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.float = 'right';
    closeBtn.style.marginLeft = '10px';
    closeBtn.style.marginTop = '-5px';
    
    closeBtn.addEventListener('click', function() {
        hideNotification(notification);
    });
    
    // Auto hide notification after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

/**
 * Hide notification
 * @param {HTMLElement} notification Notification element to hide
 */
function hideNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    
    setTimeout(() => {
        notification.remove();
    }, 300);
}

/**
 * Set error on form field
 * @param {HTMLElement} input Input element
 * @param {string} message Error message
 */
function setError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorDisplay = formGroup.querySelector('.validation-error');
    
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    if (errorDisplay) {
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block';
    }
}

/**
 * Set success on form field
 * @param {HTMLElement} input Input element
 */
function setSuccess(input) {
    const formGroup = input.closest('.form-group');
    const errorDisplay = formGroup.querySelector('.validation-error');
    
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    if (errorDisplay) {
        errorDisplay.style.display = 'none';
    }
}

/**
 * Check if email is valid
 * @param {string} email Email to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/**
 * Check if phone number is valid
 * @param {string} phone Phone number to validate
 * @returns {boolean} True if phone number is valid, false otherwise
 */
function isValidPhone(phone) {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone);
}

/**
 * Check password strength
 * @param {string} password Password to check
 * @returns {number} Strength score (0-4)
 */
function checkPasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) {
        strength += 1;
    }
    
    // Contains lowercase and uppercase letters
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        strength += 1;
    }
    
    // Contains numbers
    if (password.match(/\d/)) {
        strength += 1;
    }
    
    // Contains special characters
    if (password.match(/[^a-zA-Z\d]/)) {
        strength += 1;
    }
    
    return strength;
}