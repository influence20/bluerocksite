/**
 * BlueRock Asset Management - Fixed Mobile Navigation
 * This script fixes mobile navigation issues and ensures proper functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Fixed mobile navigation script loaded');
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const body = document.body;
    
    if (mobileMenuBtn && nav) {
        console.log('Mobile menu button and nav found');
        
        // Force the mobile menu button to be visible on mobile
        if (window.innerWidth <= 992) {
            mobileMenuBtn.style.display = 'block';
            
            // Ensure nav is properly styled for mobile
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
        
        // Clear any existing event listeners
        const newMobileMenuBtn = mobileMenuBtn.cloneNode(true);
        mobileMenuBtn.parentNode.replaceChild(newMobileMenuBtn, mobileMenuBtn);
        
        // Add click event listener to the mobile menu button
        newMobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile menu button clicked');
            
            // Toggle active class on button
            this.classList.toggle('active');
            
            // Toggle mobile-nav-active class on nav
            nav.classList.toggle('mobile-nav-active');
            
            // Toggle menu-active class on body
            body.classList.toggle('menu-active');
            
            // If nav is now active, set its right position to 0
            if (nav.classList.contains('mobile-nav-active')) {
                nav.style.right = '0';
                nav.style.display = 'block';
            } else {
                nav.style.right = '-100%';
            }
            
            console.log('Nav active:', nav.classList.contains('mobile-nav-active'));
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('mobile-nav-active') && 
                !nav.contains(e.target) && 
                e.target !== newMobileMenuBtn && 
                !newMobileMenuBtn.contains(e.target)) {
                
                newMobileMenuBtn.classList.remove('active');
                nav.classList.remove('mobile-nav-active');
                nav.style.right = '-100%';
                body.classList.remove('menu-active');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                newMobileMenuBtn.classList.remove('active');
                nav.classList.remove('mobile-nav-active');
                nav.style.right = '-100%';
                body.classList.remove('menu-active');
            });
        });
    } else {
        console.error('Mobile menu button or nav not found');
        if (!mobileMenuBtn) console.error('Mobile menu button missing');
        if (!nav) console.error('Navigation missing');
    }
    
    // Add active class to current page link
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (linkHref !== 'index.html' && currentPage.includes(linkHref))) {
            link.classList.add('active');
        }
    });
});

// Add an event listener that runs after the page is fully loaded
window.addEventListener('load', function() {
    console.log('Window loaded - checking mobile menu');
    
    // Force mobile menu to work on mobile devices
    if (window.innerWidth <= 992) {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('nav');
        
        if (mobileMenuBtn && nav) {
            console.log('Ensuring mobile menu is properly set up');
            
            // Make sure the mobile menu button is visible
            mobileMenuBtn.style.display = 'block';
            
            // Make sure nav is properly styled for mobile
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
    }
    
    // Add event listener for window resize
    window.addEventListener('resize', function() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('nav');
        
        if (mobileMenuBtn && nav) {
            if (window.innerWidth <= 992) {
                // Mobile view
                mobileMenuBtn.style.display = 'block';
                
                // Only reset nav styles if it's not already active
                if (!nav.classList.contains('mobile-nav-active')) {
                    nav.style.right = '-100%';
                }
                
                // Ensure nav is properly styled for mobile
                nav.style.position = 'fixed';
                nav.style.top = '0';
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
            } else {
                // Desktop view
                mobileMenuBtn.style.display = 'none';
                nav.style.right = '0';
                nav.style.position = '';
                nav.style.width = '';
                nav.style.maxWidth = '';
                nav.style.height = '';
                nav.style.backgroundColor = '';
                nav.style.boxShadow = '';
                nav.style.overflowY = '';
                nav.style.paddingTop = '';
                nav.style.display = '';
                
                // Remove active classes
                nav.classList.remove('mobile-nav-active');
                document.body.classList.remove('menu-active');
            }
        }
    });
});

// Function to manually toggle the mobile menu
// This can be called from the console for debugging
function toggleMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.click();
        return "Mobile menu toggled";
    } else {
        return "Mobile menu button not found";
    }
}