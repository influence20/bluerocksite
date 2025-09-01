/**
 * BlueRock Asset Management - Social Media Sharing
 * This script implements social media sharing functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize social sharing functionality
    initSocialSharing();
    
    // Add Open Graph meta tags if they don't exist
    addOpenGraphTags();
    
    // Add Twitter Card meta tags if they don't exist
    addTwitterCardTags();
});

/**
 * Initialize social sharing functionality
 */
function initSocialSharing() {
    // Find all share buttons containers
    const shareContainers = document.querySelectorAll('.share-buttons');
    
    if (shareContainers.length === 0) {
        // If no share buttons containers exist, add them to appropriate pages
        addShareButtonsToContent();
    } else {
        // If share buttons containers exist, enhance them
        enhanceExistingShareButtons(shareContainers);
    }
    
    // Add floating share bar to all pages except admin and dashboard
    if (!window.location.pathname.includes('admin.html') && 
        !window.location.pathname.includes('dashboard.html') &&
        !window.location.pathname.includes('login.html') &&
        !window.location.pathname.includes('signup.html')) {
        addFloatingShareBar();
    }
}

/**
 * Add share buttons to content
 */
function addShareButtonsToContent() {
    // Check if the page is a content page (blog post, article, etc.)
    const contentPages = [
        'blog-post.html',
        'education.html',
        'investment-plans.html',
        'investments.html',
        'retirement.html',
        'savings.html',
        'tax.html',
        'estate.html'
    ];
    
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!contentPages.includes(currentPage)) {
        return;
    }
    
    // Find appropriate container for share buttons
    let container;
    
    if (currentPage === 'blog-post.html') {
        container = document.querySelector('.post-content');
    } else {
        container = document.querySelector('.main-content, .content-section, .page-content');
    }
    
    if (!container) {
        return;
    }
    
    // Create share buttons container
    const shareContainer = document.createElement('div');
    shareContainer.className = 'share-buttons';
    shareContainer.innerHTML = `
        <h4>Share This</h4>
        <div class="share-buttons-inner">
            <a href="#" class="share-button share-facebook" data-platform="facebook">
                <i class="fab fa-facebook-f"></i>
                <span>Facebook</span>
            </a>
            <a href="#" class="share-button share-twitter" data-platform="twitter">
                <i class="fab fa-twitter"></i>
                <span>Twitter</span>
            </a>
            <a href="#" class="share-button share-linkedin" data-platform="linkedin">
                <i class="fab fa-linkedin-in"></i>
                <span>LinkedIn</span>
            </a>
            <a href="#" class="share-button share-email" data-platform="email">
                <i class="fas fa-envelope"></i>
                <span>Email</span>
            </a>
            <button class="share-button share-copy" data-platform="copy">
                <i class="fas fa-link"></i>
                <span>Copy Link</span>
            </button>
        </div>
    `;
    
    // Add share buttons to container
    container.appendChild(shareContainer);
    
    // Add event listeners to share buttons
    addShareButtonListeners(shareContainer);
}

/**
 * Enhance existing share buttons
 * @param {NodeList} containers - Share buttons containers
 */
function enhanceExistingShareButtons(containers) {
    containers.forEach(container => {
        // Check if container already has enhanced buttons
        if (container.querySelector('.share-button[data-platform]')) {
            return;
        }
        
        // Clear existing content
        const title = container.querySelector('h4, h3, .share-title');
        const titleText = title ? title.textContent : 'Share This';
        container.innerHTML = '';
        
        // Add new content
        container.innerHTML = `
            <h4>${titleText}</h4>
            <div class="share-buttons-inner">
                <a href="#" class="share-button share-facebook" data-platform="facebook">
                    <i class="fab fa-facebook-f"></i>
                    <span>Facebook</span>
                </a>
                <a href="#" class="share-button share-twitter" data-platform="twitter">
                    <i class="fab fa-twitter"></i>
                    <span>Twitter</span>
                </a>
                <a href="#" class="share-button share-linkedin" data-platform="linkedin">
                    <i class="fab fa-linkedin-in"></i>
                    <span>LinkedIn</span>
                </a>
                <a href="#" class="share-button share-email" data-platform="email">
                    <i class="fas fa-envelope"></i>
                    <span>Email</span>
                </a>
                <button class="share-button share-copy" data-platform="copy">
                    <i class="fas fa-link"></i>
                    <span>Copy Link</span>
                </button>
            </div>
        `;
        
        // Add event listeners to share buttons
        addShareButtonListeners(container);
    });
}

