/**
 * BlueRock Asset Management - Referral Program
 * This script implements a referral program for existing clients
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize referral program
    initReferralProgram();
});

/**
 * Initialize referral program
 */
function initReferralProgram() {
    // Check if user is logged in
    const isLoggedIn = checkUserLoggedIn();
    
    if (isLoggedIn) {
        // Add referral program to dashboard
        addReferralProgramToDashboard();
    } else {
        // Add referral code input to signup form
        enhanceReferralCodeInput();
    }
    
    // Check for referral code in URL
    checkReferralCodeInUrl();
}

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in, false otherwise
 */
function checkUserLoggedIn() {
    // Check for user data in session storage
    const userData = sessionStorage.getItem('user_data');
    return !!userData;
}

/**
 * Add referral program to dashboard
 */
function addReferralProgramToDashboard() {
    // Check if we're on the dashboard page
    if (!window.location.pathname.includes('dashboard.html')) {
        return;
    }
    
    // Find dashboard container
    const dashboardContainer = document.querySelector('.dashboard-content, .main-content');
    
    if (!dashboardContainer) {
        return;
    }
    
    // Check if referral program already exists
    if (document.querySelector('.referral-program-section')) {
        return;
    }
    
    // Create referral program section
    const referralSection = document.createElement('div');
    referralSection.className = 'referral-program-section';
    
    // Get user data
    const userData = JSON.parse(sessionStorage.getItem('user_data') || '{}');
    const userEmail = userData.email || 'user@example.com';
    
    // Generate referral code if not exists
    let referralCode = userData.referralCode;
    if (!referralCode) {
        referralCode = generateReferralCode(userEmail);
        userData.referralCode = referralCode;
        sessionStorage.setItem('user_data', JSON.stringify(userData));
    }
    
    // Generate referral link
    const referralLink = `${window.location.origin}/signup.html?ref=${referralCode}`;
    
    // Get referral stats
    const referralStats = getReferralStats(referralCode);
    
    // Create referral program content
    referralSection.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h2>Refer a Friend</h2>
            </div>
            <div class="card-body">
                <div class="referral-intro">
                    <div class="referral-icon">
                        <i class="fas fa-gift"></i>
                    </div>
                    <div class="referral-text">
                        <h3>Earn Rewards for Every Referral</h3>
                        <p>Invite your friends to join BlueRock Asset Management and earn rewards for each successful referral.</p>
                    </div>
                </div>
                
                <div class="referral-rewards">
                    <div class="reward-item">
                        <div class="reward-icon">
                            <i class="fas fa-percentage"></i>
                        </div>
                        <div class="reward-text">
                            <h4>Fee Discount</h4>
                            <p>0.25% fee discount for 3 months for each successful referral</p>
                        </div>
                    </div>
                    <div class="reward-item">
                        <div class="reward-icon">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="reward-text">
                            <h4>Cash Bonus</h4>
                            <p>$50 cash bonus when your friend invests $1,000 or more</p>
                        </div>
                    </div>
                    <div class="reward-item">
                        <div class="reward-icon">
                            <i class="fas fa-award"></i>
                        </div>
                        <div class="reward-text">
                            <h4>Premium Status</h4>
                            <p>Achieve Premium status with 5 successful referrals</p>
                        </div>
                    </div>
                </div>
                
                <div class="referral-share">
                    <h3>Share Your Referral Link</h3>
                    <div class="referral-link-container">
                        <input type="text" class="referral-link-input" value="${referralLink}" readonly>
                        <button class="copy-link-button">Copy</button>
                    </div>
                    <div class="referral-share-buttons">
                        <button class="share-button share-email" data-platform="email">
                            <i class="fas fa-envelope"></i>
                            <span>Email</span>
                        </button>
                        <button class="share-button share-facebook" data-platform="facebook">
                            <i class="fab fa-facebook-f"></i>
                            <span>Facebook</span>
                        </button>
                        <button class="share-button share-twitter" data-platform="twitter">
                            <i class="fab fa-twitter"></i>
                            <span>Twitter</span>
                        </button>
                        <button class="share-button share-linkedin" data-platform="linkedin">
                            <i class="fab fa-linkedin-in"></i>
                            <span>LinkedIn</span>
                        </button>
                        <button class="share-button share-whatsapp" data-platform="whatsapp">
                            <i class="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                        </button>
                    </div>
                </div>
                
                <div class="referral-stats">
                    <h3>Your Referral Stats</h3>
                    <div class="stats-container">
                        <div class="stat-item">
                            <div class="stat-value">${referralStats.pending}</div>
                            <div class="stat-label">Pending</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${referralStats.successful}</div>
                            <div class="stat-label">Successful</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">$${referralStats.earned}</div>
                            <div class="stat-label">Earned</div>
                        </div>
                    </div>
                </div>
                
                <div class="referral-history">
                    <h3>Referral History</h3>
                    ${referralStats.history.length > 0 ? `
                        <table class="referral-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Reward</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${referralStats.history.map(item => `
                                    <tr>
                                        <td>${item.date}</td>
                                        <td>${item.name}</td>
                                        <td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
                                        <td>${item.reward}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div class="empty-state">
                            <p>You haven't referred anyone yet. Share your referral link to get started!</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .referral-program-section {
            margin-top: 30px;
        }
        
        .referral-intro {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .referral-icon {
            font-size: 3rem;
            color: var(--primary-color, #1e3a8a);
            margin-right: 20px;
        }
        
        .referral-text h3 {
            margin-top: 0;
            margin-bottom: 10px;
            color: var(--primary-color, #1e3a8a);
        }
        
        .referral-text p {
            margin: 0;
            color: #666;
        }
        
        .referral-rewards {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .reward-item {
            flex: 1;
            min-width: 200px;
            display: flex;
            align-items: flex-start;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
        }
        
        .reward-icon {
            font-size: 1.5rem;
            color: var(--primary-color, #1e3a8a);
            margin-right: 15px;
        }
        
        .reward-text h4 {
            margin-top: 0;
            margin-bottom: 5px;
            color: #333;
        }
        
        .reward-text p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }
        
        .referral-share {
            margin-bottom: 30px;
        }
        
        .referral-share h3 {
            margin-top: 0;
            margin-bottom: 15px;
            color: #333;
        }
        
        .referral-link-container {
            display: flex;
            margin-bottom: 15px;
        }
        
        .referral-link-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px 0 0 4px;
            font-size: 14px;
        }
        
        .copy-link-button {
            padding: 10px 15px;
            background-color: var(--primary-color, #1e3a8a);
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .copy-link-button:hover {
            background-color: var(--primary-color-dark, #152a63);
        }
        
        .referral-share-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .referral-share-buttons .share-button {
            display: flex;
            align-items: center;
            padding: 8px 15px;
            border-radius: 4px;
            color: white;
            border: none;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        
        .referral-share-buttons .share-button:hover {
            opacity: 0.9;
        }
        
        .referral-share-buttons .share-button i {
            margin-right: 8px;
        }
        
        .referral-share-buttons .share-email {
            background-color: #848484;
        }
        
        .referral-share-buttons .share-facebook {
            background-color: #3b5998;
        }
        
        .referral-share-buttons .share-twitter {
            background-color: #1da1f2;
        }
        
        .referral-share-buttons .share-linkedin {
            background-color: #0077b5;
        }
        
        .referral-share-buttons .share-whatsapp {
            background-color: #25d366;
        }
        
        .referral-stats {
            margin-bottom: 30px;
        }
        
        .referral-stats h3 {
            margin-top: 0;
            margin-bottom: 15px;
            color: #333;
        }
        
        .stats-container {
            display: flex;
            gap: 20px;
        }
        
        .stat-item {
            flex: 1;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color, #1e3a8a);
            margin-bottom: 5px;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9rem;
        }
        
        .referral-history h3 {
            margin-top: 0;
            margin-bottom: 15px;
            color: #333;
        }
        
        .referral-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .referral-table th, .referral-table td {
            padding: 10px;
            border-bottom: 1px solid #eee;
            text-align: left;
        }
        
        .referral-table th {
            font-weight: bold;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .status-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: bold;
        }
        
        .status-pending {
            background-color: #ffeeba;
            color: #856404;
        }
        
        .status-successful {
            background-color: #c3e6cb;
            color: #155724;
        }
        
        .status-expired {
            background-color: #f5c6cb;
            color: #721c24;
        }
        
        .empty-state {
            text-align: center;
            padding: 30px;
            background-color: #f8f9fa;
            border-radius: 8px;
            color: #666;
        }
        
        @media (max-width: 768px) {
            .referral-intro {
                flex-direction: column;
                text-align: center;
            }
            
            .referral-icon {
                margin-right: 0;
                margin-bottom: 15px;
            }
            
            .referral-rewards {
                flex-direction: column;
            }
            
            .stats-container {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Add referral section to dashboard
    dashboardContainer.appendChild(referralSection);
    
    // Add event listeners
    const copyButton = referralSection.querySelector('.copy-link-button');
    copyButton.addEventListener('click', function() {
        const linkInput = referralSection.querySelector('.referral-link-input');
        copyToClipboard(linkInput.value);
        showCopyNotification();
    });
    
    const shareButtons = referralSection.querySelectorAll('.share-button');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            shareReferralLink(platform, referralLink);
        });
    });
}

/**
 * Enhance referral code input on signup form
 */
function enhanceReferralCodeInput() {
    // Check if we're on the signup page
    if (!window.location.pathname.includes('signup.html')) {
        return;
    }
    
    // Find referral code input
    const referralInput = document.querySelector('#referral');
    
    if (!referralInput) {
        return;
    }
    
    // Add validation and styling
    const referralGroup = referralInput.closest('.form-group');
    
    if (referralGroup) {
        // Add info text
        const infoText = document.createElement('div');
        infoText.className = 'referral-info';
        infoText.innerHTML = 'Enter a referral code to receive a signup bonus!';
        infoText.style.fontSize = '0.85rem';
        infoText.style.color = '#666';
        infoText.style.marginTop = '5px';
        
        referralGroup.appendChild(infoText);
        
        // Add validation
        referralInput.addEventListener('blur', function() {
            const code = this.value.trim();
            
            if (code && !isValidReferralCode(code)) {
                showReferralError('Invalid referral code');
            } else if (code) {
                showReferralSuccess('Valid referral code!');
            } else {
                clearReferralMessage();
            }
        });
        
        // Function to show error message
        function showReferralError(message) {
            clearReferralMessage();
            
            const errorMessage = document.createElement('div');
            errorMessage.className = 'referral-message error';
            errorMessage.textContent = message;
            errorMessage.style.color = '#dc3545';
            errorMessage.style.fontSize = '0.85rem';
            errorMessage.style.marginTop = '5px';
            
            referralGroup.appendChild(errorMessage);
            referralInput.style.borderColor = '#dc3545';
        }
        
        // Function to show success message
        function showReferralSuccess(message) {
            clearReferralMessage();
            
            const successMessage = document.createElement('div');
            successMessage.className = 'referral-message success';
            successMessage.textContent = message;
            successMessage.style.color = '#28a745';
            successMessage.style.fontSize = '0.85rem';
            successMessage.style.marginTop = '5px';
            
            referralGroup.appendChild(successMessage);
            referralInput.style.borderColor = '#28a745';
        }
        
        // Function to clear message
        function clearReferralMessage() {
            const message = referralGroup.querySelector('.referral-message');
            
            if (message) {
                message.remove();
            }
            
            referralInput.style.borderColor = '';
        }
    }
}

/**
 * Check for referral code in URL
 */
function checkReferralCodeInUrl() {
    // Get referral code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    
    if (referralCode) {
        // Check if we're on the signup page
        if (window.location.pathname.includes('signup.html')) {
            // Find referral code input
            const referralInput = document.querySelector('#referral');
            
            if (referralInput) {
                // Set referral code
                referralInput.value = referralCode;
                
                // Trigger blur event to validate
                const event = new Event('blur');
                referralInput.dispatchEvent(event);
            }
        } else {
            // Store referral code in session storage
            sessionStorage.setItem('referral_code', referralCode);
            
            // Show referral banner
            showReferralBanner(referralCode);
        }
    }
}

/**
 * Show referral banner
 * @param {string} referralCode - Referral code
 */
function showReferralBanner(referralCode) {
    // Create banner
    const banner = document.createElement('div');
    banner.className = 'referral-banner';
    banner.innerHTML = `
        <div class="referral-banner-content">
            <div class="referral-banner-text">
                <strong>You've been referred!</strong>
                <span>Sign up now to receive your welcome bonus.</span>
            </div>
            <div class="referral-banner-actions">
                <a href="signup.html?ref=${referralCode}" class="referral-banner-button">Sign Up Now</a>
                <button class="referral-banner-close">&times;</button>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .referral-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: var(--primary-color, #1e3a8a);
            color: white;
            padding: 15px;
            z-index: 999;
            transform: translateY(100%);
            transition: transform 0.3s;
        }
        
        .referral-banner.show {
            transform: translateY(0);
        }
        
        .referral-banner-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .referral-banner-text {
            display: flex;
            flex-direction: column;
        }
        
        .referral-banner-text strong {
            font-size: 1.1rem;
            margin-bottom: 5px;
        }
        
        .referral-banner-actions {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .referral-banner-button {
            background-color: white;
            color: var(--primary-color, #1e3a8a);
            padding: 8px 15px;
            border-radius: 4px;
            text-decoration: none;
            font-weight: bold;
            transition: background-color 0.2s;
        }
        
        .referral-banner-button:hover {
            background-color: #f8f9fa;
        }
        
        .referral-banner-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        
        @media (max-width: 768px) {
            .referral-banner-content {
                flex-direction: column;
                text-align: center;
            }
            
            .referral-banner-text {
                margin-bottom: 15px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(banner);
    
    // Show banner with animation
    setTimeout(() => {
        banner.classList.add('show');
    }, 1000);
    
    // Add event listener to close button
    const closeButton = banner.querySelector('.referral-banner-close');
    closeButton.addEventListener('click', function() {
        banner.classList.remove('show');
        setTimeout(() => {
            banner.remove();
        }, 300);
    });
}

/**
 * Generate referral code
 * @param {string} email - User email
 * @returns {string} Referral code
 */
function generateReferralCode(email) {
    // Generate a simple referral code based on email and random characters
    const emailPart = email.split('@')[0].substring(0, 4).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${emailPart}${randomPart}`;
}

/**
 * Get referral stats
 * @param {string} referralCode - Referral code
 * @returns {object} Referral stats
 */
function getReferralStats(referralCode) {
    // In a real implementation, this would fetch data from the server
    // For demo purposes, we'll generate random stats
    
    // Check if we have stats in session storage
    const storedStats = sessionStorage.getItem('referral_stats');
    
    if (storedStats) {
        return JSON.parse(storedStats);
    }
    
    // Generate random stats
    const pending = Math.floor(Math.random() * 3);
    const successful = Math.floor(Math.random() * 5);
    const earned = successful * 50;
    
    // Generate random history
    const history = [];
    
    if (successful + pending > 0) {
        const names = ['John D.', 'Sarah M.', 'Michael R.', 'Emily T.', 'David S.'];
        const statuses = ['Pending', 'Successful', 'Expired'];
        const rewards = ['$50 Cash Bonus', '0.25% Fee Discount', '$50 Cash Bonus'];
        
        for (let i = 0; i < successful + pending; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            
            const status = i < successful ? 'Successful' : 'Pending';
            
            history.push({
                date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                name: names[Math.floor(Math.random() * names.length)],
                status: status,
                reward: status === 'Successful' ? rewards[Math.floor(Math.random() * rewards.length)] : '-'
            });
        }
    }
    
    // Sort history by date (newest first)
    history.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const stats = {
        pending,
        successful,
        earned,
        history
    };
    
    // Store stats in session storage
    sessionStorage.setItem('referral_stats', JSON.stringify(stats));
    
    return stats;
}

/**
 * Check if referral code is valid
 * @param {string} code - Referral code
 * @returns {boolean} True if code is valid, false otherwise
 */
function isValidReferralCode(code) {
    // In a real implementation, this would validate the code against the server
    // For demo purposes, we'll accept codes that are 8 characters long
    return code.length === 8;
}

/**
 * Share referral link on specified platform
 * @param {string} platform - Platform to share on
 * @param {string} referralLink - Referral link
 */
function shareReferralLink(platform, referralLink) {
    // Get share message
    const message = 'Join BlueRock Asset Management and get a signup bonus! Use my referral link:';
    
    // Get share URL based on platform
    let shareUrl;
    
    switch (platform) {
        case 'email':
            shareUrl = `mailto:?subject=Join BlueRock Asset Management&body=${encodeURIComponent(`${message} ${referralLink}`)}`;
            window.location.href = shareUrl;
            break;
            
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
            openShareWindow(shareUrl);
            break;
            
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
            openShareWindow(shareUrl);
            break;
            
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
            openShareWindow(shareUrl);
            break;
            
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${message} ${referralLink}`)}`;
            openShareWindow(shareUrl);
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
    notification.textContent = 'Referral link copied to clipboard!';
    
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