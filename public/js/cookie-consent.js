/**
 * BlueRock Asset Management - Cookie Consent Banner
 * This script implements a GDPR-compliant cookie consent banner
 */

class CookieConsent {
    constructor(options = {}) {
        this.options = {
            cookieName: 'cookie_consent',
            cookieExpiration: 365, // days
            bannerPosition: 'bottom', // 'bottom', 'top', 'bottom-left', 'bottom-right'
            privacyPolicyUrl: 'privacy-policy.html',
            cookiePolicyUrl: 'cookie-policy.html',
            ...options
        };
        
        this.consentLevels = {
            necessary: {
                name: 'Necessary',
                description: 'Essential cookies that enable basic functionality of the website.',
                required: true,
                default: true
            },
            preferences: {
                name: 'Preferences',
                description: 'Cookies that remember your preferences and settings.',
                required: false,
                default: false
            },
            analytics: {
                name: 'Analytics',
                description: 'Cookies that help us understand how you use our website.',
                required: false,
                default: false
            },
            marketing: {
                name: 'Marketing',
                description: 'Cookies used for marketing and advertising purposes.',
                required: false,
                default: false
            }
        };
        
        this.consent = this.getConsentFromCookie();
        
        // If no consent cookie exists, show the banner
        if (!this.consent) {
            this.showBanner();
        }
        
        // Add event listener for privacy settings button
        document.addEventListener('click', (e) => {
            if (e.target.matches('.privacy-settings-button, .privacy-settings-button *')) {
                this.showPreferencesModal();
            }
        });
    }
    
    /**
     * Get consent from cookie
     * @returns {object|null} Consent object or null if no consent cookie exists
     */
    getConsentFromCookie() {
        const cookieValue = this.getCookie(this.options.cookieName);
        
        if (cookieValue) {
            try {
                return JSON.parse(cookieValue);
            } catch (error) {
                console.error('Error parsing consent cookie:', error);
                return null;
            }
        }
        
        return null;
    }
    
    /**
     * Get a cookie value by name
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value or null if cookie doesn't exist
     */
    getCookie(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return match ? decodeURIComponent(match[3]) : null;
    }
    
