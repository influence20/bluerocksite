/**
 * BlueRock Asset Management - Fixed Admin Authentication Module
 * This module handles admin authentication, session management, and security features
 */

// Admin authentication state
let adminAuthState = {
    isAuthenticated: false,
    adminUser: null,
    permissions: [],
    sessionExpiry: null
};

// Check if admin is already logged in (from session storage)
function checkAdminSession() {
    const adminSession = sessionStorage.getItem('adminSession');
    if (adminSession) {
        try {
            const sessionData = JSON.parse(adminSession);
            // Check if session is still valid
            if (sessionData.sessionExpiry && new Date(sessionData.sessionExpiry) > new Date()) {
                adminAuthState = {
                    isAuthenticated: true,
                    adminUser: sessionData.adminUser,
                    permissions: sessionData.permissions,
                    sessionExpiry: sessionData.sessionExpiry
                };
                return true;
            } else {
                // Session expired
                clearAdminSession();
            }
        } catch (e) {
            console.error("Error parsing admin session:", e);
            clearAdminSession();
        }
    }
    return false;
}

// Clear admin session
function clearAdminSession() {
    sessionStorage.removeItem('adminSession');
    adminAuthState = {
        isAuthenticated: false,
        adminUser: null,
        permissions: [],
        sessionExpiry: null
    };
}

// Admin login function
function adminLogin(username, password) {
    // In a real application, this would make an API call to verify credentials
    // For demo purposes, we'll use hardcoded credentials
    if (username === "admin" && password === "influence789") {
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 2); // 2 hour session
        
        const adminUser = {
            id: "ADM001",
            username: username,
            name: "Admin User",
            email: "admin@bluerock.com",
            role: "Administrator"
        };
        
        const permissions = [
            "manage_clients",
            "manage_investments",
            "manage_transactions",
            "manage_withdrawals",
            "view_reports",
            "system_settings"
        ];
        
        // Set authentication state
        adminAuthState = {
            isAuthenticated: true,
            adminUser: adminUser,
            permissions: permissions,
            sessionExpiry: expiryTime.toISOString()
        };
        
        // Save to session storage
        sessionStorage.setItem('adminSession', JSON.stringify(adminAuthState));
        
        return {
            success: true,
            message: "Login successful",
            adminUser: adminUser
        };
    } else {
        return {
            success: false,
            message: "Invalid username or password"
        };
    }
}

// Admin logout function
function adminLogout() {
    clearAdminSession();
    window.location.href = "login.html";
}

// Check if admin has specific permission
function hasAdminPermission(permission) {
    if (!adminAuthState.isAuthenticated) return false;
    return adminAuthState.permissions.includes(permission);
}

// Protect admin routes - redirect to login if not authenticated
function protectAdminRoute() {
    if (!checkAdminSession()) {
        // Save current URL to redirect back after login
        sessionStorage.setItem('adminRedirect', window.location.href);
        window.location.href = "login.html?admin=true";
        return false;
    }
    return true;
}

// Initialize admin dashboard
function initAdminDashboard() {
    if (!protectAdminRoute()) return;
    
    // Set admin user info in the UI
    const userNameElement = document.querySelector('.user-name');
    const userRoleElement = document.querySelector('.user-role');
    
    if (userNameElement && adminAuthState.adminUser) {
        userNameElement.textContent = adminAuthState.adminUser.name;
    }
    
    if (userRoleElement && adminAuthState.adminUser) {
        userRoleElement.textContent = adminAuthState.adminUser.role;
    }
    
    // Set up logout button
    document.querySelectorAll('a[href="login.html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            adminLogout();
        });
    });
    
    // Set up client management functionality
    setupClientManagement();
    
    // Set up transaction management
    setupTransactionManagement();
    
    // Set up withdrawal PIN management
    setupWithdrawalPINManagement();
    
    // Add admin dashboard specific styling
    document.body.classList.add('admin-dashboard');
    
    // Update dashboard header to clearly indicate admin mode
    const dashboardHeader = document.querySelector('.dashboard-header h1');
    if (dashboardHeader) {
        dashboardHeader.innerHTML = 'Admin Dashboard <span class="admin-badge">Administrator Mode</span>';
    }
}

