/**
 * BlueRock Asset Management - Fixed Withdrawal System
 * This module handles client withdrawal requests and PIN verification
 */

// Withdrawal state
let withdrawalState = {
    pendingWithdrawal: null,
    pinVerified: false,
    withdrawalHistory: []
};

// Initialize withdrawal system
function initWithdrawalSystem() {
    console.log('Initializing withdrawal system');
    
    // Check if user is logged in
    if (!checkLoginStatus()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Set up withdrawal form
    const withdrawalForm = document.getElementById('withdrawal-form');
    if (withdrawalForm) {
        withdrawalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const amount = parseFloat(document.getElementById('withdrawal-amount').value);
            const walletAddress = document.getElementById('wallet-address').value;
            const currency = document.getElementById('withdrawal-currency').value;
            
            if (!amount || amount <= 0) {
                showNotification('Please enter a valid withdrawal amount', 'error');
                return;
            }
            
            if (!walletAddress) {
                showNotification('Please enter your wallet address', 'error');
                return;
            }
            
            // Create withdrawal request
            const withdrawalRequest = {
                id: 'WD-' + Math.floor(Math.random() * 10000).toString().padStart(5, '0'),
                amount: amount,
                currency: currency,
                walletAddress: walletAddress,
                status: 'pending',
                date: new Date().toISOString(),
                pinRequired: true
            };
            
            // Store withdrawal request
            withdrawalState.pendingWithdrawal = withdrawalRequest;
            
            // Save to session storage to persist between page navigations
            sessionStorage.setItem('pendingWithdrawal', JSON.stringify(withdrawalRequest));
            
            // Show PIN verification form
            document.getElementById('withdrawal-step-1').style.display = 'none';
            document.getElementById('withdrawal-step-2').style.display = 'block';
            
            // Update progress indicator
            updateProgressIndicator(2);
            
            // Update UI
            document.getElementById('withdrawal-amount-display').textContent = `$${amount.toFixed(2)}`;
            document.getElementById('withdrawal-currency-display').textContent = currency;
            document.getElementById('withdrawal-wallet-display').textContent = walletAddress;
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
    }
    
    // Set up PIN verification form
    const pinForm = document.getElementById('pin-verification-form');
    if (pinForm) {
        pinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pin = document.getElementById('withdrawal-pin').value;
            
            if (!pin || pin.length !== 6) {
                showNotification('Please enter a valid 6-digit PIN', 'error');
                return;
            }
            
            // In a real app, this would verify the PIN with the server
            // For demo purposes, we'll simulate PIN verification
            verifyWithdrawalPIN(pin);
        });
    }
    
    // Check if there's a pending withdrawal in session storage
    const pendingWithdrawalStr = sessionStorage.getItem('pendingWithdrawal');
    if (pendingWithdrawalStr) {
        try {
            const pendingWithdrawal = JSON.parse(pendingWithdrawalStr);
            withdrawalState.pendingWithdrawal = pendingWithdrawal;
            
            // Check if PIN is verified
            const pinVerified = sessionStorage.getItem('pinVerified') === 'true';
            withdrawalState.pinVerified = pinVerified;
            
            // If PIN is verified, show confirmation page
            if (pinVerified) {
                document.getElementById('withdrawal-step-1').style.display = 'none';
                document.getElementById('withdrawal-step-2').style.display = 'none';
                document.getElementById('withdrawal-step-3').style.display = 'block';
                
                // Update progress indicator
                updateProgressIndicator(3);
                
                // Update UI
                document.getElementById('withdrawal-id-display').textContent = pendingWithdrawal.id;
                document.getElementById('withdrawal-amount-display-confirm').textContent = `$${pendingWithdrawal.amount.toFixed(2)}`;
                document.getElementById('withdrawal-currency-display-confirm').textContent = pendingWithdrawal.currency;
                document.getElementById('withdrawal-wallet-display-confirm').textContent = pendingWithdrawal.walletAddress;
            }
            // If PIN is not verified but withdrawal is pending, show PIN verification form
            else if (pendingWithdrawal.status === 'pending') {
                document.getElementById('withdrawal-step-1').style.display = 'none';
                document.getElementById('withdrawal-step-2').style.display = 'block';
                
                // Update progress indicator
                updateProgressIndicator(2);
                
                // Update UI
                document.getElementById('withdrawal-amount-display').textContent = `$${pendingWithdrawal.amount.toFixed(2)}`;
                document.getElementById('withdrawal-currency-display').textContent = pendingWithdrawal.currency;
                document.getElementById('withdrawal-wallet-display').textContent = pendingWithdrawal.walletAddress;
            }
        } catch (e) {
            console.error('Error parsing pending withdrawal:', e);
            sessionStorage.removeItem('pendingWithdrawal');
            sessionStorage.removeItem('pinVerified');
        }
    }
    
    // Load withdrawal history
    loadWithdrawalHistory();
    
    // Set up "New Withdrawal" button
    const newWithdrawalBtn = document.getElementById('new-withdrawal-btn');
    if (newWithdrawalBtn) {
        newWithdrawalBtn.addEventListener('click', function() {
            newWithdrawal();
        });
    }
    
    // Update progress indicator initially
    if (document.getElementById('withdrawal-step-1').style.display !== 'none') {
        updateProgressIndicator(1);
    }
}

