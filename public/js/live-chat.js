/**
 * BlueRock Asset Management - Live Chat Integration
 * This file handles the live chat functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find all "Speak to an advisor" buttons/links
    const advisorButtons = document.querySelectorAll('a[href*="advisor"], button[onclick*="advisor"]');
    
    // Add click event listener to each button
    advisorButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openLiveChat();
        });
    });
    
    // Also handle the "Start Chat" button on the support page
    const startChatButtons = document.querySelectorAll('button[onclick*="openLiveChat"]');
    startChatButtons.forEach(button => {
        button.onclick = function(e) {
            e.preventDefault();
            openLiveChat();
        };
    });
});

/**
 * Open the live chat window
 */
function openLiveChat() {
    // Check if JivoChat API is available
    if (window.jivo_api) {
        // Open JivoChat window
        window.jivo_api.open();
    } else {
        // If JivoChat is not loaded yet, try to load it
        loadJivoChat();
        
        // Show a message to the user
        showChatNotification('Live chat is loading. Please wait a moment...');
        
        // Try to open chat after a short delay
        setTimeout(function() {
            if (window.jivo_api) {
                window.jivo_api.open();
            } else {
                showChatNotification('Live chat is not available at the moment. Please try again later or contact us via email.');
            }
        }, 2000);
    }
}

/**
 * Load JivoChat script if not already loaded
 */
function loadJivoChat() {
    if (!document.querySelector('script[src*="jivosite.com"]')) {
        const script = document.createElement('script');
        script.src = '//code.jivosite.com/widget/foeFKzf8Lf';
        script.async = true;
        document.head.appendChild(script);
    }
}

/**
 * Show a notification to the user
 */
function showChatNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('chat-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'chat-notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--primary-color, #0056b3)';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '9999';
        notification.style.maxWidth = '300px';
        notification.style.animation = 'fadeIn 0.3s ease';
        
        // Add close button
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '5px';
        closeBtn.style.right = '10px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '18px';
        closeBtn.onclick = function() {
            notification.remove();
        };
        
        notification.appendChild(closeBtn);
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
    }
    
    // Set message
    notification.innerHTML = message + '<span style="position: absolute; top: 5px; right: 10px; cursor: pointer; font-size: 18px;">&times;</span>';
    
    // Add click event to close button
    notification.querySelector('span').onclick = function() {
        notification.remove();
    };
    
    // Auto-remove after 5 seconds
    setTimeout(function() {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add a global function to open live chat
window.openLiveChat = openLiveChat;