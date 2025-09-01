/**
 * BlueRock Asset Management - Lazy Loading Utility
 * This script implements lazy loading for images to improve page load performance
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize lazy loading for all images with data-src attribute
    initLazyLoading();
    
    // Initialize lazy loading for background images with data-bg attribute
    initLazyBackgrounds();
});

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    // Get all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    // Create an intersection observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the image is in the viewport
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Set the src attribute to the data-src value
                img.src = img.dataset.src;
                
                // If there's a data-srcset attribute, set the srcset attribute
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
                
                // Add a loaded class for potential animations
                img.classList.add('loaded');
                
                // Stop observing the image
                observer.unobserve(img);
            }
        });
    }, {
        // Options for the observer
        rootMargin: '50px 0px', // Start loading when image is 50px from viewport
        threshold: 0.01 // Trigger when at least 1% of the image is visible
    });
    
    // Observe each lazy image
    lazyImages.forEach(img => {
        // Add a loading class for potential styling
        img.classList.add('lazy');
        
        // Add native lazy loading attribute for browsers that support it
        img.setAttribute('loading', 'lazy');
        
        // Start observing the image
        imageObserver.observe(img);
    });
}

/**
 * Initialize lazy loading for background images
 */
function initLazyBackgrounds() {
    // Get all elements with data-bg attribute
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    
    // Create an intersection observer
    const backgroundObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // If the element is in the viewport
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Set the background image
                element.style.backgroundImage = `url(${element.dataset.bg})`;
                
                // Add a loaded class for potential animations
                element.classList.add('bg-loaded');
                
                // Stop observing the element
                observer.unobserve(element);
            }
        });
    }, {
        // Options for the observer
        rootMargin: '50px 0px', // Start loading when element is 50px from viewport
        threshold: 0.01 // Trigger when at least 1% of the element is visible
    });
    
    // Observe each element with a lazy background
    lazyBackgrounds.forEach(element => {
        // Add a loading class for potential styling
        element.classList.add('lazy-bg');
        
        // Start observing the element
        backgroundObserver.observe(element);
    });
}

/**
 * Apply lazy loading to all images on the page
 * This function can be called to convert regular images to lazy-loaded images
 */
function applyLazyLoadingToAllImages() {
    // Get all images without data-src attribute
    const images = document.querySelectorAll('img:not([data-src])');
    
    // Convert each image to use lazy loading
    images.forEach(img => {
        // Skip images that are already lazy loaded or don't have a src
        if (img.classList.contains('lazy') || !img.src) return;
        
        // Store the original src in data-src
        img.dataset.src = img.src;
        
        // If there's a srcset attribute, store it in data-srcset
        if (img.srcset) {
            img.dataset.srcset = img.srcset;
            img.removeAttribute('srcset');
        }
        
        // Set a placeholder or low-quality image
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        
        // Add native lazy loading attribute
        img.setAttribute('loading', 'lazy');
        
        // Add lazy class
        img.classList.add('lazy');
    });
    
    // Initialize lazy loading
    initLazyLoading();
}

// Add a small CSS snippet for fade-in effect
(function() {
    const style = document.createElement('style');
    style.textContent = `
        img.lazy {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        
        img.lazy.loaded {
            opacity: 1;
        }
        
        .lazy-bg {
            transition: background-image 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(style);
})();