// Client management functionality
function setupClientManagement() {
    // Client selection change handler
    const clientSelect = document.getElementById('client-select');
    if (clientSelect) {
        clientSelect.addEventListener('change', function() {
            const clientId = this.value;
            if (!clientId) return;
            
            // In a real app, this would fetch client data from an API
            // For demo purposes, we'll use hardcoded data
            const clientData = getClientData(clientId);
            
            if (clientData) {
                document.getElementById('current-balance').value = clientData.balance;
                
                // Update client details in the UI
                const clientNameElement = document.getElementById('client-name');
                const clientEmailElement = document.getElementById('client-email');
                const clientBalanceElement = document.getElementById('client-balance');
                
                if (clientNameElement) clientNameElement.textContent = clientData.name;
                if (clientEmailElement) clientEmailElement.textContent = clientData.email;
                if (clientBalanceElement) clientBalanceElement.textContent = '$' + clientData.balance.toFixed(2);
            }
        });
    }
    
    // Update balance form submission
    const updateBalanceForm = document.getElementById('update-balance-form');
    if (updateBalanceForm) {
        updateBalanceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const clientId = document.getElementById('client-select').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const transactionType = document.getElementById('transaction-type').value;
            const transactionDate = document.getElementById('transaction-date').value;
            const description = document.getElementById('transaction-description').value;
            const notes = document.getElementById('transaction-notes').value;
            
            if (!clientId || !amount || !transactionType || !transactionDate || !description) {
                showAdminNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Get client data
            const clientData = getClientData(clientId);
            if (!clientData) {
                showAdminNotification('Client not found', 'error');
                return;
            }
            
            // Update client balance based on transaction type
            let newBalance = clientData.balance;
            if (transactionType === 'deposit') {
                newBalance += amount;
            } else if (transactionType === 'withdrawal') {
                if (amount > clientData.balance) {
                    showAdminNotification('Insufficient funds for withdrawal', 'error');
                    return;
                }
                newBalance -= amount;
            } else if (transactionType === 'investment_return') {
                newBalance += amount;
            } else if (transactionType === 'fee') {
                if (amount > clientData.balance) {
                    showAdminNotification('Insufficient funds for fee', 'error');
                    return;
                }
                newBalance -= amount;
            }
            
            // Update client data
            clientData.balance = newBalance;
            updateClientData(clientId, clientData);
            
            // Update UI
            document.getElementById('current-balance').value = newBalance;
            const clientBalanceElement = document.getElementById('client-balance');
            if (clientBalanceElement) clientBalanceElement.textContent = '$' + newBalance.toFixed(2);
            
            showAdminNotification('Balance updated successfully', 'success');
            
            // Log the transaction
            logTransaction(clientId, transactionType, amount, description, transactionDate, notes);
            
            // Reset form
            updateBalanceForm.reset();
        });
    }
}

// Transaction management functionality
function setupTransactionManagement() {
    // This would handle transaction filtering, sorting, etc.
    // For demo purposes, we'll just set up the transaction log
    window.logTransaction = function(clientId, type, amount, description, date, notes) {
        // In a real app, this would make an API call to log the transaction
        // For demo purposes, we'll just log to console
        console.log('Transaction logged:', {
            clientId,
            type,
            amount,
            description,
            date,
            notes
        });
        
        // Add to transaction history (in a real app, this would be fetched from the server)
        const transactionId = 'TR-' + Math.floor(Math.random() * 10000).toString().padStart(5, '0');
        const clientData = getClientData(clientId);
        
        // Get the transaction table
        const transactionTable = document.querySelector('.admin-panel:nth-child(2) .admin-table tbody');
        if (transactionTable) {
            // Create new row
            const newRow = document.createElement('tr');
            
            // Format date
            const formattedDate = new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Set status based on transaction type
            let statusClass = 'active';
            if (type === 'withdrawal') statusClass = 'pending';
            else if (type === 'fee') statusClass = 'inactive';
            
            // Create row content
            newRow.innerHTML = `
                <td>${transactionId}</td>
                <td>${clientData ? clientData.name : 'Unknown Client'}</td>
                <td>${type.charAt(0).toUpperCase() + type.slice(1)}</td>
                <td>$${amount.toFixed(2)}</td>
                <td>${formattedDate}</td>
                <td><span class="status ${statusClass}">${type === 'withdrawal' ? 'Pending' : 'Completed'}</span></td>
            `;
            
            // Add to table
            transactionTable.prepend(newRow);
        }
    };
}

