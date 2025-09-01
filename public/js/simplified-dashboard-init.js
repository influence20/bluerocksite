/**
 * BlueRock Asset Management - Simplified Dashboard Initialization
 * This script handles the initialization of both client and admin dashboards
 * without two-factor authentication
 */

// Dashboard state
let dashboardState = {
    isAdmin: false,
    userData: null,
    clientData: null,
    investmentData: null,
    savingsData: null,
    transactionHistory: []
};

// Initialize dashboard
function initDashboard() {
    console.log('Initializing dashboard');
    
    // Check if we're on a dashboard page
    const isDashboardPage = window.location.pathname.includes('dashboard.html');
    const isAdminPage = window.location.pathname.includes('admin.html');
    
    if (!isDashboardPage && !isAdminPage) {
        return; // Not on a dashboard page
    }
    
    // Check if user is logged in
    if (isAdminPage) {
        // Check admin session
        if (!checkAdminSession()) {
            window.location.href = 'login.html?admin=true';
            return;
        }
        
        // Initialize admin dashboard
        initAdminDashboard();
    } else {
        // Check client session
        if (!checkClientSession()) {
            window.location.href = 'login.html';
            return;
        }
        
        // Initialize client dashboard
        initClientDashboard();
    }
}

// Check admin session
function checkAdminSession() {
    const adminSessionStr = sessionStorage.getItem('adminSession');
    if (!adminSessionStr) {
        return false;
    }
    
    try {
        const adminSession = JSON.parse(adminSessionStr);
        
        // Check if session is still valid
        if (adminSession.sessionExpiry && new Date(adminSession.sessionExpiry) > new Date()) {
            dashboardState.isAdmin = true;
            return true;
        }
    } catch (e) {
        console.error('Error parsing admin session:', e);
    }
    
    return false;
}

// Check client session
function checkClientSession() {
    const userDataStr = sessionStorage.getItem('userData');
    if (!userDataStr) {
        return false;
    }
    
    try {
        const userData = JSON.parse(userDataStr);
        dashboardState.userData = userData;
        return true;
    } catch (e) {
        console.error('Error parsing user data:', e);
    }
    
    return false;
}

// Initialize admin dashboard
function initAdminDashboard() {
    console.log('Initializing admin dashboard');
    
    // Get admin session data
    const adminSessionStr = sessionStorage.getItem('adminSession');
    if (!adminSessionStr) {
        return;
    }
    
    try {
        const adminSession = JSON.parse(adminSessionStr);
        
        // Set admin user info in the UI
        const userNameElement = document.querySelector('.user-name');
        const userRoleElement = document.querySelector('.user-role');
        
        if (userNameElement && adminSession.adminUser) {
            userNameElement.textContent = adminSession.adminUser.name;
        }
        
        if (userRoleElement && adminSession.adminUser) {
            userRoleElement.textContent = adminSession.adminUser.role;
        }
        
        // Add admin dashboard specific styling
        document.body.classList.add('admin-dashboard');
        
        // Update dashboard header to clearly indicate admin mode
        const dashboardHeader = document.querySelector('.dashboard-header h1');
        if (dashboardHeader) {
            dashboardHeader.innerHTML = 'Admin Dashboard <span class="admin-badge">Administrator Mode</span>';
        }
        
        // Set up logout button
        document.querySelectorAll('a[href="login.html"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                sessionStorage.removeItem('adminSession');
                window.location.href = 'login.html';
            });
        });
        
        // Load admin dashboard data
        loadAdminDashboardData();
    } catch (e) {
        console.error('Error initializing admin dashboard:', e);
    }
}

// Initialize client dashboard
function initClientDashboard() {
    console.log('Initializing client dashboard');
    
    // Get user data from session storage
    const userDataStr = sessionStorage.getItem('userData');
    if (!userDataStr) {
        return;
    }
    
    try {
        dashboardState.userData = JSON.parse(userDataStr);
        
        // Set user name in the UI
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            element.textContent = dashboardState.userData.name;
        });
        
        // Set up logout button
        document.querySelectorAll('a[href="login.html"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                sessionStorage.removeItem('userData');
                window.location.href = 'login.html';
            });
        });
        
        // Load client dashboard data
        loadClientDashboardData();
    } catch (e) {
        console.error('Error initializing client dashboard:', e);
    }
}