// Update progress indicator
function updateProgressIndicator(step) {
    const steps = document.querySelectorAll('.withdrawal-steps .step');
    
    steps.forEach((stepEl, index) => {
        if (index + 1 < step) {
            stepEl.classList.add('completed');
            stepEl.classList.remove('active');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
            stepEl.classList.remove('completed');
        } else {
            stepEl.classList.remove('active');
            stepEl.classList.remove('completed');
        }
    });
}

// Verify withdrawal PIN
function verifyWithdrawalPIN(pin) {
    // In a real app, this would make an API call to verify the PIN
    // For demo purposes, we'll simulate PIN verification
    
    // Simulate API call with timeout
    showNotification('Verifying PIN...', 'info');
    
    setTimeout(() => {
        // For demo purposes, any PIN that starts with '1' is valid
        const isValid = pin.startsWith('1');
        
        if (isValid) {
            withdrawalState.pinVerified = true;
            
            // Save PIN verification status to session storage
            sessionStorage.setItem('pinVerified', 'true');
            
            // Update withdrawal request
            if (withdrawalState.pendingWithdrawal) {
                withdrawalState.pendingWithdrawal.status = 'processing';
                withdrawalState.pendingWithdrawal.pinVerified = true;
                
                // Update in session storage
                sessionStorage.setItem('pendingWithdrawal', JSON.stringify(withdrawalState.pendingWithdrawal));
                
                // Add to history
                withdrawalState.withdrawalHistory.push(withdrawalState.pendingWithdrawal);
                
                // Save to local storage
                saveWithdrawalHistory();
            }
            
            // Show success message
            document.getElementById('withdrawal-step-2').style.display = 'none';
            document.getElementById('withdrawal-step-3').style.display = 'block';
            
            // Update progress indicator
            updateProgressIndicator(3);
            
            // Update UI
            document.getElementById('withdrawal-id-display').textContent = withdrawalState.pendingWithdrawal.id;
            document.getElementById('withdrawal-amount-display-confirm').textContent = `$${withdrawalState.pendingWithdrawal.amount.toFixed(2)}`;
            document.getElementById('withdrawal-currency-display-confirm').textContent = withdrawalState.pendingWithdrawal.currency;
            document.getElementById('withdrawal-wallet-display-confirm').textContent = withdrawalState.pendingWithdrawal.walletAddress;
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            showNotification('PIN verified successfully. Your withdrawal request is being processed.', 'success');
        } else {
            showNotification('Invalid PIN. Please try again or contact support.', 'error');
        }
    }, 1500);
}