    /**
     * Set a cookie
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} days - Cookie expiration in days
     */
    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = '; expires=' + date.toUTCString();
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
    }
    
    /**
     * Show the cookie consent banner
     */
    showBanner() {
        // Create banner element
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-labelledby', 'cookie-consent-title');
        banner.setAttribute('aria-describedby', 'cookie-consent-description');
        
        // Set banner position
        let positionClass = 'position-bottom';
        switch (this.options.bannerPosition) {
            case 'top':
                positionClass = 'position-top';
                break;
            case 'bottom-left':
                positionClass = 'position-bottom-left';
                break;
            case 'bottom-right':
                positionClass = 'position-bottom-right';
                break;
        }
        
        banner.classList.add(positionClass);
        
        // Create banner content
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-header">
                    <h3 id="cookie-consent-title">Cookie Consent</h3>
                    <button class="cookie-consent-close" aria-label="Close cookie consent banner">&times;</button>
                </div>
                <p id="cookie-consent-description">
                    We use cookies to enhance your experience on our website. By clicking "Accept All", you consent to the use of all cookies. 
                    You can also choose which types of cookies you allow by clicking "Preferences".
                </p>
                <div class="cookie-consent-actions">
                    <button class="cookie-consent-button cookie-consent-preferences">Preferences</button>
                    <button class="cookie-consent-button cookie-consent-accept-necessary">Accept Necessary</button>
                    <button class="cookie-consent-button cookie-consent-accept-all">Accept All</button>
                </div>
                <div class="cookie-consent-footer">
                    <a href="${this.options.privacyPolicyUrl}" target="_blank">Privacy Policy</a>
                    <a href="${this.options.cookiePolicyUrl}" target="_blank">Cookie Policy</a>
                </div>
            </div>
        `;
        
        // Add banner styles
        const style = document.createElement('style');
        style.textContent = `
            .cookie-consent-banner {
                position: fixed;
                z-index: 9999;
                background-color: white;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
                font-family: Arial, sans-serif;
                font-size: 14px;
                line-height: 1.5;
                color: #333;
                max-width: 100%;
                padding: 0;
                box-sizing: border-box;
                transition: transform 0.3s ease-in-out;
            }
            
            .cookie-consent-banner.position-bottom {
                bottom: 0;
                left: 0;
                right: 0;
                border-top: 1px solid #eee;
                transform: translateY(100%);
            }
            
            .cookie-consent-banner.position-top {
                top: 0;
                left: 0;
                right: 0;
                border-bottom: 1px solid #eee;
                transform: translateY(-100%);
            }
            
            .cookie-consent-banner.position-bottom-left {
                bottom: 20px;
                left: 20px;
                max-width: 400px;
                border-radius: 8px;
                transform: translateY(20px);
                opacity: 0;
            }
            
            .cookie-consent-banner.position-bottom-right {
                bottom: 20px;
                right: 20px;
                max-width: 400px;
                border-radius: 8px;
                transform: translateY(20px);
                opacity: 0;
            }
            
            .cookie-consent-banner.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .cookie-consent-content {
                padding: 20px;
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .cookie-consent-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .cookie-consent-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: bold;
                color: #333;
            }
            
            .cookie-consent-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #999;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            
            .cookie-consent-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-top: 20px;
            }
            
            .cookie-consent-button {
                padding: 10px 15px;
                border-radius: 4px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                border: none;
                transition: background-color 0.2s;
            }
            
            .cookie-consent-preferences {
                background-color: #f8f9fa;
                color: #333;
                border: 1px solid #ddd;
            }
            
            .cookie-consent-preferences:hover {
                background-color: #e9ecef;
            }
            
            .cookie-consent-accept-necessary {
                background-color: #e9ecef;
                color: #333;
                border: 1px solid #ddd;
            }
            
            .cookie-consent-accept-necessary:hover {
                background-color: #dee2e6;
            }
            
            .cookie-consent-accept-all {
                background-color: var(--primary-color, #1e3a8a);
                color: white;
            }
            
            .cookie-consent-accept-all:hover {
                background-color: var(--primary-color-dark, #152a63);
            }
            
            .cookie-consent-footer {
                margin-top: 15px;
                font-size: 12px;
            }
            
            .cookie-consent-footer a {
                color: var(--primary-color, #1e3a8a);
                text-decoration: none;
                margin-right: 15px;
            }
            
            .cookie-consent-footer a:hover {
                text-decoration: underline;
            }
            
            .cookie-preferences-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s;
            }
            
            .cookie-preferences-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .cookie-preferences-content {
                background-color: white;
                border-radius: 8px;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .cookie-preferences-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .cookie-preferences-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: bold;
            }
            
            .cookie-preferences-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #999;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            
            .cookie-preferences-body {
                padding: 20px;
            }
            
            .cookie-category {
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
            }
            
            .cookie-category:last-child {
                border-bottom: none;
                margin-bottom: 0;
                padding-bottom: 0;
            }
            
            .cookie-category-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .cookie-category-title {
                font-weight: bold;
                font-size: 16px;
            }
            
            .cookie-category-toggle {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
            
            .cookie-category-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .cookie-category-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 24px;
            }
            
            .cookie-category-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            
            input:checked + .cookie-category-slider {
                background-color: var(--primary-color, #1e3a8a);
            }
            
            input:disabled + .cookie-category-slider {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            input:checked + .cookie-category-slider:before {
                transform: translateX(26px);
            }
            
            .cookie-category-description {
                font-size: 14px;
                color: #666;
                margin-bottom: 10px;
            }
            
            .cookie-preferences-footer {
                padding: 15px 20px;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            
            .privacy-settings-button {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background-color: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 8px 12px;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                z-index: 9998;
            }
            
            .privacy-settings-button:hover {
                background-color: #f8f9fa;
            }
            
            .privacy-settings-icon {
                font-size: 14px;
            }
            
            @media (max-width: 768px) {
                .cookie-consent-actions {
                    flex-direction: column;
                }
                
                .cookie-consent-button {
                    width: 100%;
                }
                
                .privacy-settings-button {
                    bottom: 10px;
                    left: 10px;
                    padding: 6px 10px;
                    font-size: 11px;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(banner);
        
        // Add event listeners
        const closeButton = banner.querySelector('.cookie-consent-close');
        const preferencesButton = banner.querySelector('.cookie-consent-preferences');
        const acceptNecessaryButton = banner.querySelector('.cookie-consent-accept-necessary');
        const acceptAllButton = banner.querySelector('.cookie-consent-accept-all');
        
        closeButton.addEventListener('click', () => {
            this.hideBanner();
        });
        
        preferencesButton.addEventListener('click', () => {
            this.showPreferencesModal();
        });
        
        acceptNecessaryButton.addEventListener('click', () => {
            this.saveConsent({
                necessary: true,
                preferences: false,
                analytics: false,
                marketing: false
            });
            this.hideBanner();
        });
        
        acceptAllButton.addEventListener('click', () => {
            this.saveConsent({
                necessary: true,
                preferences: true,
                analytics: true,
                marketing: true
            });
            this.hideBanner();
        });
        
        // Show banner with animation
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }
    
    /**
     * Hide the cookie consent banner
     */
    hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }
    
    /**
     * Show the preferences modal
     */
    showPreferencesModal() {
        // Hide banner if it exists
        this.hideBanner();
        
        // Create modal element
        const modal = document.createElement('div');
        modal.id = 'cookie-preferences-modal';
        modal.className = 'cookie-preferences-modal';
        
        // Get current consent or default values
        const currentConsent = this.consent || {
            necessary: true,
            preferences: false,
            analytics: false,
            marketing: false
        };
        
        // Create modal content
        modal.innerHTML = `
            <div class="cookie-preferences-content">
                <div class="cookie-preferences-header">
                    <h3>Cookie Preferences</h3>
                    <button class="cookie-preferences-close" aria-label="Close preferences modal">&times;</button>
                </div>
                <div class="cookie-preferences-body">
                    ${Object.entries(this.consentLevels).map(([key, level]) => `
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <div class="cookie-category-title">${level.name}</div>
                                <label class="cookie-category-toggle">
                                    <input type="checkbox" name="cookie-category-${key}" 
                                        ${currentConsent[key] ? 'checked' : ''} 
                                        ${level.required ? 'disabled' : ''}>
                                    <span class="cookie-category-slider"></span>
                                </label>
                            </div>
                            <div class="cookie-category-description">${level.description}</div>
                            ${level.required ? '<div class="cookie-category-required">Required - cannot be disabled</div>' : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="cookie-preferences-footer">
                    <button class="cookie-consent-button cookie-consent-preferences-save">Save Preferences</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeButton = modal.querySelector('.cookie-preferences-close');
        const saveButton = modal.querySelector('.cookie-consent-preferences-save');
        
        closeButton.addEventListener('click', () => {
            this.hidePreferencesModal();
        });
        
        saveButton.addEventListener('click', () => {
            // Get selected preferences
            const necessary = true; // Always required
            const preferences = modal.querySelector('input[name="cookie-category-preferences"]').checked;
            const analytics = modal.querySelector('input[name="cookie-category-analytics"]').checked;
            const marketing = modal.querySelector('input[name="cookie-category-marketing"]').checked;
            
            this.saveConsent({
                necessary,
                preferences,
                analytics,
                marketing
            });
            
            this.hidePreferencesModal();
        });
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }
    
    /**
     * Hide the preferences modal
     */
    hidePreferencesModal() {
        const modal = document.getElementById('cookie-preferences-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }
    
    /**
     * Save consent to cookie
     * @param {object} consent - Consent object
     */
    saveConsent(consent) {
        this.consent = consent;
        
        // Save consent to cookie
        this.setCookie(
            this.options.cookieName,
            JSON.stringify(consent),
            this.options.cookieExpiration
        );
        
        // Add privacy settings button if it doesn't exist
        this.addPrivacySettingsButton();
        
        // Apply consent settings
        this.applyConsentSettings();
    }
    
    /**
     * Add privacy settings button
     */
    addPrivacySettingsButton() {
        // Check if button already exists
        if (document.querySelector('.privacy-settings-button')) {
            return;
        }
        
        // Create button
        const button = document.createElement('button');
        button.className = 'privacy-settings-button';
        button.innerHTML = `
            <span class="privacy-settings-icon">
                <i class="fas fa-cookie-bite"></i>
            </span>
            <span>Privacy Settings</span>
        `;
        
        document.body.appendChild(button);
    }
    
    /**
     * Apply consent settings
     */
    applyConsentSettings() {
        // In a real implementation, this would enable/disable various tracking scripts
        // based on the user's consent settings
        
        console.log('Applying consent settings:', this.consent);
        
        // Example: Google Analytics
        if (this.consent.analytics) {
            // Enable analytics
            console.log('Analytics enabled');
        } else {
            // Disable analytics
            console.log('Analytics disabled');
            
            // Disable Google Analytics tracking
            window['ga-disable-UA-XXXXXXXX-X'] = true;
        }
        
        // Example: Marketing cookies
        if (this.consent.marketing) {
            // Enable marketing cookies
            console.log('Marketing cookies enabled');
        } else {
            // Disable marketing cookies
            console.log('Marketing cookies disabled');
        }
        
        // Dispatch event for other scripts to react to consent changes
        document.dispatchEvent(new CustomEvent('consentUpdated', {
            detail: this.consent
        }));
    }
}

// Initialize cookie consent when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global cookie consent instance
    window.cookieConsent = new CookieConsent({
        privacyPolicyUrl: 'privacy-policy.html',
        cookiePolicyUrl: 'cookie-policy.html',
        bannerPosition: 'bottom' // 'bottom', 'top', 'bottom-left', 'bottom-right'
    });
    
    // If consent already exists, apply settings
    if (window.cookieConsent.consent) {
        window.cookieConsent.applyConsentSettings();
        window.cookieConsent.addPrivacySettingsButton();
    }
});