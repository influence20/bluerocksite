/**
 * BlueRock Asset Management - Apply Lazy Loading
 * This script converts all images on the page to use lazy loading
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all images without data-src attribute and not already lazy loaded
    const images = document.querySelectorAll('img:not([data-src]):not([loading="lazy"])');
    
    // Convert each image to use lazy loading
    images.forEach(img => {
        // Skip images without a src
        if (!img.src) return;
        
        // Skip small images (icons, logos) that are likely needed immediately
        if (img.width > 0 && img.width < 50 && img.height > 0 && img.height < 50) return;
        
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
    
    // Initialize lazy loading if the function exists
    if (typeof initLazyLoading === 'function') {
        initLazyLoading();
    }
});