/**
 * Add floating share bar
 */
function addFloatingShareBar() {
    // Create floating share bar
    const floatingBar = document.createElement('div');
    floatingBar.className = 'floating-share-bar';
    floatingBar.innerHTML = `
        <button class="floating-share-toggle">
            <i class="fas fa-share-alt"></i>
        </button>
        <div class="floating-share-buttons">
            <a href="#" class="share-button share-facebook" data-platform="facebook">
                <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="share-button share-twitter" data-platform="twitter">
                <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="share-button share-linkedin" data-platform="linkedin">
                <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="#" class="share-button share-email" data-platform="email">
                <i class="fas fa-envelope"></i>
            </a>
            <button class="share-button share-copy" data-platform="copy">
                <i class="fas fa-link"></i>
            </button>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .floating-share-bar {
            position: fixed;
            left: 20px;
            bottom: 80px;
            z-index: 999;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .floating-share-toggle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: var(--primary-color, #1e3a8a);
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: background-color 0.2s;
            margin-bottom: 10px;
        }
        
        .floating-share-toggle:hover {
            background-color: var(--primary-color-dark, #152a63);
        }
        
        .floating-share-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s, transform 0.3s;
            pointer-events: none;
        }
        
        .floating-share-bar.active .floating-share-buttons {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
        
        .floating-share-buttons .share-button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s;
        }
        
        .floating-share-buttons .share-button:hover {
            transform: scale(1.1);
        }
        
        .floating-share-buttons .share-facebook {
            background-color: #3b5998;
        }
        
        .floating-share-buttons .share-twitter {
            background-color: #1da1f2;
        }
        
        .floating-share-buttons .share-linkedin {
            background-color: #0077b5;
        }
        
        .floating-share-buttons .share-email {
            background-color: #848484;
        }
        
        .floating-share-buttons .share-copy {
            background-color: #333;
            border: none;
            cursor: pointer;
        }
        
        .share-buttons {
            margin: 30px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        
        .share-buttons h4 {
            margin-top: 0;
            margin-bottom: 15px;
            color: #333;
            font-size: 18px;
        }
        
        .share-buttons-inner {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .share-buttons-inner .share-button {
            display: flex;
            align-items: center;
            padding: 8px 15px;
            border-radius: 4px;
            color: white;
            text-decoration: none;
            transition: opacity 0.2s;
        }
        
        .share-buttons-inner .share-button:hover {
            opacity: 0.9;
        }
        
        .share-buttons-inner .share-button i {
            margin-right: 8px;
        }
        
        .share-buttons-inner .share-facebook {
            background-color: #3b5998;
        }
        
        .share-buttons-inner .share-twitter {
            background-color: #1da1f2;
        }
        
        .share-buttons-inner .share-linkedin {
            background-color: #0077b5;
        }
        
        .share-buttons-inner .share-email {
            background-color: #848484;
        }
        
        .share-buttons-inner .share-copy {
            background-color: #333;
            border: none;
            cursor: pointer;
            color: white;
            display: flex;
            align-items: center;
            padding: 8px 15px;
            border-radius: 4px;
            transition: opacity 0.2s;
        }
        
        .share-buttons-inner .share-copy:hover {
            opacity: 0.9;
        }
        
        .share-buttons-inner .share-copy i {
            margin-right: 8px;
        }
        
        .share-count {
            display: inline-block;
            background-color: rgba(255, 255, 255, 0.2);
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 12px;
            margin-left: 8px;
        }
        
        @media (max-width: 768px) {
            .share-buttons-inner {
                flex-direction: column;
            }
            
            .floating-share-bar {
                left: 10px;
                bottom: 70px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(floatingBar);
    
    // Add event listeners
    const toggleButton = floatingBar.querySelector('.floating-share-toggle');
    toggleButton.addEventListener('click', () => {
        floatingBar.classList.toggle('active');
    });
    
    // Add event listeners to share buttons
    addShareButtonListeners(floatingBar);
}

/**
 * Add event listeners to share buttons
 * @param {HTMLElement} container - Container with share buttons
 */
function addShareButtonListeners(container) {
    const shareButtons = container.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.getAttribute('data-platform');
            shareContent(platform);
        });
    });
}

/**
 * Share content on specified platform
 * @param {string} platform - Platform to share on
 */
function shareContent(platform) {
    // Get page information
    const url = window.location.href;
    const title = document.title;
    const description = getMetaContent('description') || 'Check out this page from BlueRock Asset Management';
    
    // Get share URL based on platform
    let shareUrl;
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            openShareWindow(shareUrl);
            trackShare('Facebook');
            break;
            
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            openShareWindow(shareUrl);
            trackShare('Twitter');
            break;
            
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            openShareWindow(shareUrl);
            trackShare('LinkedIn');
            break;
            
        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this page: ${url}`)}`;
            window.location.href = shareUrl;
            trackShare('Email');
            break;
            
        case 'copy':
            copyToClipboard(url);
            showCopyNotification();
            trackShare('Copy Link');
            break;
    }
}

/**
 * Open share window
 * @param {string} url - URL to open
 */
function openShareWindow(url) {
    window.open(url, 'share-window', 'width=600,height=400');
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    // Create temporary input element
    const input = document.createElement('input');
    input.style.position = 'absolute';
    input.style.left = '-9999px';
    input.value = text;
    document.body.appendChild(input);
    
    // Select and copy text
    input.select();
    document.execCommand('copy');
    
    // Remove temporary input element
    document.body.removeChild(input);
}

/**
 * Show copy notification
 */
function showCopyNotification() {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = 'Link copied to clipboard!';
    
    // Style notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#333';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '9999';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    
    // Add notification to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Hide notification after 2 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

/**
 * Track share event
 * @param {string} platform - Platform shared on
 */
function trackShare(platform) {
    // In a real implementation, this would send data to an analytics service
    console.log(`Shared on ${platform}`);
    
    // Update share count in UI
    updateShareCount(platform);
}

/**
 * Update share count in UI
 * @param {string} platform - Platform shared on
 */
function updateShareCount(platform) {
    // Get all share buttons for the platform
    const buttons = document.querySelectorAll(`.share-${platform.toLowerCase()}`);
    
    buttons.forEach(button => {
        // Check if button already has a share count
        let countElement = button.querySelector('.share-count');
        
        if (!countElement) {
            // Create share count element
            countElement = document.createElement('span');
            countElement.className = 'share-count';
            countElement.textContent = '1';
            button.appendChild(countElement);
        } else {
            // Update existing share count
            const currentCount = parseInt(countElement.textContent);
            countElement.textContent = (currentCount + 1).toString();
        }
    });
}

/**
 * Get meta tag content
 * @param {string} name - Meta tag name
 * @returns {string|null} Meta tag content or null if not found
 */
function getMetaContent(name) {
    const meta = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="og:${name}"]`);
    return meta ? meta.getAttribute('content') : null;
}

