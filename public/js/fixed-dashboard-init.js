/**
 * BlueRock Asset Management - Fixed Dashboard Initialization
 * This script handles the initialization of both client and admin dashboards
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
    
    // Check if user is logged in
    if (!checkLoginStatus()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Check if this is an admin dashboard
    const isAdminDashboard = window.location.pathname.includes('admin.html');
    dashboardState.isAdmin = isAdminDashboard;
    
    if (isAdminDashboard) {
        // Initialize admin dashboard
        initAdminDashboard();
    } else {
        // Initialize client dashboard
        initClientDashboard();
    }
}

// Initialize client dashboard
function initClientDashboard() {
    // Get user data from session storage
    const userDataStr = sessionStorage.getItem('userData');
    if (!userDataStr) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        dashboardState.userData = JSON.parse(userDataStr);
    } catch (e) {
        console.error('Error parsing user data:', e);
        window.location.href = 'login.html';
        return;
    }
    
    // Set user name in the UI
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = dashboardState.userData.name;
    });
    
    // Load client data
    loadClientData();
    
    // Initialize dashboard tabs
    initDashboardTabs();
    
    // Initialize charts
    initDashboardCharts();
    
    // Load transaction history
    loadTransactionHistory();
    
    // Set up quick action buttons
    setupQuickActions();
}

// Load client data
function loadClientData() {
    // In a real app, this would fetch client data from an API
    // For demo purposes, we'll use hardcoded data or localStorage
    
    // Try to get client data from localStorage first
    const clientDataKey = `clientData_${dashboardState.userData.email}`;
    const clientDataStr = localStorage.getItem(clientDataKey);
    
    if (clientDataStr) {
        try {
            dashboardState.clientData = JSON.parse(clientDataStr);
        } catch (e) {
            console.error('Error parsing client data:', e);
            // Use default data as fallback
            dashboardState.clientData = getDefaultClientData();
        }
    } else {
        // Use default data
        dashboardState.clientData = getDefaultClientData();
        // Save to localStorage
        localStorage.setItem(clientDataKey, JSON.stringify(dashboardState.clientData));
    }
    
    // Update UI with client data
    updateClientDataUI();
}

// Get default client data
function getDefaultClientData() {
    return {
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

// Initialize dashboard charts
function initDashboardCharts() {
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

// Load transaction history
function loadTransactionHistory() {
    // In a real app, this would fetch transaction history from an API
    // For demo purposes, we'll use hardcoded data or localStorage
    
    // Try to get transaction history from localStorage first
    const transactionHistoryKey = `transactionHistory_${dashboardState.userData.email}`;
    const transactionHistoryStr = localStorage.getItem(transactionHistoryKey);
    
    if (transactionHistoryStr) {
        try {
            dashboardState.transactionHistory = JSON.parse(transactionHistoryStr);
        } catch (e) {
            console.error('Error parsing transaction history:', e);
            // Use default data as fallback
            dashboardState.transactionHistory = getDefaultTransactionHistory();
        }
    } else {
        // Use default data
        dashboardState.transactionHistory = getDefaultTransactionHistory();
        // Save to localStorage
        localStorage.setItem(transactionHistoryKey, JSON.stringify(dashboardState.transactionHistory));
    }
    
    // Update UI with transaction history
    updateTransactionHistoryUI();
}

// Get default transaction history
function getDefaultTransactionHistory() {
    const now = new Date();
    
    return [
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
}

// Update transaction history UI
function updateTransactionHistoryUI() {
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

// Set up quick action buttons
function setupQuickActions() {
    // Deposit button
    const depositBtn = document.getElementById('deposit-btn');
    if (depositBtn) {
        depositBtn.addEventListener('click', function() {
            window.location.href = 'deposit.html';
        });
    }
    
    // Withdraw button
    const withdrawBtn = document.getElementById('withdraw-btn');
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', function() {
            window.location.href = 'withdrawal.html';
        });
    }
    
    // Invest button
    const investBtn = document.getElementById('invest-btn');
    if (investBtn) {
        investBtn.addEventListener('click', function() {
            window.location.href = 'investment-plans.html';
        });
    }
    
    // Support button
    const supportBtn = document.getElementById('support-btn');
    if (supportBtn) {
        supportBtn.addEventListener('click', function() {
            window.location.href = 'support.html';
        });
    }
}

// Check login status
function checkLoginStatus() {
    const userDataStr = sessionStorage.getItem('userData');
    const adminSessionStr = sessionStorage.getItem('adminSession');
    
    // Check if we're on admin dashboard
    if (window.location.pathname.includes('admin.html')) {
        return !!adminSessionStr;
    }
    
    // Check if we're on client dashboard
    return !!userDataStr;
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a dashboard page
    if (window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('admin.html')) {
        initDashboard();
    }
});