// Load admin dashboard data
function loadAdminDashboardData() {
    // In a real app, this would fetch data from an API
    // For demo purposes, we'll use hardcoded data
    
    // Load client list
    loadClientList();
    
    // Load transaction history
    loadAdminTransactionHistory();
    
    // Initialize dashboard tabs
    initDashboardTabs();
    
    // Initialize charts
    initAdminDashboardCharts();
}

// Load client dashboard data
function loadClientDashboardData() {
    // In a real app, this would fetch data from an API
    // For demo purposes, we'll use hardcoded data or localStorage
    
    // Load client data
    loadClientData();
    
    // Initialize dashboard tabs
    initDashboardTabs();
    
    // Initialize charts
    initClientDashboardCharts();
    
    // Load transaction history
    loadClientTransactionHistory();
}

// Load client list for admin dashboard
function loadClientList() {
    // In a real app, this would fetch client list from an API
    // For demo purposes, we'll use hardcoded data
    const clientsData = {
        'CL-001': { id: 'CL-001', name: 'John Doe', email: 'john@example.com', balance: 2500 },
        'CL-002': { id: 'CL-002', name: 'Jane Smith', email: 'jane@example.com', balance: 4200 },
        'CL-003': { id: 'CL-003', name: 'Robert Johnson', email: 'robert@example.com', balance: 1800 },
        'CL-004': { id: 'CL-004', name: 'Emily Wilson', email: 'emily@example.com', balance: 3600 },
        'CL-005': { id: 'CL-005', name: 'Michael Brown', email: 'michael@example.com', balance: 5100 }
    };
    
    // Update client select dropdown
    const clientSelect = document.getElementById('client-select');
    const pinClientSelect = document.getElementById('pin-client-select');
    
    if (clientSelect) {
        // Clear existing options
        clientSelect.innerHTML = '<option value="">Select Client</option>';
        
        // Add client options
        Object.values(clientsData).forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.name} (${client.email})`;
            clientSelect.appendChild(option);
        });
    }
    
    if (pinClientSelect) {
        // Clear existing options
        pinClientSelect.innerHTML = '<option value="">Select Client</option>';
        
        // Add client options
        Object.values(clientsData).forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.name} (${client.email})`;
            pinClientSelect.appendChild(option);
        });
    }
}

// Load client data for client dashboard
function loadClientData() {
    // In a real app, this would fetch client data from an API
    // For demo purposes, we'll use hardcoded data
    
    // Create default client data
    const clientData = {
        accountNumber: 'AC-' + Math.floor(10000000 + Math.random() * 90000000),
        balance: 5000,
        investedAmount: 3000,
        savingsAmount: 2000,
        totalReturns: 450,
        returnRate: 15,
        nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        accountStatus: 'active',
        kycStatus: 'verified',
        joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        investmentPlans: [
            {
                id: 'INV-001',
                name: 'Growth Portfolio',
                amount: 2000,
                returnRate: 18,
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active',
                returns: 300
            },
            {
                id: 'INV-002',
                name: 'Income Fund',
                amount: 1000,
                returnRate: 12,
                startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active',
                returns: 150
            }
        ],
        savingsPlans: [
            {
                id: 'SAV-001',
                name: 'Emergency Fund',
                amount: 1500,
                interestRate: 5,
                startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active'
            },
            {
                id: 'SAV-002',
                name: 'Vacation Fund',
                amount: 500,
                interestRate: 3,
                startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active'
            }
        ]
    };
    
    dashboardState.clientData = clientData;
    
    // Update UI with client data
    updateClientDataUI();
}

