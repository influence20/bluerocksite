/**
 * BlueRock Asset Management - Login Handler
 * This file handles the login functionality for both client and admin users
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on admin login mode from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const isAdminMode = urlParams.get('admin') === 'true';
    
    // Get elements
    const loginCard = document.querySelector('.login-card');
    const loginHeader = document.querySelector('.login-header');
    const loginForm = document.getElementById('login-form');
    const loginBtn = loginForm.querySelector('button[type="submit"]');
    const adminLoginLink = document.querySelector('.admin-login a');
    const createAccountSection = document.querySelector('.create-account');
    
    // Function to switch to admin mode
    function switchToAdminMode() {
        // Update header
        loginHeader.querySelector('h2').innerHTML = 'Admin Portal <span class="admin-badge">Secure Area</span>';
        loginHeader.querySelector('p').textContent = 'Access the administrative dashboard';
        
        // Update button
        loginBtn.textContent = 'Login as Administrator';
        
        // Add admin mode class to card
        loginCard.classList.add('admin-mode');
        
        // Set form mode attribute
        loginForm.setAttribute('data-mode', 'admin');
        
        // Hide client-specific elements
        if (createAccountSection) {
            createAccountSection.style.display = 'none';
        }
        
        // Update admin login link
        if (adminLoginLink) {
            adminLoginLink.textContent = 'Client Login';
            adminLoginLink.href = 'login.html';
        }
    }
    
    // Function to switch to client mode
    function switchToClientMode() {
        // Update header
        loginHeader.querySelector('h2').textContent = 'Client Portal Login';
        loginHeader.querySelector('p').textContent = 'Access your investment dashboard';
        
        // Update button
        loginBtn.textContent = 'Login to Dashboard';
        
        // Remove admin mode class from card
        loginCard.classList.remove('admin-mode');
        
        // Remove form mode attribute
        loginForm.removeAttribute('data-mode');
        
        // Show client-specific elements
        if (createAccountSection) {
            createAccountSection.style.display = 'block';
        }
        
        // Update admin login link
        if (adminLoginLink) {
            adminLoginLink.textContent = 'Admin Login';
            adminLoginLink.href = 'login.html?admin=true';
        }
    }
    
    // Set initial mode based on URL parameter
    if (isAdminMode) {
        switchToAdminMode();
    } else {
        switchToClientMode();
    }
    
    // Add event listener to admin login link
    if (adminLoginLink) {
        adminLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle mode
            if (loginForm.getAttribute('data-mode') === 'admin') {
                // Switch to client mode
                switchToClientMode();
                
                // Update URL without reloading
                const url = new URL(window.location);
                url.searchParams.delete('admin');
                window.history.pushState({}, '', url);
            } else {
                // Switch to admin mode
                switchToAdminMode();
                
                // Update URL without reloading
                const url = new URL(window.location);
                url.searchParams.set('admin', 'true');
                window.history.pushState({}, '', url);
            }
        });
    }
    
    // Override form submission
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
            // Check if this is an admin login attempt
            const isAdminLogin = loginForm.getAttribute('data-mode') === 'admin';
            
            if (isAdminLogin) {
                // Use admin login function from admin-auth.js
                const result = adminLogin(email.value.trim(), password.value);
                
                if (result.success) {
                    showNotification('Login successful. Redirecting to admin dashboard...', 'success');
                    
                    // Redirect to admin dashboard or saved redirect URL
                    const redirectUrl = sessionStorage.getItem('adminRedirect') || 'admin.html';
                    sessionStorage.removeItem('adminRedirect');
                    
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 1500);
                } else {
                    showNotification(result.message, 'error');
                }
            } else {
                // Regular user login
                // For demo purposes, we'll check against some predefined users
                // In a real application, this would validate against a server
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
        }
    });
    
    // Helper functions
    function setError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.validation-error');
        
        formGroup.classList.add('error');
        errorDisplay.textContent = message;
    }
    
    function setSuccess(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Check if notification container exists
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
    
    function hideNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
    
    // Login user function
    function loginUser(userData) {
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('loginTime', new Date().getTime());
    }
});