/**
 * Add Open Graph meta tags
 */
function addOpenGraphTags() {
    // Check if Open Graph tags already exist
    if (document.querySelector('meta[property^="og:"]')) {
        return;
    }
    
    // Get page information
    const url = window.location.href;
    const title = document.title;
    const description = getMetaContent('description') || 'BlueRock Asset Management - Premium Investment Services';
    
    // Create Open Graph tags
    const ogTags = [
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: url },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: 'https://www.bluerockasset.com/images/og-image.jpg' },
        { property: 'og:site_name', content: 'BlueRock Asset Management' }
    ];
    
    // Add tags to head
    ogTags.forEach(tag => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', tag.property);
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
    });
}

/**
 * Add Twitter Card meta tags
 */
function addTwitterCardTags() {
    // Check if Twitter Card tags already exist
    if (document.querySelector('meta[name^="twitter:"]')) {
        return;
    }
    
    // Get page information
    const title = document.title;
    const description = getMetaContent('description') || 'BlueRock Asset Management - Premium Investment Services';
    
    // Create Twitter Card tags
    const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: 'https://www.bluerockasset.com/images/twitter-image.jpg' },
        { name: 'twitter:site', content: '@bluerockasset' }
    ];
    
    // Add tags to head
    twitterTags.forEach(tag => {
        const meta = document.createElement('meta');
        meta.setAttribute('name', tag.name);
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
    });
}