// Withdrawal PIN management functionality
function setupWithdrawalPINManagement() {
    // Generate withdrawal PIN
    window.generateWithdrawalPIN = function() {
        const clientSelect = document.getElementById('pin-client-select');
        const withdrawalAmount = document.getElementById('withdrawal-amount');
        const pinExpiry = document.getElementById('pin-expiry');
        
        if (!clientSelect.value) {
            showAdminNotification('Please select a client', 'error');
            return;
        }
        
        if (!withdrawalAmount.value || withdrawalAmount.value <= 0) {
            showAdminNotification('Please enter a valid withdrawal amount', 'error');
            return;
        }
        
        // Generate a random 6-digit PIN
        const pin = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Display the PIN
        document.getElementById('generated-pin').textContent = pin;
        document.getElementById('pin-expiry-time').textContent = pinExpiry.value;
        document.getElementById('pin-result').style.display = 'block';
        
        // In a real app, this would save the PIN to the database
        // For demo purposes, we'll add it to the table
        const clientData = getClientData(clientSelect.value);
        const pinTable = document.querySelector('#withdrawal-pins-tab .admin-table tbody');
        
        if (pinTable && clientData) {
            // Create new row
            const newRow = document.createElement('tr');
            
            // Get current date and expiry date
            const now = new Date();
            const expiryHours = parseInt(pinExpiry.value);
            const expiryDate = new Date(now);
            expiryDate.setHours(expiryDate.getHours() + expiryHours);
            
            // Format dates
            const formattedNow = now.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const formattedExpiry = expiryDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Create row content
            newRow.innerHTML = `
                <td>${pin}</td>
                <td>${clientData.name}</td>
                <td>$${parseFloat(withdrawalAmount.value).toFixed(2)}</td>
                <td>${formattedNow}</td>
                <td>${formattedExpiry}</td>
                <td><span class="status active">Active</span></td>
                <td class="actions">
                    <button class="action-btn" onclick="copyPINToClipboard('${pin}')"><i class="fas fa-copy"></i></button>
                    <button class="action-btn delete" onclick="invalidatePIN(this)"><i class="fas fa-times"></i></button>
                </td>
            `;
            
            // Add to table
            pinTable.prepend(newRow);
            
            showAdminNotification('Withdrawal PIN generated successfully', 'success');
            
            // Store PIN in client data
            if (!clientData.withdrawalPins) {
                clientData.withdrawalPins = [];
            }
            
            clientData.withdrawalPins.push({
                pin: pin,
                amount: parseFloat(withdrawalAmount.value),
                created: now.toISOString(),
                expires: expiryDate.toISOString(),
                status: 'active'
            });
            
            updateClientData(clientSelect.value, clientData);
        }
    };
    
    // Copy PIN to clipboard
    window.copyPIN = function() {
        const pin = document.getElementById('generated-pin').textContent;
        navigator.clipboard.writeText(pin).then(() => {
            showAdminNotification('PIN copied to clipboard', 'success');
        });
    };
    
    // Copy PIN to clipboard from table
    window.copyPINToClipboard = function(pin) {
        navigator.clipboard.writeText(pin).then(() => {
            showAdminNotification('PIN copied to clipboard', 'success');
        });
    };
    
    // Invalidate PIN
    window.invalidatePIN = function(button) {
        const row = button.closest('tr');
        const statusCell = row.querySelector('.status');
        statusCell.className = 'status inactive';
        statusCell.textContent = 'Invalidated';
        showAdminNotification('PIN invalidated successfully', 'success');
    };
}

// Helper function to get client data
function getClientData(clientId) {
    // In a real app, this would fetch client data from an API
    // For demo purposes, we'll use hardcoded data
    const clientsDataStr = localStorage.getItem('clientsData');
    let clientsData;
    
    if (clientsDataStr) {
        try {
            clientsData = JSON.parse(clientsDataStr);
        } catch (e) {
            console.error('Error parsing clients data:', e);
            clientsData = getDefaultClientsData();
        }
    } else {
        clientsData = getDefaultClientsData();
        localStorage.setItem('clientsData', JSON.stringify(clientsData));
    }
    
    return clientsData[clientId];
}

// Helper function to update client data
function updateClientData(clientId, clientData) {
    // In a real app, this would make an API call to update the client data
    // For demo purposes, we'll use localStorage
    const clientsDataStr = localStorage.getItem('clientsData');
    let clientsData;
    
    if (clientsDataStr) {
        try {
            clientsData = JSON.parse(clientsDataStr);
        } catch (e) {
            console.error('Error parsing clients data:', e);
            clientsData = getDefaultClientsData();
        }
    } else {
        clientsData = getDefaultClientsData();
    }
    
    clientsData[clientId] = clientData;
    localStorage.setItem('clientsData', JSON.stringify(clientsData));
}

// Helper function to get default clients data
function getDefaultClientsData() {
    return {
        'CL-001': { id: 'CL-001', name: 'John Doe', email: 'john@example.com', balance: 2500 },
        'CL-002': { id: 'CL-002', name: 'Jane Smith', email: 'jane@example.com', balance: 4200 },
        'CL-003': { id: 'CL-003', name: 'Robert Johnson', email: 'robert@example.com', balance: 1800 },
        'CL-004': { id: 'CL-004', name: 'Emily Wilson', email: 'emily@example.com', balance: 3600 },
        'CL-005': { id: 'CL-005', name: 'Michael Brown', email: 'michael@example.com', balance: 5100 }
    };
}

// Show admin notification
function showAdminNotification(message, type = 'info') {
    // Check if notification container exists
    let notificationContainer = document.querySelector('.admin-notifications');
    
    // If not, create it
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'admin-notifications';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the admin page
    if (window.location.pathname.includes('admin.html')) {
        initAdminDashboard();
    }
    
    // Check if we're on the login page with admin parameter
    if (window.location.pathname.includes('login.html') && window.location.search.includes('admin=true')) {
        // Add admin login mode
        document.querySelector('.login-container h1').textContent = 'Admin Login';
        document.querySelector('.login-form').setAttribute('data-mode', 'admin');
        
        // Change email field to username
        const emailField = document.getElementById('email');
        if (emailField) {
            const formGroup = emailField.closest('.form-group');
            const label = formGroup.querySelector('label');
            
            if (label) {
                label.textContent = 'Username';
                label.setAttribute('for', 'username');
            }
            
            emailField.id = 'username';
            emailField.name = 'username';
            emailField.placeholder = 'Enter your username';
            emailField.type = 'text';
            
            // Remove email validation
            emailField.pattern = '';
        }
    }
});