// Update client data UI
function updateClientDataUI() {
    if (!dashboardState.clientData) return;
    
    // Update account overview
    const balanceElement = document.getElementById('account-balance');
    const investedElement = document.getElementById('invested-amount');
    const savingsElement = document.getElementById('savings-amount');
    const returnsElement = document.getElementById('total-returns');
    const returnRateElement = document.getElementById('return-rate');
    const nextPayoutElement = document.getElementById('next-payout-date');
    
    if (balanceElement) balanceElement.textContent = `$${dashboardState.clientData.balance.toFixed(2)}`;
    if (investedElement) investedElement.textContent = `$${dashboardState.clientData.investedAmount.toFixed(2)}`;
    if (savingsElement) savingsElement.textContent = `$${dashboardState.clientData.savingsAmount.toFixed(2)}`;
    if (returnsElement) returnsElement.textContent = `$${dashboardState.clientData.totalReturns.toFixed(2)}`;
    if (returnRateElement) returnRateElement.textContent = `${dashboardState.clientData.returnRate}%`;
    
    if (nextPayoutElement && dashboardState.clientData.nextPayoutDate) {
        const nextPayoutDate = new Date(dashboardState.clientData.nextPayoutDate);
        nextPayoutElement.textContent = nextPayoutDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    // Update investment plans
    updateInvestmentPlansUI();
    
    // Update savings plans
    updateSavingsPlansUI();
}

// Update investment plans UI
function updateInvestmentPlansUI() {
    const investmentPlansContainer = document.getElementById('investment-plans');
    if (!investmentPlansContainer || !dashboardState.clientData.investmentPlans) return;
    
    // Clear container
    investmentPlansContainer.innerHTML = '';
    
    if (dashboardState.clientData.investmentPlans.length === 0) {
        investmentPlansContainer.innerHTML = '<p class="no-data">No investment plans found.</p>';
        return;
    }
    
    // Create table
    const table = document.createElement('table');
    table.className = 'dashboard-table';
    
    // Create header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Plan</th>
            <th>Amount</th>
            <th>Return Rate</th>
            <th>Returns</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    
    dashboardState.clientData.investmentPlans.forEach(plan => {
        const tr = document.createElement('tr');
        
        // Format dates
        const startDate = new Date(plan.startDate);
        const endDate = new Date(plan.endDate);
        
        const formattedStartDate = startDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const formattedEndDate = endDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Set status class
        let statusClass = '';
        switch (plan.status) {
            case 'active':
                statusClass = 'status-active';
                break;
            case 'pending':
                statusClass = 'status-pending';
                break;
            case 'completed':
                statusClass = 'status-completed';
                break;
            case 'cancelled':
                statusClass = 'status-cancelled';
                break;
        }
        
        tr.innerHTML = `
            <td>${plan.name}</td>
            <td>$${plan.amount.toFixed(2)}</td>
            <td>${plan.returnRate}%</td>
            <td>$${plan.returns.toFixed(2)}</td>
            <td>${formattedStartDate}</td>
            <td>${formattedEndDate}</td>
            <td><span class="status ${statusClass}">${plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}</span></td>
        `;
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    investmentPlansContainer.appendChild(table);
}

// Update savings plans UI
function updateSavingsPlansUI() {
    const savingsPlansContainer = document.getElementById('savings-plans');
    if (!savingsPlansContainer || !dashboardState.clientData.savingsPlans) return;
    
    // Clear container
    savingsPlansContainer.innerHTML = '';
    
    if (dashboardState.clientData.savingsPlans.length === 0) {
        savingsPlansContainer.innerHTML = '<p class="no-data">No savings plans found.</p>';
        return;
    }
    
    // Create table
    const table = document.createElement('table');
    table.className = 'dashboard-table';
    
    // Create header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Plan</th>
            <th>Amount</th>
            <th>Interest Rate</th>
            <th>Start Date</th>
            <th>Status</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    
    dashboardState.clientData.savingsPlans.forEach(plan => {
        const tr = document.createElement('tr');
        
        // Format date
        const startDate = new Date(plan.startDate);
        
        const formattedStartDate = startDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Set status class
        let statusClass = '';
        switch (plan.status) {
            case 'active':
                statusClass = 'status-active';
                break;
            case 'pending':
                statusClass = 'status-pending';
                break;
            case 'completed':
                statusClass = 'status-completed';
                break;
            case 'cancelled':
                statusClass = 'status-cancelled';
                break;
        }
        
        tr.innerHTML = `
            <td>${plan.name}</td>
            <td>$${plan.amount.toFixed(2)}</td>
            <td>${plan.interestRate}%</td>
            <td>${formattedStartDate}</td>
            <td><span class="status ${statusClass}">${plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}</span></td>
        `;
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    savingsPlansContainer.appendChild(table);
}

// Load client transaction history
function loadClientTransactionHistory() {
    // In a real app, this would fetch transaction history from an API
    // For demo purposes, we'll use hardcoded data
    
    const now = new Date();
    
    const transactionHistory = [
        {
            id: 'TR-00123',
            type: 'deposit',
            amount: 1000,
            date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'Initial deposit'
        },
        {
            id: 'TR-00124',
            type: 'investment',
            amount: 800,
            date: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'Growth Portfolio investment'
        },
        {
            id: 'TR-00125',
            type: 'return',
            amount: 120,
            date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'Investment return'
        },
        {
            id: 'TR-00126',
            type: 'deposit',
            amount: 500,
            date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'Additional deposit'
        },
        {
            id: 'TR-00127',
            type: 'withdrawal',
            amount: 200,
            date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'Withdrawal to bank account'
        }
    ];
    
    dashboardState.transactionHistory = transactionHistory;
    
    // Update UI with transaction history
    updateClientTransactionHistoryUI();
}

// Update client transaction history UI
function updateClientTransactionHistoryUI() {
    const transactionHistoryContainer = document.getElementById('transaction-history');
    if (!transactionHistoryContainer || !dashboardState.transactionHistory) return;
    
    // Clear container
    transactionHistoryContainer.innerHTML = '';
    
    if (dashboardState.transactionHistory.length === 0) {
        transactionHistoryContainer.innerHTML = '<p class="no-data">No transaction history found.</p>';
        return;
    }
    
    // Create table
    const table = document.createElement('table');
    table.className = 'dashboard-table';
    
    // Create header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Status</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    
    // Sort by date (newest first)
    const sortedHistory = [...dashboardState.transactionHistory].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    sortedHistory.forEach(transaction => {
        const tr = document.createElement('tr');
        
        // Format date
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Set type class
        let typeClass = '';
        let amountPrefix = '';
        
        switch (transaction.type) {
            case 'deposit':
                typeClass = 'type-deposit';
                amountPrefix = '+';
                break;
            case 'withdrawal':
                typeClass = 'type-withdrawal';
                amountPrefix = '-';
                break;
            case 'investment':
                typeClass = 'type-investment';
                amountPrefix = '-';
                break;
            case 'return':
                typeClass = 'type-return';
                amountPrefix = '+';
                break;
            case 'fee':
                typeClass = 'type-fee';
                amountPrefix = '-';
                break;
        }
        
        // Set status class
        let statusClass = '';
        switch (transaction.status) {
            case 'completed':
                statusClass = 'status-completed';
                break;
            case 'pending':
                statusClass = 'status-pending';
                break;
            case 'failed':
                statusClass = 'status-failed';
                break;
        }
        
        tr.innerHTML = `
            <td>${transaction.id}</td>
            <td>${formattedDate}</td>
            <td><span class="transaction-type ${typeClass}">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span></td>
            <td class="${typeClass}">${amountPrefix}$${transaction.amount.toFixed(2)}</td>
            <td>${transaction.description}</td>
            <td><span class="status ${statusClass}">${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span></td>
        `;
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    transactionHistoryContainer.appendChild(table);
}

// Load admin transaction history
function loadAdminTransactionHistory() {
    // In a real app, this would fetch transaction history from an API
    // For demo purposes, we'll use hardcoded data
    
    const now = new Date();
    
    const transactionHistory = [
        {
            id: 'TR-00123',
            clientId: 'CL-001',
            clientName: 'John Doe',
            type: 'deposit',
            amount: 1000,
            date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'Initial deposit'
        },
        {
            id: 'TR-00124',
            clientId: 'CL-001',
            clientName: 'John Doe',
            type: 'investment',
            amount: 800,
            date: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'Growth Portfolio investment'
        },
        {
            id: 'TR-00125',
            clientId: 'CL-002',
            clientName: 'Jane Smith',
            type: 'deposit',
            amount: 2000,
            date: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'Initial deposit'
        },
        {
            id: 'TR-00126',
            clientId: 'CL-001',
            clientName: 'John Doe',
            type: 'return',
            amount: 120,
            date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'Investment return'
        },
        {
            id: 'TR-00127',
            clientId: 'CL-002',
            clientName: 'Jane Smith',
            type: 'investment',
            amount: 1500,
            date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'Income Fund investment'
        },
        {
            id: 'TR-00128',
            clientId: 'CL-001',
            clientName: 'John Doe',
            type: 'deposit',
            amount: 500,
            date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'Additional deposit'
        },
        {
            id: 'TR-00129',
            clientId: 'CL-003',
            clientName: 'Robert Johnson',
            type: 'deposit',
            amount: 1800,
            date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'Initial deposit'
        },
        {
            id: 'TR-00130',
            clientId: 'CL-001',
            clientName: 'John Doe',
            type: 'withdrawal',
            amount: 200,
            date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            description: 'Withdrawal to bank account'
        }
    ];
    
    dashboardState.adminTransactionHistory = transactionHistory;
    
    // Update UI with transaction history
    updateAdminTransactionHistoryUI();
}

// Update admin transaction history UI
function updateAdminTransactionHistoryUI() {
    const transactionTable = document.querySelector('.admin-panel:nth-child(2) .admin-table tbody');
    if (!transactionTable || !dashboardState.adminTransactionHistory) return;
    
    // Clear table
    transactionTable.innerHTML = '';
    
    // Sort by date (newest first)
    const sortedHistory = [...dashboardState.adminTransactionHistory].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    sortedHistory.forEach(transaction => {
        // Create new row
        const newRow = document.createElement('tr');
        
        // Format date
        const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Set status based on transaction type
        let statusClass = 'active';
        if (transaction.type === 'withdrawal') statusClass = 'pending';
        else if (transaction.type === 'fee') statusClass = 'inactive';
        
        // Create row content
        newRow.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.clientName}</td>
            <td>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
            <td>$${transaction.amount.toFixed(2)}</td>
            <td>${formattedDate}</td>
            <td><span class="status ${statusClass}">${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span></td>
        `;
        
        // Add to table
        transactionTable.appendChild(newRow);
    });
}

// Initialize dashboard tabs
function initDashboardTabs() {
    const tabButtons = document.querySelectorAll('.dashboard-tabs .tab-button');
    const tabContents = document.querySelectorAll('.dashboard-tab-content');
    
    if (tabButtons.length === 0 || tabContents.length === 0) return;
    
    // Add click event to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.style.display = 'none');
            
            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).style.display = 'block';
        });
    });
    
    // Set first tab as active by default
    tabButtons[0].click();
}

// Initialize client dashboard charts
function initClientDashboardCharts() {
    // Portfolio allocation chart
    const portfolioChartCanvas = document.getElementById('portfolio-chart');
    if (portfolioChartCanvas && window.Chart) {
        const portfolioData = {
            labels: ['Stocks', 'Bonds', 'Real Estate', 'Commodities', 'Cash'],
            datasets: [{
                data: [40, 25, 15, 10, 10],
                backgroundColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800',
                    '#9C27B0',
                    '#607D8B'
                ],
                borderWidth: 0
            }]
        };
        
        new Chart(portfolioChartCanvas, {
            type: 'doughnut',
            data: portfolioData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }
    
    // Performance chart
    const performanceChartCanvas = document.getElementById('performance-chart');
    if (performanceChartCanvas && window.Chart) {
        // Generate last 6 months of data
        const labels = [];
        const portfolioData = [];
        const benchmarkData = [];
        
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const month = new Date(now);
            month.setMonth(now.getMonth() - i);
            
            labels.push(month.toLocaleDateString('en-US', { month: 'short' }));
            
            // Generate some random data
            const portfolioValue = 100 + Math.floor(Math.random() * 30);
            const benchmarkValue = 100 + Math.floor(Math.random() * 20);
            
            portfolioData.push(portfolioValue);
            benchmarkData.push(benchmarkValue);
        }
        
        new Chart(performanceChartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Your Portfolio',
                        data: portfolioData,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Benchmark',
                        data: benchmarkData,
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Initialize admin dashboard charts
function initAdminDashboardCharts() {
    // Client growth chart
    const clientGrowthCanvas = document.getElementById('client-growth-chart');
    if (clientGrowthCanvas && window.Chart) {
        // Generate last 12 months of data
        const labels = [];
        const clientData = [];
        
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const month = new Date(now);
            month.setMonth(now.getMonth() - i);
            
            labels.push(month.toLocaleDateString('en-US', { month: 'short' }));
            
            // Generate some random data with an upward trend
            const baseValue = 50 + (11 - i) * 5;
            const randomVariation = Math.floor(Math.random() * 10) - 5;
            clientData.push(baseValue + randomVariation);
        }
        
        new Chart(clientGrowthCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'New Clients',
                        data: clientData,
                        borderColor: '#4e73df',
                        backgroundColor: 'rgba(78, 115, 223, 0.05)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Revenue chart
    const revenueChartCanvas = document.getElementById('revenue-chart');
    if (revenueChartCanvas && window.Chart) {
        // Generate last 12 months of data
        const labels = [];
        const revenueData = [];
        
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const month = new Date(now);
            month.setMonth(now.getMonth() - i);
            
            labels.push(month.toLocaleDateString('en-US', { month: 'short' }));
            
            // Generate some random data with an upward trend
            const baseValue = 10000 + (11 - i) * 1000;
            const randomVariation = Math.floor(Math.random() * 2000) - 1000;
            revenueData.push(baseValue + randomVariation);
        }
        
        new Chart(revenueChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Revenue',
                        data: revenueData,
                        backgroundColor: '#1cc88a',
                        borderWidth: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return 'Revenue: $' + context.raw.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
});