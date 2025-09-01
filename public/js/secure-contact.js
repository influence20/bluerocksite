/**
 * BlueRock Asset Management - Secure Contact Form
 * This file handles secure form submission with client-side encryption
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the support page with the contact form
    const supportForm = document.getElementById('support-form');
    if (supportForm) {
        // Generate a random public/private key pair for RSA encryption
        let keyPair = null;

        // Initialize encryption
        initializeEncryption().then(() => {
            console.log('Encryption initialized successfully');
        }).catch(error => {
            console.error('Failed to initialize encryption:', error);
        });

        // Handle form submission
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                return;
            }
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value,
                priority: document.getElementById('priority').value,
                message: document.getElementById('message').value.trim()
            };
            
            // Encrypt form data
            encryptFormData(formData).then(encryptedData => {
                // In a real application, this would send the encrypted data to the server
                // For demo purposes, we'll just show a success message
                
                // Show loading indicator
                const submitBtn = supportForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate server request
                setTimeout(() => {
                    // Hide loading indicator
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    
                    // Show success message
                    showNotification('Your message has been securely sent. We will contact you shortly.', 'success');
                    
                    // Reset form
                    supportForm.reset();
                }, 1500);
            }).catch(error => {
                console.error('Encryption error:', error);
                showNotification('There was an error encrypting your message. Please try again.', 'error');
            });
        });
    }
    
    // Initialize encryption
    async function initializeEncryption() {
        try {
            // Generate RSA key pair
            keyPair = await window.crypto.subtle.generateKey(
                {
                    name: "RSA-OAEP",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                },
                true,
                ["encrypt", "decrypt"]
            );
            
            return keyPair;
        } catch (error) {
            console.error('Error generating encryption keys:', error);
            throw error;
        }
    }
    
    // Encrypt form data
    async function encryptFormData(formData) {
        try {
            // Convert form data to JSON string
            const jsonData = JSON.stringify(formData);
            
            // Convert string to ArrayBuffer
            const encoder = new TextEncoder();
            const data = encoder.encode(jsonData);
            
            // Encrypt data with public key
            const encryptedData = await window.crypto.subtle.encrypt(
                {
                    name: "RSA-OAEP"
                },
                keyPair.publicKey,
                data
            );
            
            // Convert encrypted data to base64 string for transmission
            return arrayBufferToBase64(encryptedData);
        } catch (error) {
            console.error('Error encrypting form data:', error);
            throw error;
        }
    }
    
    // Convert ArrayBuffer to Base64 string
    function arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    
    // Validate form
    function validateForm() {
        let isValid = true;
        
        // Validate name
        const name = document.getElementById('name');
        if (name.value.trim() === '') {
            setError(name, 'Please enter your name');
            isValid = false;
        } else {
            setSuccess(name);
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
        
        // Validate subject
        const subject = document.getElementById('subject');
        if (subject.value === '') {
            setError(subject, 'Please select a subject');
            isValid = false;
        } else {
            setSuccess(subject);
        }
        
        // Validate message
        const message = document.getElementById('message');
        if (message.value.trim() === '') {
            setError(message, 'Please enter your message');
            isValid = false;
        } else {
            setSuccess(message);
        }
        
        return isValid;
    }
    
    // Set error on form field
    function setError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorDisplay = formGroup.querySelector('.validation-error');
        
        // Create error display if it doesn't exist
        if (!errorDisplay) {
            errorDisplay = document.createElement('div');
            errorDisplay.className = 'validation-error';
            formGroup.appendChild(errorDisplay);
        }
        
        formGroup.classList.add('error');
        errorDisplay.textContent = message;
        errorDisplay.style.display = 'block';
        errorDisplay.style.color = '#dc3545';
        errorDisplay.style.fontSize = '0.85rem';
        errorDisplay.style.marginTop = '5px';
    }
    
    // Set success on form field
    function setSuccess(input) {
        const formGroup = input.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.validation-error');
        
        formGroup.classList.remove('error');
        
        if (errorDisplay) {
            errorDisplay.style.display = 'none';
        }
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
    
    // Hide notification
    function hideNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
});