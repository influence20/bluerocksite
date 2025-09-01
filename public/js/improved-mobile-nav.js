/**
 * BlueRock Asset Management - Improved Mobile Navigation
 * This script enhances the mobile navigation functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add live chat integration to "Speak to an advisor" buttons
    const advisorButtons = document.querySelectorAll('a[href="#"], button, a');
    advisorButtons.forEach(button => {
        const text = button.textContent.toLowerCase();
        if (text.includes('speak to an advisor') || text.includes('advisor') || text.includes('chat')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openLiveChat();
            });
        }
    });
    
    // Function to open live chat
    window.openLiveChat = function() {
        if (window.jivo_api) {
            window.jivo_api.open();
        } else {
            // If JivoChat API is not available, try to find the chat widget button and click it
            const jivoButton = document.querySelector('.jivo-btn-light');
            if (jivoButton) {
                jivoButton.click();
            } else {
                alert('Live chat is loading. Please click on the chat icon in the bottom right corner.');
            }
        }
    };
    
    // Fix mobile navigation
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        // Ensure mobile menu button is visible on mobile
        if (window.innerWidth <= 992) {
            mobileMenuBtn.style.display = 'block';
            
            // Set initial nav styles for mobile
            nav.style.position = 'fixed';
            nav.style.top = '0';
            nav.style.right = '-100%';
            nav.style.width = '80%';
            nav.style.maxWidth = '300px';
            nav.style.height = '100vh';
            nav.style.backgroundColor = 'white';
            nav.style.boxShadow = '-5px 0 15px rgba(0, 0, 0, 0.1)';
            nav.style.zIndex = '1000';
            nav.style.transition = 'right 0.3s ease';
            nav.style.overflowY = 'auto';
            nav.style.paddingTop = '80px';
            nav.style.display = 'block';
        }
        
        // Mobile menu toggle
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle active class on button
            this.classList.toggle('active');
            
            // Toggle mobile-nav-active class on nav
            nav.classList.toggle('mobile-nav-active');
            
            // Set explicit right position
            if (nav.classList.contains('mobile-nav-active')) {
                nav.style.right = '0';
            } else {
                nav.style.right = '-100%';
            }
            
            // Toggle menu-active class on body
            document.body.classList.toggle('menu-active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (nav && nav.classList.contains('mobile-nav-active') && 
            !nav.contains(e.target) && 
            e.target !== mobileMenuBtn && 
            !mobileMenuBtn.contains(e.target)) {
            
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('mobile-nav-active');
            nav.style.right = '-100%';
            document.body.classList.remove('menu-active');
        }
    });
    
    // Ensure login and signup links are visible and working
    const authLinks = document.querySelectorAll('.auth-links a, .nav-login, .nav-signup');
    authLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default here to allow navigation
            
            // If on mobile, close the menu
            if (window.innerWidth <= 992 && nav.classList.contains('mobile-nav-active')) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('mobile-nav-active');
                nav.style.right = '-100%';
                document.body.classList.remove('menu-active');
            }
        });
    });
    
    // Fix dropdown menus on mobile
    const dropdownItems = document.querySelectorAll('.has-dropdown');
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        const dropdown = item.querySelector('.dropdown');
        
        if (link && dropdown && window.innerWidth <= 992) {
            // Create a toggle button for the dropdown
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'dropdown-toggle';
            toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
            toggleBtn.style.background = 'none';
            toggleBtn.style.border = 'none';
            toggleBtn.style.color = 'inherit';
            toggleBtn.style.position = 'absolute';
            toggleBtn.style.right = '0';
            toggleBtn.style.top = '12px';
            toggleBtn.style.padding = '0 10px';
            
            // Insert the toggle button after the link
            link.parentNode.insertBefore(toggleBtn, link.nextSibling);
            
            // Set position relative to the parent li
            item.style.position = 'relative';
            
            // Initially hide the dropdown
            dropdown.style.display = 'none';
            
            // Toggle dropdown on click
            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle dropdown visibility
                if (dropdown.style.display === 'none') {
                    dropdown.style.display = 'block';
                    toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
                } else {
                    dropdown.style.display = 'none';
                    toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
                }
            });
        }
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        if (window.innerWidth <= 992) {
            // Mobile view
            mobileMenuBtn.style.display = 'block';
            
            // Set mobile nav styles if not already set
            if (getComputedStyle(nav).position !== 'fixed') {
                nav.style.position = 'fixed';
                nav.style.top = '0';
                nav.style.right = '-100%';
                nav.style.width = '80%';
                nav.style.maxWidth = '300px';
                nav.style.height = '100vh';
                nav.style.backgroundColor = 'white';
                nav.style.boxShadow = '-5px 0 15px rgba(0, 0, 0, 0.1)';
                nav.style.zIndex = '1000';
                nav.style.transition = 'right 0.3s ease';
                nav.style.overflowY = 'auto';
                nav.style.paddingTop = '80px';
                nav.style.display = 'block';
            }
            
            // Handle dropdown toggles
            const dropdownItems = document.querySelectorAll('.has-dropdown');
            dropdownItems.forEach(item => {
                const link = item.querySelector('a');
                const dropdown = item.querySelector('.dropdown');
                let toggleBtn = item.querySelector('.dropdown-toggle');
                
                if (link && dropdown) {
                    // Create toggle button if it doesn't exist
                    if (!toggleBtn) {
                        toggleBtn = document.createElement('button');
                        toggleBtn.className = 'dropdown-toggle';
                        toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
                        toggleBtn.style.background = 'none';
                        toggleBtn.style.border = 'none';
                        toggleBtn.style.color = 'inherit';
                        toggleBtn.style.position = 'absolute';
                        toggleBtn.style.right = '0';
                        toggleBtn.style.top = '12px';
                        toggleBtn.style.padding = '0 10px';
                        
                        // Insert the toggle button after the link
                        link.parentNode.insertBefore(toggleBtn, link.nextSibling);
                        
                        // Set position relative to the parent li
                        item.style.position = 'relative';
                        
                        // Initially hide the dropdown
                        dropdown.style.display = 'none';
                        
                        // Toggle dropdown on click
                        toggleBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Toggle dropdown visibility
                            if (dropdown.style.display === 'none') {
                                dropdown.style.display = 'block';
                                toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
                            } else {
                                dropdown.style.display = 'none';
                                toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
                            }
                        });
                    }
                }
            });
        } else {
            // Desktop view
            mobileMenuBtn.style.display = 'none';
            
            // Reset nav styles
            nav.style.position = '';
            nav.style.top = '';
            nav.style.right = '';
            nav.style.width = '';
            nav.style.maxWidth = '';
            nav.style.height = '';
            nav.style.backgroundColor = '';
            nav.style.boxShadow = '';
            nav.style.zIndex = '';
            nav.style.transition = '';
            nav.style.overflowY = '';
            nav.style.paddingTop = '';
            nav.style.display = '';
            
            // Remove active classes
            nav.classList.remove('mobile-nav-active');
            document.body.classList.remove('menu-active');
            
            // Reset dropdowns
            const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
            dropdownToggles.forEach(toggle => {
                toggle.remove();
            });
            
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.style.display = '';
            });
        }
    }
});

// Add this function to check if the mobile menu is working properly
function checkMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        console.log('Mobile menu button found:', mobileMenuBtn);
        console.log('Navigation found:', nav);
        
        // Check if event listeners are attached
        const events = getEventListeners(mobileMenuBtn);
        console.log('Mobile menu button events:', events);
        
        // Test toggle
        mobileMenuBtn.click();
        console.log('Mobile menu clicked, nav active:', nav.classList.contains('mobile-nav-active'));
        
        // Reset
        setTimeout(() => {
            mobileMenuBtn.click();
            console.log('Mobile menu clicked again, nav active:', nav.classList.contains('mobile-nav-active'));
        }, 1000);
    } else {
        console.error('Mobile menu elements not found!');
        if (!mobileMenuBtn) console.error('Mobile menu button missing');
        if (!nav) console.error('Navigation missing');
    }
}

// Helper function to get event listeners (for debugging)
function getEventListeners(element) {
    // This is a simplified version since we can't actually access the event listeners directly
    return {
        click: element.onclick ? true : 'No direct onclick handler'
    };
}