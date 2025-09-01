/**
 * BlueRock Asset Management - Newsletter Signup with Incentive
 * This script implements a newsletter signup form with incentive download
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize newsletter signup functionality
    initNewsletterSignup();
    
    // Add newsletter popup after delay
    setTimeout(() => {
        showNewsletterPopup();
    }, 30000); // Show after 30 seconds
});

/**
 * Initialize newsletter signup functionality
 */
function initNewsletterSignup() {
    // Find all newsletter forms
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        // Add submit event listener
        form.addEventListener('submit', handleNewsletterSubmit);
    });
}

/**
 * Handle newsletter form submission
 * @param {Event} e - Form submit event
 */
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    // Validate email
    if (!isValidEmail(email)) {
        showFormError(emailInput, 'Please enter a valid email address');
        return;
    }
    
    // Clear any previous errors
    clearFormError(emailInput);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        
        // Show success message
        showNewsletterSuccess(form, email);
        
        // Clear form
        form.reset();
        
        // Store subscription in localStorage
        storeSubscription(email);
    }, 1500);
}

/**
 * Show newsletter success message and incentive download
 * @param {HTMLElement} form - The newsletter form
 * @param {string} email - The subscriber's email
 */
function showNewsletterSuccess(form, email) {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'newsletter-success';
    successMessage.innerHTML = `
        <div class="newsletter-success-content">
            <div class="newsletter-success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Thank You for Subscribing!</h3>
            <p>Your free investment guide is ready to download.</p>
            <div class="incentive-download">
                <div class="incentive-preview">
                    <img src="images/investment-guide-cover.svg" alt="Investment Guide Preview" style="width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'250\' viewBox=\'0 0 200 250\'%3E%3Crect width=\'200\' height=\'250\' fill=\'%23f8f9fa\' /%3E%3Ctext x=\'50%25\' y=\'50%25\' font-family=\'Arial\' font-size=\'16\' fill=\'%23999\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3EInvestment Guide%3C/text%3E%3C/svg%3E'">
                </div>
                <div class="incentive-info">
                    <h4>2025 Investment Strategy Guide</h4>
                    <p>Learn the top investment strategies for maximizing returns in today's market.</p>
                    <a href="#" class="download-button" data-email="${email}">
                        <i class="fas fa-download"></i> Download PDF
                    </a>
                </div>
            </div>
            <p class="newsletter-confirmation">
                We've also sent a copy to <strong>${email}</strong>. Please check your inbox.
            </p>
        </div>
    `;
    
    // Style success message
    const style = document.createElement('style');
    style.textContent = `
        .newsletter-success {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            margin-top: 20px;
        }
        
        .newsletter-success-icon {
            font-size: 3rem;
            color: #28a745;
            margin-bottom: 15px;
        }
        
        .newsletter-success h3 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #333;
        }
        
        .newsletter-success p {
            margin-bottom: 20px;
            color: #666;
        }
        
        .incentive-download {
            display: flex;
            align-items: center;
            background-color: white;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
            text-align: left;
        }
        
        .incentive-preview {
            flex: 0 0 100px;
            margin-right: 20px;
        }
        
        .incentive-preview img {
            width: 100%;
            height: auto;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .incentive-info {
            flex: 1;
        }
        
        .incentive-info h4 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #333;
        }
        
        .incentive-info p {
            margin-bottom: 15px;
            font-size: 0.9rem;
            color: #666;
        }
        
        .download-button {
            display: inline-block;
            background-color: var(--primary-color, #1e3a8a);
            color: white;
            padding: 8px 15px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            transition: background-color 0.2s;
        }
        
        .download-button:hover {
            background-color: var(--primary-color-dark, #152a63);
        }
        
        .newsletter-confirmation {
            font-size: 0.9rem;
            color: #666;
            margin-top: 20px;
        }
        
        @media (max-width: 768px) {
            .incentive-download {
                flex-direction: column;
            }
            
            .incentive-preview {
                margin-right: 0;
                margin-bottom: 15px;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Replace form with success message
    form.style.display = 'none';
    form.parentNode.insertBefore(successMessage, form.nextSibling);
    
    // Add event listener to download button
    const downloadButton = successMessage.querySelector('.download-button');
    downloadButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Simulate download
        window.open('investment-guide.pdf', '_blank');
    });
}

/**
 * Show newsletter popup
 */
function showNewsletterPopup() {
    // Check if user has already subscribed or dismissed popup
    if (localStorage.getItem('newsletter_subscribed') || localStorage.getItem('newsletter_dismissed')) {
        return;
    }
    
    // Create popup element
    const popup = document.createElement('div');
    popup.className = 'newsletter-popup';
    popup.innerHTML = `
        <div class="newsletter-popup-content">
            <button class="newsletter-popup-close">&times;</button>
            <div class="newsletter-popup-header">
                <h3>Get Your Free Investment Guide</h3>
                <p>Subscribe to our newsletter and receive our exclusive 2025 Investment Strategy Guide.</p>
            </div>
            <div class="newsletter-popup-body">
                <div class="newsletter-popup-incentive">
                    <img src="images/investment-guide-cover.svg" alt="Investment Guide Preview" style="width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'250\' viewBox=\'0 0 200 250\'%3E%3Crect width=\'200\' height=\'250\' fill=\'%23f8f9fa\' /%3E%3Ctext x=\'50%25\' y=\'50%25\' font-family=\'Arial\' font-size=\'16\' fill=\'%23999\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3EInvestment Guide%3C/text%3E%3C/svg%3E'">
                    <div class="newsletter-popup-features">
                        <div class="feature">
                            <i class="fas fa-check"></i>
                            <span>Market trend analysis</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-check"></i>
                            <span>Top investment picks</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-check"></i>
                            <span>Risk management strategies</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-check"></i>
                            <span>Expert financial advice</span>
                        </div>
                    </div>
                </div>
                <form class="newsletter-popup-form">
                    <div class="form-group">
                        <label for="popup-email">Email Address</label>
                        <input type="email" id="popup-email" placeholder="Enter your email" required>
                        <div class="validation-error"></div>
                    </div>
                    <div class="form-group">
                        <label for="popup-name">First Name (Optional)</label>
                        <input type="text" id="popup-name" placeholder="Enter your first name">
                    </div>
                    <div class="form-group checkbox">
                        <input type="checkbox" id="popup-consent" required>
                        <label for="popup-consent">I agree to receive the newsletter and marketing communications from BlueRock Asset Management.</label>
                    </div>
                    <button type="submit" class="newsletter-popup-submit">Get Free Guide</button>
                </form>
            </div>
            <div class="newsletter-popup-footer">
                <p>We respect your privacy. Unsubscribe at any time.</p>
            </div>
        </div>
    `;
    
    // Add popup styles
    const style = document.createElement('style');
    style.textContent = `
        .newsletter-popup {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s;
            padding: 20px;
        }
        
        .newsletter-popup.show {
            opacity: 1;
            visibility: visible;
        }
        
        .newsletter-popup-content {
            background-color: white;
            border-radius: 8px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .newsletter-popup-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            color: #999;
            cursor: pointer;
            padding: 0;
            line-height: 1;
            z-index: 1;
        }
        
        .newsletter-popup-header {
            padding: 30px 30px 0;
            text-align: center;
        }
        
        .newsletter-popup-header h3 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 24px;
            color: var(--primary-color, #1e3a8a);
        }
        
        .newsletter-popup-header p {
            margin-bottom: 20px;
            color: #666;
        }
        
        .newsletter-popup-body {
            padding: 0 30px;
            display: flex;
            gap: 30px;
        }
        
        .newsletter-popup-incentive {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .newsletter-popup-incentive img {
            width: 100%;
            height: auto;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }
        
        .newsletter-popup-features {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .feature {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .feature i {
            color: #28a745;
        }
        
        .newsletter-popup-form {
            flex: 1;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            font-size: 14px;
            color: #333;
        }
        
        .form-group input[type="email"],
        .form-group input[type="text"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .form-group.checkbox {
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        
        .form-group.checkbox input {
            margin-top: 3px;
        }
        
        .form-group.checkbox label {
            font-weight: normal;
            font-size: 12px;
            color: #666;
        }
        
        .validation-error {
            color: #dc3545;
            font-size: 12px;
            margin-top: 5px;
            display: none;
        }
        
        .newsletter-popup-submit {
            width: 100%;
            background-color: var(--primary-color, #1e3a8a);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .newsletter-popup-submit:hover {
            background-color: var(--primary-color-dark, #152a63);
        }
        
        .newsletter-popup-footer {
            padding: 15px 30px 30px;
            text-align: center;
        }
        
        .newsletter-popup-footer p {
            margin: 0;
            font-size: 12px;
            color: #999;
        }
        
        @media (max-width: 768px) {
            .newsletter-popup-body {
                flex-direction: column;
            }
            
            .newsletter-popup-header,
            .newsletter-popup-body,
            .newsletter-popup-footer {
                padding-left: 20px;
                padding-right: 20px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(popup);
    
    // Show popup with animation
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // Add event listeners
    const closeButton = popup.querySelector('.newsletter-popup-close');
    const form = popup.querySelector('.newsletter-popup-form');
    
    closeButton.addEventListener('click', () => {
        hideNewsletterPopup(popup);
        localStorage.setItem('newsletter_dismissed', 'true');
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const emailInput = form.querySelector('#popup-email');
        const nameInput = form.querySelector('#popup-name');
        const email = emailInput.value.trim();
        const name = nameInput.value.trim();
        
        // Validate email
        if (!isValidEmail(email)) {
            showFormError(emailInput, 'Please enter a valid email address');
            return;
        }
        
        // Clear any previous errors
        clearFormError(emailInput);
        
        // Show loading state
        const submitButton = form.querySelector('.newsletter-popup-submit');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Hide popup
            hideNewsletterPopup(popup);
            
            // Store subscription in localStorage
            storeSubscription(email, name);
            
            // Show success notification
            showNotification('Thank you for subscribing! Your free investment guide has been sent to your email.', 'success');
            
            // Open the investment guide in a new tab
            window.open('investment-guide.pdf', '_blank');
        }, 1500);
    });
}

/**
 * Hide newsletter popup
 * @param {HTMLElement} popup - The popup element
 */
function hideNewsletterPopup(popup) {
    popup.classList.remove('show');
    setTimeout(() => {
        popup.remove();
    }, 300);
}

/**
 * Store subscription in localStorage
 * @param {string} email - The subscriber's email
 * @param {string} name - The subscriber's name (optional)
 */
function storeSubscription(email, name = '') {
    localStorage.setItem('newsletter_subscribed', 'true');
    localStorage.setItem('newsletter_email', email);
    if (name) {
        localStorage.setItem('newsletter_name', name);
    }
}

/**
 * Show form error
 * @param {HTMLElement} input - The input element
 * @param {string} message - The error message
 */
function showFormError(input, message) {
    const errorElement = input.parentNode.querySelector('.validation-error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    input.style.borderColor = '#dc3545';
}

/**
 * Clear form error
 * @param {HTMLElement} input - The input element
 */
function clearFormError(input) {
    const errorElement = input.parentNode.querySelector('.validation-error');
    errorElement.style.display = 'none';
    input.style.borderColor = '';
}

/**
 * Check if email is valid
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/**
 * Show notification
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info)
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
 * @param {HTMLElement} notification - The notification element
 */
function hideNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    
    setTimeout(() => {
        notification.remove();
    }, 300);
}