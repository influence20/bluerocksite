/**
 * BlueRock Asset Management - Fixed Navigation Script
 * This script handles the mobile navigation menu functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Fixed navigation script loaded');
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    const body = document.body;
    
    if (mobileMenuBtn && nav) {
        console.log('Mobile menu button and nav found');
        
        // Force the mobile menu button to be visible on mobile
        if (window.innerWidth <= 992) {
            mobileMenuBtn.style.display = 'block';
        }
        
        mobileMenuBtn.addEventListener('click', function(e) {
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
            } else {
                nav.style.right = '-100%';
            }
            
            console.log('Nav active:', nav.classList.contains('mobile-nav-active'));
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('mobile-nav-active') && 
                !nav.contains(e.target) && 
                e.target !== mobileMenuBtn && 
                !mobileMenuBtn.contains(e.target)) {
                
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('mobile-nav-active');
                nav.style.right = '-100%';
                body.classList.remove('menu-active');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('mobile-nav-active');
                nav.style.right = '-100%';
                body.classList.remove('menu-active');
            });
        });
    } else {
        console.log('Mobile menu button or nav not found');
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
            
            // Reinitialize click event
            mobileMenuBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile menu button clicked (from load event)');
                
                // Toggle active class on button
                this.classList.toggle('active');
                
                // Toggle mobile-nav-active class on nav
                if (nav.classList.contains('mobile-nav-active')) {
                    nav.classList.remove('mobile-nav-active');
                    nav.style.right = '-100%';
                } else {
                    nav.classList.add('mobile-nav-active');
                    nav.style.right = '0';
                }
                
                // Toggle menu-active class on body
                document.body.classList.toggle('menu-active');
            };
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
                
                // Remove active classes
                nav.classList.remove('mobile-nav-active');
                document.body.classList.remove('menu-active');
            }
        }
    });
});