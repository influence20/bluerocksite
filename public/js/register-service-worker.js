/**
 * BlueRock Asset Management - Service Worker Registration
 * This script registers the service worker for offline functionality
 */

// Check if service workers are supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Register the service worker
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registered with scope:', registration.scope);
                
                // Check for updates to the service worker
                registration.addEventListener('updatefound', function() {
                    // A new service worker is being installed
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', function() {
                        // When the new service worker is installed
                        if (newWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                // New content is available, show update notification
                                showUpdateNotification();
                            }
                        }
                    });
                });
            })
            .catch(function(error) {
                console.error('Service Worker registration failed:', error);
            });
            
        // Listen for controller change events
        navigator.serviceWorker.addEventListener('controllerchange', function() {
            // The service worker controller has changed, reload the page
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });
    });
    
    // Variable to prevent multiple refreshes
    let refreshing = false;
    
    // Function to show update notification
    function showUpdateNotification() {
        // Check if notification container exists, if not create it
        let notificationContainer = document.getElementById('notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.bottom = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '9999';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">
                    <i class="fas fa-sync-alt"></i> New content is available. Click to update.
                </span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Style notification
        notification.style.backgroundColor = '#17a2b8';
        notification.style.color = 'white';
        notification.style.padding = '15px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        notification.style.width = '300px';
        notification.style.maxWidth = '100%';
        notification.style.cursor = 'pointer';
        
        // Add notification to container
        notificationContainer.appendChild(notification);
        
        // Add event listener to notification for update
        notification.addEventListener('click', function(e) {
            if (e.target.className === 'notification-close') return;
            
            // Skip the waiting service worker to activate it
            navigator.serviceWorker.ready.then(registration => {
                if (registration.waiting) {
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                }
            });
            
            // Hide notification
            hideNotification(notification);
        });
        
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
        
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            hideNotification(notification);
        });
    }
    
    // Function to hide notification
    function hideNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
}

// Listen for the 'appinstalled' event
window.addEventListener('appinstalled', (event) => {
    console.log('BlueRock Asset Management was installed as a PWA');
    
    // Show a thank you message
    if (typeof showNotification === 'function') {
        showNotification('Thank you for installing our app!', 'success');
    }
});

// Add event listener for beforeinstallprompt to provide custom install experience
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install promotion at appropriate time
    showInstallPromotion();
});

// Function to show install promotion
function showInstallPromotion() {
    // Only show if we have the deferred prompt and user hasn't installed yet
    if (!deferredPrompt) return;
    
    // Check if we've already shown the promotion recently
    const lastPrompt = localStorage.getItem('installPromptShown');
    if (lastPrompt && (Date.now() - parseInt(lastPrompt)) < 86400000) return; // Don't show more than once per day
    
    // Create install banner
    const installBanner = document.createElement('div');
    installBanner.className = 'install-banner';
    installBanner.innerHTML = `
        <div class="install-content">
            <div class="install-icon">
                <i class="fas fa-download"></i>
            </div>
            <div class="install-text">
                <strong>Install BlueRock Asset Management</strong>
                <p>Install our app for a better experience</p>
            </div>
            <div class="install-actions">
                <button class="install-button">Install</button>
                <button class="install-dismiss">Not Now</button>
            </div>
        </div>
    `;
    
    // Style the banner
    installBanner.style.position = 'fixed';
    installBanner.style.bottom = '0';
    installBanner.style.left = '0';
    installBanner.style.right = '0';
    installBanner.style.backgroundColor = 'white';
    installBanner.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
    installBanner.style.padding = '15px';
    installBanner.style.zIndex = '9999';
    installBanner.style.display = 'none'; // Hidden initially for animation
    
    // Style the content
    const installContent = installBanner.querySelector('.install-content');
    installContent.style.display = 'flex';
    installContent.style.alignItems = 'center';
    installContent.style.maxWidth = '1200px';
    installContent.style.margin = '0 auto';
    
    // Style the icon
    const installIcon = installBanner.querySelector('.install-icon');
    installIcon.style.fontSize = '2rem';
    installIcon.style.color = 'var(--primary-color)';
    installIcon.style.marginRight = '15px';
    
    // Style the text
    const installText = installBanner.querySelector('.install-text');
    installText.style.flex = '1';
    
    // Style the actions
    const installActions = installBanner.querySelector('.install-actions');
    installActions.style.display = 'flex';
    installActions.style.gap = '10px';
    
    // Style the install button
    const installButton = installBanner.querySelector('.install-button');
    installButton.style.backgroundColor = 'var(--primary-color)';
    installButton.style.color = 'white';
    installButton.style.border = 'none';
    installButton.style.padding = '8px 15px';
    installButton.style.borderRadius = '5px';
    installButton.style.cursor = 'pointer';
    
    // Style the dismiss button
    const dismissButton = installBanner.querySelector('.install-dismiss');
    dismissButton.style.backgroundColor = '#f8f9fa';
    dismissButton.style.color = '#6c757d';
    dismissButton.style.border = '1px solid #dee2e6';
    dismissButton.style.padding = '8px 15px';
    dismissButton.style.borderRadius = '5px';
    dismissButton.style.cursor = 'pointer';
    
    // Add to the document
    document.body.appendChild(installBanner);
    
    // Show with animation
    setTimeout(() => {
        installBanner.style.display = 'block';
        installBanner.style.transform = 'translateY(100%)';
        installBanner.style.transition = 'transform 0.3s ease-out';
        
        setTimeout(() => {
            installBanner.style.transform = 'translateY(0)';
        }, 10);
    }, 2000); // Show after 2 seconds
    
    // Add event listeners
    installButton.addEventListener('click', async () => {
        // Hide the banner
        installBanner.style.transform = 'translateY(100%)';
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        
        // We no longer need the prompt
        deferredPrompt = null;
        
        // Remove the banner after animation
        setTimeout(() => {
            installBanner.remove();
        }, 300);
        
        // Store that we've shown the prompt
        localStorage.setItem('installPromptShown', Date.now().toString());
    });
    
    dismissButton.addEventListener('click', () => {
        // Hide the banner with animation
        installBanner.style.transform = 'translateY(100%)';
        
        // Remove the banner after animation
        setTimeout(() => {
            installBanner.remove();
        }, 300);
        
        // Store that we've shown the prompt
        localStorage.setItem('installPromptShown', Date.now().toString());
    });
}