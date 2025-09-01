/**
 * BlueRock Asset Management - Withdrawal System
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
    // Check if user is logged in
    if (!checkLoginStatus()) {
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
            
            // Show PIN verification form
            document.getElementById('withdrawal-step-1').style.display = 'none';
            document.getElementById('withdrawal-step-2').style.display = 'block';
            
            // Update UI
            document.getElementById('withdrawal-amount-display').textContent = `$${amount.toFixed(2)}`;
            document.getElementById('withdrawal-currency-display').textContent = currency;
            document.getElementById('withdrawal-wallet-display').textContent = walletAddress;
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
    
    // Load withdrawal history
    loadWithdrawalHistory();
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
            
            // Update withdrawal request
            if (withdrawalState.pendingWithdrawal) {
                withdrawalState.pendingWithdrawal.status = 'processing';
                withdrawalState.pendingWithdrawal.pinVerified = true;
                
                // Add to history
                withdrawalState.withdrawalHistory.push(withdrawalState.pendingWithdrawal);
                
                // Save to local storage
                saveWithdrawalHistory();
            }
            
            // Show success message
            document.getElementById('withdrawal-step-2').style.display = 'none';
            document.getElementById('withdrawal-step-3').style.display = 'block';
            
            // Update UI
            document.getElementById('withdrawal-id-display').textContent = withdrawalState.pendingWithdrawal.id;
            
            showNotification('PIN verified successfully. Your withdrawal request is being processed.', 'success');
        } else {
            showNotification('Invalid PIN. Please try again or contact support.', 'error');
        }
    }, 1500);
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
    
    // Reset state
    withdrawalState.pendingWithdrawal = null;
    withdrawalState.pinVerified = false;
}

// New withdrawal button handler
function newWithdrawal() {
    resetWithdrawalForm();
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the withdrawal page
    if (window.location.pathname.includes('withdrawal.html')) {
        initWithdrawalSystem();
    }
});