// Check login status
function checkLoginStatus() {
    const userData = sessionStorage.getItem('userData');
    return !!userData;
}

// Load withdrawal history from local storage
function loadWithdrawalHistory() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) return;
    
    const savedHistory = localStorage.getItem(`withdrawal_history_${userData.email}`);
    if (savedHistory) {
        try {
            withdrawalState.withdrawalHistory = JSON.parse(savedHistory);
            updateWithdrawalHistoryUI();
        } catch (e) {
            console.error('Error loading withdrawal history:', e);
        }
    }
}

// Save withdrawal history to local storage
function saveWithdrawalHistory() {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (!userData) return;
    
    localStorage.setItem(
        `withdrawal_history_${userData.email}`,
        JSON.stringify(withdrawalState.withdrawalHistory)
    );
    
    updateWithdrawalHistoryUI();
}

// Update withdrawal history UI
function updateWithdrawalHistoryUI() {
    const historyContainer = document.getElementById('withdrawal-history');
    if (!historyContainer) return;
    
    // Clear container
    historyContainer.innerHTML = '';
    
    if (withdrawalState.withdrawalHistory.length === 0) {
        historyContainer.innerHTML = '<p class="no-history">No withdrawal history found.</p>';
        return;
    }
    
    // Create table
    const table = document.createElement('table');
    table.className = 'withdrawal-history-table';
    
    // Create header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    
    // Sort by date (newest first)
    const sortedHistory = [...withdrawalState.withdrawalHistory].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    sortedHistory.forEach(withdrawal => {
        const tr = document.createElement('tr');
        
        // Format date
        const date = new Date(withdrawal.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Set status class
        let statusClass = '';
        switch (withdrawal.status) {
            case 'pending':
                statusClass = 'status-pending';
                break;
            case 'processing':
                statusClass = 'status-processing';
                break;
            case 'completed':
                statusClass = 'status-completed';
                break;
            case 'rejected':
                statusClass = 'status-rejected';
                break;
        }
        
        tr.innerHTML = `
            <td>${withdrawal.id}</td>
            <td>${formattedDate}</td>
            <td>$${withdrawal.amount.toFixed(2)}</td>
            <td>${withdrawal.currency}</td>
            <td><span class="status ${statusClass}">${withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}</span></td>
        `;
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    historyContainer.appendChild(table);
}

// Reset withdrawal form
function resetWithdrawalForm() {
    const withdrawalForm = document.getElementById('withdrawal-form');
    if (withdrawalForm) {
        withdrawalForm.reset();
    }
    
    const pinForm = document.getElementById('pin-verification-form');
    if (pinForm) {
        pinForm.reset();
    }
    
    // Reset UI
    document.getElementById('withdrawal-step-1').style.display = 'block';
    document.getElementById('withdrawal-step-2').style.display = 'none';
    document.getElementById('withdrawal-step-3').style.display = 'none';
    
    // Update progress indicator
    updateProgressIndicator(1);
    
    // Reset state
    withdrawalState.pendingWithdrawal = null;
    withdrawalState.pinVerified = false;
    
    // Clear session storage
    sessionStorage.removeItem('pendingWithdrawal');
    sessionStorage.removeItem('pinVerified');
}

// New withdrawal button handler
function newWithdrawal() {
    resetWithdrawalForm();
}

// Show notification
function showNotification(message, type = 'info') {
    // Check if notification container exists
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Style notification
    notification.style.backgroundColor = type === 'success' ? '#28a745' : 
                                        type === 'error' ? '#dc3545' : 
                                        type === 'warning' ? '#ffc107' : '#17a2b8';
    notification.style.color = 'white';
    notification.style.padding = '15px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    notification.style.width = '300px';
    notification.style.maxWidth = '100%';
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
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
    
    closeBtn.addEventListener('click', function() {
        hideNotification(notification);
    });
    
    // Auto hide notification after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

function hideNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the withdrawal page
    if (window.location.pathname.includes('withdrawal.html')) {
        initWithdrawalSystem();
    }
});