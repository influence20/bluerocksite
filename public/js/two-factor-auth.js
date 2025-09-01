/**
 * BlueRock Asset Management - Two-Factor Authentication
 * This file handles the two-factor authentication functionality for the client portal
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // Override the default login form submission
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
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
            
            // If form is valid, proceed with login
            if (isValid) {
                // In a real application, this would send data to the server for authentication
                // For demo purposes, we'll simulate a successful login and show 2FA screen
                
                // Hide login form
                loginForm.style.display = 'none';
                
                // Show 2FA form
                const twoFactorForm = document.getElementById('two-factor-form');
                if (twoFactorForm) {
                    twoFactorForm.style.display = 'block';
                    
                    // Generate and send verification code (in a real app)
                    sendVerificationCode(email.value.trim());
                } else {
                    // If 2FA form doesn't exist, create it
                    createTwoFactorForm();
                }
            }
        });
    }
    
    // Create 2FA form if it doesn't exist
    function createTwoFactorForm() {
        const loginCard = document.querySelector('.login-card');
        const loginBody = document.querySelector('.login-body');
        
        if (loginBody) {
            // Create 2FA form
            const twoFactorForm = document.createElement('form');
            twoFactorForm.id = 'two-factor-form';
            twoFactorForm.className = 'auth-form';
            twoFactorForm.style.display = 'block';
            
            // Create form content
            twoFactorForm.innerHTML = `
                <div class="two-factor-header" style="text-align: center; margin-bottom: 30px;">
                    <i class="fas fa-shield-alt" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 15px;"></i>
                    <h2>Two-Factor Authentication</h2>
                    <p>We've sent a verification code to your email address and mobile phone. Please enter the code below to continue.</p>
                </div>
                
                <div class="form-group">
                    <label for="verification-code">Verification Code</label>
                    <div class="verification-code-container" style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <input type="text" class="verification-digit" maxlength="1" style="width: 45px; height: 55px; text-align: center; font-size: 1.5rem; margin-right: 10px;" autofocus>
                        <input type="text" class="verification-digit" maxlength="1" style="width: 45px; height: 55px; text-align: center; font-size: 1.5rem; margin-right: 10px;">
                        <input type="text" class="verification-digit" maxlength="1" style="width: 45px; height: 55px; text-align: center; font-size: 1.5rem; margin-right: 10px;">
                        <input type="text" class="verification-digit" maxlength="1" style="width: 45px; height: 55px; text-align: center; font-size: 1.5rem; margin-right: 10px;">
                        <input type="text" class="verification-digit" maxlength="1" style="width: 45px; height: 55px; text-align: center; font-size: 1.5rem; margin-right: 10px;">
                        <input type="text" class="verification-digit" maxlength="1" style="width: 45px; height: 55px; text-align: center; font-size: 1.5rem;">
                    </div>
                    <div class="validation-error" style="display: none; color: #dc3545; font-size: 0.85rem; margin-top: 5px;"></div>
                </div>
                
                <div style="margin-bottom: 20px; text-align: center;">
                    <div class="countdown" style="font-size: 0.9rem; color: #6c757d; margin-bottom: 10px;">
                        Code expires in <span id="countdown-timer">05:00</span>
                    </div>
                    <a href="#" id="resend-code" style="color: var(--primary-color); text-decoration: none; font-size: 0.9rem;">Didn't receive a code? Resend</a>
                </div>
                
                <button type="submit" class="login-btn ripple">Verify and Login</button>
                
                <div style="margin-top: 20px; text-align: center;">
                    <a href="#" id="back-to-login" style="color: var(--primary-color); text-decoration: none;">Back to Login</a>
                </div>
            `;
            
            // Append 2FA form to login body
            loginBody.appendChild(twoFactorForm);
            
            // Add event listeners for verification code inputs
            const digitInputs = document.querySelectorAll('.verification-digit');
            digitInputs.forEach((input, index) => {
                // Auto-focus next input when a digit is entered
                input.addEventListener('input', function() {
                    if (this.value.length === 1) {
                        // Move to next input
                        if (index < digitInputs.length - 1) {
                            digitInputs[index + 1].focus();
                        }
                    }
                });
                
                // Handle backspace
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Backspace' && this.value.length === 0) {
                        // Move to previous input
                        if (index > 0) {
                            digitInputs[index - 1].focus();
                        }
                    }
                });
            });
            
            // Add event listener for 2FA form submission
            twoFactorForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get verification code
                let verificationCode = '';
                digitInputs.forEach(input => {
                    verificationCode += input.value;
                });
                
                // Validate verification code
                if (verificationCode.length !== 6) {
                    const errorDisplay = document.querySelector('#two-factor-form .validation-error');
                    errorDisplay.textContent = 'Please enter the 6-digit verification code';
                    errorDisplay.style.display = 'block';
                    return;
                }
                
                // In a real application, this would verify the code with the server
                // For demo purposes, we'll accept any 6-digit code
                
                // Show loading state
                const submitBtn = twoFactorForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
                submitBtn.disabled = true;
                
                // Simulate verification delay
                setTimeout(() => {
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                }, 1500);
            });
            
            // Add event listener for "Back to Login" link
            const backToLoginLink = document.getElementById('back-to-login');
            if (backToLoginLink) {
                backToLoginLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Hide 2FA form
                    twoFactorForm.style.display = 'none';
                    
                    // Show login form
                    loginForm.style.display = 'block';
                });
            }
            
            // Add event listener for "Resend Code" link
            const resendCodeLink = document.getElementById('resend-code');
            if (resendCodeLink) {
                resendCodeLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Disable link temporarily
                    this.style.opacity = '0.5';
                    this.style.pointerEvents = 'none';
                    this.textContent = 'Sending...';
                    
                    // Simulate sending new code
                    setTimeout(() => {
                        // Reset countdown timer
                        startCountdownTimer();
                        
                        // Re-enable link
                        this.style.opacity = '1';
                        this.style.pointerEvents = 'auto';
                        this.textContent = "Didn't receive a code? Resend";
                        
                        // Show notification
                        showNotification('A new verification code has been sent to your email and phone.', 'success');
                    }, 2000);
                });
            }
            
            // Start countdown timer
            startCountdownTimer();
        }
    }
    
    // Start countdown timer for verification code expiration
    function startCountdownTimer() {
        const countdownElement = document.getElementById('countdown-timer');
        if (countdownElement) {
            // Set initial time (5 minutes)
            let minutes = 5;
            let seconds = 0;
            
            // Update timer every second
            const timerInterval = setInterval(() => {
                // Decrease seconds
                seconds--;
                
                // If seconds reach -1, decrease minutes and reset seconds to 59
                if (seconds < 0) {
                    minutes--;
                    seconds = 59;
                }
                
                // Format time as MM:SS
                const formattedMinutes = String(minutes).padStart(2, '0');
                const formattedSeconds = String(seconds).padStart(2, '0');
                
                // Update countdown element
                countdownElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
                
                // If timer reaches 0, clear interval
                if (minutes === 0 && seconds === 0) {
                    clearInterval(timerInterval);
                    countdownElement.textContent = '00:00';
                    countdownElement.style.color = '#dc3545';
                    
                    // Show notification
                    showNotification('Your verification code has expired. Please request a new one.', 'warning');
                }
            }, 1000);
        }
    }
    
    // Simulate sending verification code
    function sendVerificationCode(email) {
        // In a real application, this would send a request to the server to generate and send a verification code
        // For demo purposes, we'll just show a notification
        
        // Show notification after a short delay to simulate sending
        setTimeout(() => {
            showNotification('A verification code has been sent to your email and phone.', 'success');
        }, 1000);
    }
    
    // Set error on form field
    function setError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.validation-error');
        
        formGroup.classList.add('error');
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block';
    }
    
    // Set success on form field
    function setSuccess(input) {
        const formGroup = input.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.validation-error');
        
        formGroup.classList.remove('error');
        errorDisplay.style.display = 'none';
    }
    
    // Check if email is valid
    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    
    // Show notification
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
        notification.style.color = type === 'warning' ? '#212529' : 'white';
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
        closeBtn.style.color = type === 'warning' ? '#212529' : 'white';
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
    
    // Hide notification
    function hideNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
});