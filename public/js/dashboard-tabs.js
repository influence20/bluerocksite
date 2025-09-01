/**
 * BlueRock Asset Management - Dashboard Tabs
 * This file handles the dashboard tab functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get user data from session storage
    const userData = JSON.parse(sessionStorage.getItem('user')) || {};
    
    // Update user name and initials in the dashboard
    updateUserInfo(userData);
    
    // Initialize dashboard tabs
    initDashboardTabs();
    
    // Initialize dashboard data
    initDashboardData();
});

/**
 * Update user information in the dashboard
 */
function updateUserInfo(userData) {
    const userNameElement = document.querySelector('.user-name');
    const userAvatarElement = document.querySelector('.user-avatar');
    
    if (userNameElement && userData.name) {
        userNameElement.textContent = userData.name;
    }
    
    if (userAvatarElement && userData.name) {
        // Get initials from name
        const initials = userData.name.split(' ')
            .map(name => name.charAt(0))
            .join('')
            .toUpperCase();
        
        userAvatarElement.textContent = initials;
    }
}

/**
 * Initialize dashboard tabs
 */
function initDashboardTabs() {
    // Get all sidebar links
    const sidebarLinks = document.querySelectorAll('.dashboard-sidebar a');
    
    // Get dashboard content area
    const dashboardContent = document.querySelector('.dashboard-content');
    
    // Create tab content container if it doesn't exist
    let tabContent = document.querySelector('.tab-content');
    if (!tabContent) {
        tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        dashboardContent.appendChild(tabContent);
    }
    
    // Store the original overview content
    const overviewContent = dashboardContent.innerHTML;
    
    // Add click event to each sidebar link
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Get tab name from link text
            const tabName = this.textContent.trim();
            
            // Update dashboard content based on tab
            updateDashboardContent(tabName, overviewContent, dashboardContent);
        });
    });
}

/**
 * Update dashboard content based on selected tab
 */
function updateDashboardContent(tabName, overviewContent, dashboardContent) {
    // Update header title
    const headerTitle = document.querySelector('.dashboard-header h1');
    if (headerTitle) {
        headerTitle.textContent = tabName;
    }
    
    // Clear dashboard content except header
    const header = document.querySelector('.dashboard-header');
    
    // Handle different tabs
    switch (tabName) {
        case 'Overview':
            // Restore original content
            dashboardContent.innerHTML = overviewContent;
            initDashboardData();
            break;
            
        case 'My Portfolio':
            createPortfolioTab(dashboardContent, header);
            break;
            
        case 'Transactions':
            createTransactionsTab(dashboardContent, header);
            break;
            
        case 'Investments':
            createInvestmentsTab(dashboardContent, header);
            break;
            
        case 'Savings':
            createSavingsTab(dashboardContent, header);
            break;
            
        case 'Withdrawals':
            // This should redirect to withdrawal.html
            window.location.href = 'withdrawal.html';
            break;
            
        case 'Statements':
            createStatementsTab(dashboardContent, header);
            break;
            
        case 'Settings':
            createSettingsTab(dashboardContent, header);
            break;
            
        case 'Support':
            createSupportTab(dashboardContent, header);
            break;
            
        default:
            // Default to overview
            dashboardContent.innerHTML = overviewContent;
            break;
    }
}

/**
 * Initialize dashboard data
 */
function initDashboardData() {
    // Check if charts are already initialized
    if (window.portfolioChart && window.allocationChart) {
        return;
    }
    
    // Initialize portfolio chart
    const portfolioCtx = document.getElementById('portfolioChart');
    if (portfolioCtx) {
        window.portfolioChart = new Chart(portfolioCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Aug 23', 'Aug 24', 'Aug 25', 'Aug 26', 'Aug 27', 'Aug 28', 'Aug 29', 'Aug 30'],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [0, 0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(78, 115, 223, 0.05)',
                    borderColor: 'rgba(78, 115, 223, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(78, 115, 223, 1)',
                    pointHoverBorderColor: '#fff',
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    },
                    y: {
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: "rgb(255, 255, 255)",
                        bodyColor: "#858796",
                        titleMarginBottom: 10,
                        titleColor: '#6e707e',
                        titleFontSize: 14,
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        intersect: false,
                        mode: 'index',
                        caretPadding: 10,
                        callbacks: {
                            label: function(context) {
                                var label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '$' + context.parsed.y.toLocaleString();
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Initialize allocation chart
    const allocationCtx = document.getElementById('allocationChart');
    if (allocationCtx) {
        window.allocationChart = new Chart(allocationCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Premium Investment Program', 'Growth Portfolio', 'Savings Account', 'Cryptocurrency'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
                    hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a'],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }]
            },
            options: {
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: "rgb(255, 255, 255)",
                        bodyColor: "#858796",
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        caretPadding: 10,
                    }
                }
            }
        });
    }
    
    // Check for admin-set data
    checkAdminSetValues();
}

/**
 * Check if admin has set values for this user
 */
function checkAdminSetValues() {
    // In a real application, this would make an API call to check if admin has set values
    // For demo purposes, we'll check if there's stored data in localStorage
    
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (!userData) return;
    
    const userEmail = userData.email;
    const adminSetData = localStorage.getItem(`admin_data_${userEmail}`);
    
    if (adminSetData) {
        // If admin has set data, update the dashboard
        const data = JSON.parse(adminSetData);
        updateDashboardWithAdminData(data);
    } else {
        // For demo purposes, create some sample data
        const sampleData = {
            portfolioValue: '5000.00',
            totalEarnings: '250.00',
            activeInvestments: '2',
            nextPayout: '50.00',
            portfolioChange: '2.5',
            earningsChange: '3.8',
            nextPayoutDate: 'Friday, Sep 3, 2025',
            transactions: [
                {
                    date: 'Aug 28, 2025',
                    description: 'Weekly Return - Starter Program',
                    type: 'Deposit',
                    amount: '+$50.00',
                    status: 'Completed'
                },
                {
                    date: 'Aug 21, 2025',
                    description: 'Weekly Return - Starter Program',
                    type: 'Deposit',
                    amount: '+$50.00',
                    status: 'Completed'
                },
                {
                    date: 'Aug 15, 2025',
                    description: 'Initial Investment',
                    type: 'Investment',
                    amount: '-$5000.00',
                    status: 'Completed'
                }
            ],
            chartData: {
                portfolio: {
                    labels: ['Aug 23', 'Aug 24', 'Aug 25', 'Aug 26', 'Aug 27', 'Aug 28', 'Aug 29', 'Aug 30'],
                    data: [5000, 5000, 5050, 5050, 5100, 5100, 5150, 5250]
                },
                allocation: {
                    data: [60, 20, 15, 5],
                    percentages: [60, 20, 15, 5]
                }
            }
        };
        
        // Save sample data to localStorage
        localStorage.setItem(`admin_data_${userEmail}`, JSON.stringify(sampleData));
        
        // Update dashboard with sample data
        updateDashboardWithAdminData(sampleData);
    }
}

/**
 * Update dashboard with admin-set data
 */
function updateDashboardWithAdminData(data) {
    // Update value elements
    const valueElements = document.querySelectorAll('.dashboard-card .value');
    
    // Portfolio Value
    if (valueElements[0] && data.portfolioValue) {
        valueElements[0].textContent = `$${parseFloat(data.portfolioValue).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    // Total Earnings
    if (valueElements[1] && data.totalEarnings) {
        valueElements[1].textContent = `$${parseFloat(data.totalEarnings).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    // Active Investments
    if (valueElements[2] && data.activeInvestments) {
        valueElements[2].textContent = data.activeInvestments;
    }
    
    // Next Payout
    if (valueElements[3] && data.nextPayout) {
        valueElements[3].textContent = `$${parseFloat(data.nextPayout).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    
    // Update change indicators
    if (data.portfolioChange) {
        const portfolioChangeElement = document.querySelector('.dashboard-card:nth-child(1) .change');
        if (portfolioChangeElement) {
            const changeValue = parseFloat(data.portfolioChange);
            portfolioChangeElement.classList.remove('positive', 'negative');
            portfolioChangeElement.classList.add(changeValue >= 0 ? 'positive' : 'negative');
            
            const icon = portfolioChangeElement.querySelector('i');
            if (icon) {
                icon.className = changeValue >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
            }
            
            const span = portfolioChangeElement.querySelector('span');
            if (span) {
                span.textContent = `${changeValue >= 0 ? '+' : ''}${changeValue}% this month`;
            }
        }
    }
    
    if (data.earningsChange) {
        const earningsChangeElement = document.querySelector('.dashboard-card:nth-child(2) .change');
        if (earningsChangeElement) {
            const changeValue = parseFloat(data.earningsChange);
            earningsChangeElement.classList.remove('positive', 'negative');
            earningsChangeElement.classList.add(changeValue >= 0 ? 'positive' : 'negative');
            
            const icon = earningsChangeElement.querySelector('i');
            if (icon) {
                icon.className = changeValue >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
            }
            
            const span = earningsChangeElement.querySelector('span');
            if (span) {
                span.textContent = `${changeValue >= 0 ? '+' : ''}${changeValue}% this month`;
            }
        }
    }
    
    // Update next payout date
    if (data.nextPayoutDate) {
        const nextPayoutElement = document.querySelector('.dashboard-card:nth-child(4) .change span');
        if (nextPayoutElement) {
            nextPayoutElement.textContent = `Due: ${data.nextPayoutDate}`;
        }
    }
    
    // Update transactions if available
    if (data.transactions && data.transactions.length > 0) {
        const transactionTableBody = document.querySelector('.transactions-table tbody');
        if (transactionTableBody) {
            transactionTableBody.innerHTML = '';
            
            data.transactions.forEach(transaction => {
                const row = document.createElement('tr');
                
                // Determine transaction type class
                let typeClass = '';
                switch (transaction.type.toLowerCase()) {
                    case 'deposit':
                        typeClass = 'transaction-deposit';
                        break;
                    case 'withdrawal':
                        typeClass = 'transaction-withdrawal';
                        break;
                    case 'investment':
                        typeClass = 'transaction-investment';
                        break;
                    default:
                        typeClass = 'transaction-deposit';
                }
                
                row.innerHTML = `
                    <td>${transaction.date}</td>
                    <td>${transaction.description}</td>
                    <td><span class="transaction-type ${typeClass}">${transaction.type}</span></td>
                    <td>${transaction.amount}</td>
                    <td>${transaction.status}</td>
                `;
                
                transactionTableBody.appendChild(row);
            });
        }
    }
    
    // Update charts if data available
    if (data.chartData) {
        updateCharts(data.chartData);
    }
}

/**
 * Update charts with admin-set data
 */
function updateCharts(chartData) {
    // Update portfolio chart
    if (window.portfolioChart && chartData.portfolio) {
        window.portfolioChart.data.labels = chartData.portfolio.labels;
        window.portfolioChart.data.datasets[0].data = chartData.portfolio.data;
        window.portfolioChart.update();
    }
    
    // Update allocation chart
    if (window.allocationChart && chartData.allocation) {
        window.allocationChart.data.datasets[0].data = chartData.allocation.data;
        window.allocationChart.update();
        
        // Update investment breakdown table
        const breakdownTable = document.querySelector('.chart-container table');
        if (breakdownTable && chartData.allocation.percentages) {
            const rows = breakdownTable.querySelectorAll('tr');
            chartData.allocation.percentages.forEach((percentage, index) => {
                if (rows[index]) {
                    const percentCell = rows[index].querySelector('td:last-child');
                    if (percentCell) {
                        percentCell.textContent = `${percentage}%`;
                    }
                }
            });
        }
    }
}

/**
 * Create Portfolio Tab Content
 */
function createPortfolioTab(dashboardContent, header) {
    // Create content container
    const content = document.createElement('div');
    content.className = 'tab-content';
    
    // Add header back
    content.appendChild(header.cloneNode(true));
    
    // Create portfolio content
    content.innerHTML += `
        <div class="chart-container">
            <div class="chart-header">
                <h2>Portfolio Performance</h2>
                <div class="chart-filters">
                    <button class="active">1W</button>
                    <button>1M</button>
                    <button>3M</button>
                    <button>6M</button>
                    <button>1Y</button>
                    <button>All</button>
                </div>
            </div>
            <canvas id="portfolioPerformanceChart" style="height: 300px;"></canvas>
        </div>
        
        <div class="dashboard-cards">
            <div class="dashboard-card">
                <h3>Total Invested</h3>
                <div class="value">$5,000.00</div>
                <div class="change">
                    <span>Initial Investment</span>
                </div>
            </div>
            
            <div class="dashboard-card">
                <h3>Current Value</h3>
                <div class="value">$5,250.00</div>
                <div class="change positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>+5% overall</span>
                </div>
            </div>
            
            <div class="dashboard-card">
                <h3>Total Profit</h3>
                <div class="value">$250.00</div>
                <div class="change positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>+5% ROI</span>
                </div>
            </div>
            
            <div class="dashboard-card">
                <h3>Projected Annual Return</h3>
                <div class="value">$2,600.00</div>
                <div class="change">
                    <span>52% APY</span>
                </div>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <h2>Investment Allocation</h2>
            </div>
            <div style="display: flex; gap: 30px;">
                <div style="flex: 1;">
                    <canvas id="portfolioAllocationChart" style="height: 300px;"></canvas>
                </div>
                <div style="flex: 1;">
                    <h3 style="margin-top: 0;">Investment Breakdown</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                                <span style="display: inline-block; width: 12px; height: 12px; background-color: #4e73df; border-radius: 50%; margin-right: 8px;"></span>
                                Premium Investment Program
                            </td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">60%</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                                <span style="display: inline-block; width: 12px; height: 12px; background-color: #1cc88a; border-radius: 50%; margin-right: 8px;"></span>
                                Growth Portfolio
                            </td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">20%</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                                <span style="display: inline-block; width: 12px; height: 12px; background-color: #36b9cc; border-radius: 50%; margin-right: 8px;"></span>
                                Savings Account
                            </td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">15%</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                                <span style="display: inline-block; width: 12px; height: 12px; background-color: #f6c23e; border-radius: 50%; margin-right: 8px;"></span>
                                Cryptocurrency
                            </td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">5%</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    // Replace dashboard content
    dashboardContent.innerHTML = '';
    dashboardContent.appendChild(content);
    
    // Initialize charts
    initPortfolioCharts();
}

/**
 * Initialize portfolio charts
 */
function initPortfolioCharts() {
    // Portfolio performance chart
    const performanceCtx = document.getElementById('portfolioPerformanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Aug 23', 'Aug 24', 'Aug 25', 'Aug 26', 'Aug 27', 'Aug 28', 'Aug 29', 'Aug 30'],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [5000, 5000, 5050, 5050, 5100, 5100, 5150, 5250],
                    backgroundColor: 'rgba(78, 115, 223, 0.05)',
                    borderColor: 'rgba(78, 115, 223, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(78, 115, 223, 1)',
                    pointHoverBorderColor: '#fff',
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    },
                    y: {
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: "rgb(255, 255, 255)",
                        bodyColor: "#858796",
                        titleMarginBottom: 10,
                        titleColor: '#6e707e',
                        titleFontSize: 14,
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        intersect: false,
                        mode: 'index',
                        caretPadding: 10,
                        callbacks: {
                            label: function(context) {
                                var label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '$' + context.parsed.y.toLocaleString();
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Portfolio allocation chart
    const allocationCtx = document.getElementById('portfolioAllocationChart');
    if (allocationCtx) {
        new Chart(allocationCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Premium Investment Program', 'Growth Portfolio', 'Savings Account', 'Cryptocurrency'],
                datasets: [{
                    data: [60, 20, 15, 5],
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
                    hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a'],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                }]
            },
            options: {
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: "rgb(255, 255, 255)",
                        bodyColor: "#858796",
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        caretPadding: 10,
                    }
                }
            }
        });
    }
    
    // Add event listeners to chart filter buttons
    const chartFilterButtons = document.querySelectorAll('.chart-filters button');
    chartFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            chartFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

/**
 * Create Transactions Tab Content
 */
function createTransactionsTab(dashboardContent, header) {
    // Create content container
    const content = document.createElement('div');
    content.className = 'tab-content';
    
    // Add header back
    content.appendChild(header.cloneNode(true));
    
    // Create transactions content
    content.innerHTML += `
        <div class="chart-container">
            <div class="chart-header">
                <h2>Transaction History</h2>
                <div class="chart-filters">
                    <button class="active">All</button>
                    <button>Deposits</button>
                    <button>Withdrawals</button>
                    <button>Investments</button>
                </div>
            </div>
            
            <div class="transaction-filters" style="margin-bottom: 20px; display: flex; gap: 15px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px;">
                    <label for="date-range" style="display: block; margin-bottom: 5px; font-weight: 500;">Date Range</label>
                    <select id="date-range" class="form-control">
                        <option value="all">All Time</option>
                        <option value="week" selected>Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                        <option value="quarter">Last 3 Months</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>
                
                <div style="flex: 1; min-width: 200px;">
                    <label for="transaction-type" style="display: block; margin-bottom: 5px; font-weight: 500;">Transaction Type</label>
                    <select id="transaction-type" class="form-control">
                        <option value="all" selected>All Types</option>
                        <option value="deposit">Deposits</option>
                        <option value="withdrawal">Withdrawals</option>
                        <option value="investment">Investments</option>
                    </select>
                </div>
                
                <div style="flex: 1; min-width: 200px;">
                    <label for="transaction-status" style="display: block; margin-bottom: 5px; font-weight: 500;">Status</label>
                    <select id="transaction-status" class="form-control">
                        <option value="all" selected>All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>
            
            <div class="transaction-list">
                <table class="transactions-table" style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Aug 28, 2025</td>
                            <td>Weekly Return - Starter Program</td>
                            <td><span class="transaction-type transaction-deposit">Deposit</span></td>
                            <td>+$50.00</td>
                            <td>Completed</td>
                        </tr>
                        <tr>
                            <td>Aug 21, 2025</td>
                            <td>Weekly Return - Starter Program</td>
                            <td><span class="transaction-type transaction-deposit">Deposit</span></td>
                            <td>+$50.00</td>
                            <td>Completed</td>
                        </tr>
                        <tr>
                            <td>Aug 15, 2025</td>
                            <td>Initial Investment</td>
                            <td><span class="transaction-type transaction-investment">Investment</span></td>
                            <td>-$5,000.00</td>
                            <td>Completed</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="pagination" style="margin-top: 20px; display: flex; justify-content: center;">
                <button class="btn btn-sm" style="margin-right: 5px;">&laquo; Previous</button>
                <button class="btn btn-sm btn-primary" style="margin-right: 5px;">1</button>
                <button class="btn btn-sm" style="margin-right: 5px;">2</button>
                <button class="btn btn-sm" style="margin-right: 5px;">3</button>
                <button class="btn btn-sm">Next &raquo;</button>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <h2>Transaction Summary</h2>
            </div>
            
            <div class="dashboard-cards">
                <div class="dashboard-card">
                    <h3>Total Deposits</h3>
                    <div class="value">$100.00</div>
                    <div class="change">
                        <span>2 transactions</span>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <h3>Total Withdrawals</h3>
                    <div class="value">$0.00</div>
                    <div class="change">
                        <span>0 transactions</span>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <h3>Total Investments</h3>
                    <div class="value">$5,000.00</div>
                    <div class="change">
                        <span>1 transaction</span>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <h3>Net Balance</h3>
                    <div class="value">-$4,900.00</div>
                    <div class="change negative">
                        <i class="fas fa-arrow-down"></i>
                        <span>Initial investment phase</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Replace dashboard content
    dashboardContent.innerHTML = '';
    dashboardContent.appendChild(content);
    
    // Add event listeners to filter buttons
    const filterButtons = content.querySelectorAll('.chart-filters button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

/**
 * Create Investments Tab Content
 */
function createInvestmentsTab(dashboardContent, header) {
    // Create content container
    const content = document.createElement('div');
    content.className = 'tab-content';
    
    // Add header back
    content.appendChild(header.cloneNode(true));
    
    // Create investments content
    content.innerHTML += `
        <div class="dashboard-cards">
            <div class="dashboard-card">
                <h3>Active Investments</h3>
                <div class="value">2</div>
                <div class="change">
                    <span>Total value: $5,000.00</span>
                </div>
            </div>
            
            <div class="dashboard-card">
                <h3>Total Returns</h3>
                <div class="value">$100.00</div>
                <div class="change positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>+2% ROI</span>
                </div>
            </div>
            
            <div class="dashboard-card">
                <h3>Next Payout</h3>
                <div class="value">$50.00</div>
                <div class="change">
                    <span>Due: Friday, Sep 3, 2025</span>
                </div>
            </div>
            
            <div class="dashboard-card">
                <h3>Available for Investment</h3>
                <div class="value">$0.00</div>
                <div class="change">
                    <span><a href="deposit.html" style="color: inherit; text-decoration: underline;">Make a deposit</a></span>
                </div>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <h2>Your Investment Plans</h2>
            </div>
            
            <div class="investment-plans" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <!-- Starter Plan -->
                <div class="premium-card">
                    <div class="premium-card-header">
                        <h3>Starter Plan</h3>
                        <span class="badge badge-primary">Active</span>
                    </div>
                    <div class="premium-card-body">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">$3,000.00</div>
                            <div style="color: var(--gray-600);">Invested Amount</div>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Weekly Return:</span>
                                <span style="font-weight: 600;">$30.00 (1%)</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Total Earned:</span>
                                <span style="font-weight: 600;">$60.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Start Date:</span>
                                <span style="font-weight: 600;">Aug 15, 2025</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>End Date:</span>
                                <span style="font-weight: 600;">Nov 15, 2025</span>
                            </div>
                        </div>
                        
                        <div class="progress" style="height: 10px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 10px; overflow: hidden;">
                            <div class="progress-bar" style="width: 20%; height: 100%; background-color: var(--primary-color);"></div>
                        </div>
                        <div style="text-align: center; font-size: 0.9rem; color: var(--gray-600);">2 of 12 weeks completed (20%)</div>
                    </div>
                    <div class="premium-card-footer">
                        <button class="btn btn-sm btn-primary">View Details</button>
                    </div>
                </div>
                
                <!-- Growth Plan -->
                <div class="premium-card">
                    <div class="premium-card-header">
                        <h3>Growth Plan</h3>
                        <span class="badge badge-primary">Active</span>
                    </div>
                    <div class="premium-card-body">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">$2,000.00</div>
                            <div style="color: var(--gray-600);">Invested Amount</div>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Weekly Return:</span>
                                <span style="font-weight: 600;">$20.00 (1%)</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Total Earned:</span>
                                <span style="font-weight: 600;">$40.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Start Date:</span>
                                <span style="font-weight: 600;">Aug 15, 2025</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>End Date:</span>
                                <span style="font-weight: 600;">Nov 15, 2025</span>
                            </div>
                        </div>
                        
                        <div class="progress" style="height: 10px; background-color: #e9ecef; border-radius: 5px; margin-bottom: 10px; overflow: hidden;">
                            <div class="progress-bar" style="width: 20%; height: 100%; background-color: var(--primary-color);"></div>
                        </div>
                        <div style="text-align: center; font-size: 0.9rem; color: var(--gray-600);">2 of 12 weeks completed (20%)</div>
                    </div>
                    <div class="premium-card-footer">
                        <button class="btn btn-sm btn-primary">View Details</button>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <a href="investment-plans.html" class="btn btn-accent">Explore More Investment Plans</a>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <h2>Investment Performance</h2>
                <div class="chart-filters">
                    <button class="active">1W</button>
                    <button>1M</button>
                    <button>3M</button>
                    <button>6M</button>
                    <button>1Y</button>
                    <button>All</button>
                </div>
            </div>
            <canvas id="investmentPerformanceChart" style="height: 300px;"></canvas>
        </div>
    `;
    
    // Replace dashboard content
    dashboardContent.innerHTML = '';
    dashboardContent.appendChild(content);
    
    // Initialize investment performance chart
    const performanceCtx = document.getElementById('investmentPerformanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Aug 15', 'Aug 16', 'Aug 17', 'Aug 18', 'Aug 19', 'Aug 20', 'Aug 21', 'Aug 22', 'Aug 23', 'Aug 24', 'Aug 25', 'Aug 26', 'Aug 27', 'Aug 28', 'Aug 29', 'Aug 30'],
                datasets: [{
                    label: 'Starter Plan',
                    data: [3000, 3000, 3000, 3000, 3000, 3000, 3030, 3030, 3030, 3030, 3030, 3030, 3030, 3060, 3060, 3060],
                    backgroundColor: 'rgba(78, 115, 223, 0.05)',
                    borderColor: 'rgba(78, 115, 223, 1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 5,
                    tension: 0.4,
                    fill: false
                }, {
                    label: 'Growth Plan',
                    data: [2000, 2000, 2000, 2000, 2000, 2000, 2020, 2020, 2020, 2020, 2020, 2020, 2020, 2040, 2040, 2040],
                    backgroundColor: 'rgba(28, 200, 138, 0.05)',
                    borderColor: 'rgba(28, 200, 138, 1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: 'rgba(28, 200, 138, 1)',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 5,
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    },
                    y: {
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: "rgb(255, 255, 255)",
                        bodyColor: "#858796",
                        titleMarginBottom: 10,
                        titleColor: '#6e707e',
                        titleFontSize: 14,
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        intersect: false,
                        mode: 'index',
                        caretPadding: 10,
                        callbacks: {
                            label: function(context) {
                                var label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '$' + context.parsed.y.toLocaleString();
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Add event listeners to chart filter buttons
    const chartFilterButtons = content.querySelectorAll('.chart-filters button');
    chartFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            chartFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

/**
 * Create Savings Tab Content
 */
function createSavingsTab(dashboardContent, header) {
    // Create content container
    const content = document.createElement('div');
    content.className = 'tab-content';
    
    // Add header back
    content.appendChild(header.cloneNode(true));
    
    // Create savings content
    content.innerHTML += `
        <div class="dashboard-cards">
            <div class="dashboard-card">
                <h3>Savings Balance</h3>
                <div class="value">$750.00</div>
                <div class="change positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>+3.5% this month</span>
                </div>
            </div>
            
            <div class="dashboard-card">
                <h3>Interest Earned</h3>
                <div class="value">$26.25</div>
                <div class="change positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>3.5% APY</span>
                </div>
            </div>
            
            <div class="dashboard-card">
                <h3>Next Interest Payment</h3>
                <div class="value">$2.19</div>
                <div class="change">
                    <span>Due: Sep 30, 2025</span>
                </div>
            </div>
            
            <div class="dashboard-card">
                <h3>Available for Withdrawal</h3>
                <div class="value">$750.00</div>
                <div class="change">
                    <span>No lock-up period</span>
                </div>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <h2>Savings Growth</h2>
                <div class="chart-filters">
                    <button>1M</button>
                    <button class="active">3M</button>
                    <button>6M</button>
                    <button>1Y</button>
                    <button>All</button>
                </div>
            </div>
            <canvas id="savingsGrowthChart" style="height: 300px;"></canvas>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <h2>Savings Plans</h2>
            </div>
            
            <div class="savings-plans" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <!-- Flexible Savings -->
                <div class="premium-card">
                    <div class="premium-card-header">
                        <h3>Flexible Savings</h3>
                        <span class="badge badge-primary">Active</span>
                    </div>
                    <div class="premium-card-body">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">$750.00</div>
                            <div style="color: var(--gray-600);">Current Balance</div>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Interest Rate:</span>
                                <span style="font-weight: 600;">3.5% APY</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Interest Earned:</span>
                                <span style="font-weight: 600;">$26.25</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Start Date:</span>
                                <span style="font-weight: 600;">Jan 15, 2025</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Withdrawal:</span>
                                <span style="font-weight: 600;">Anytime</span>
                            </div>
                        </div>
                    </div>
                    <div class="premium-card-footer">
                        <button class="btn btn-sm btn-primary">Deposit More</button>
                        <button class="btn btn-sm">Withdraw</button>
                    </div>
                </div>
                
                <!-- Fixed Term Savings -->
                <div class="premium-card" style="opacity: 0.7;">
                    <div class="premium-card-header">
                        <h3>Fixed Term Savings</h3>
                        <span class="badge badge-accent">Available</span>
                    </div>
                    <div class="premium-card-body">
                        <div style="text-align: center; margin-bottom: 20px;">
                            <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color);">5.5% APY</div>
                            <div style="color: var(--gray-600);">Fixed Interest Rate</div>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Minimum Deposit:</span>
                                <span style="font-weight: 600;">$1,000.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Term Length:</span>
                                <span style="font-weight: 600;">12 Months</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Interest Payment:</span>
                                <span style="font-weight: 600;">Monthly</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Early Withdrawal:</span>
                                <span style="font-weight: 600;">Fee Applies</span>
                            </div>
                        </div>
                    </div>
                    <div class="premium-card-footer">
                        <button class="btn btn-sm btn-accent">Open Account</button>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <a href="savings.html" class="btn btn-accent">Explore More Savings Options</a>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <h2>Recent Transactions</h2>
            </div>
            
            <table class="transactions-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Aug 30, 2025</td>
                        <td>Interest Payment</td>
                        <td><span class="transaction-type transaction-deposit">Deposit</span></td>
                        <td>+$2.19</td>
                        <td>$750.00</td>
                    </tr>
                    <tr>
                        <td>Jul 30, 2025</td>
                        <td>Interest Payment</td>
                        <td><span class="transaction-type transaction-deposit">Deposit</span></td>
                        <td>+$2.19</td>
                        <td>$747.81</td>
                    </tr>
                    <tr>
                        <td>Jul 15, 2025</td>
                        <td>Deposit to Savings</td>
                        <td><span class="transaction-type transaction-deposit">Deposit</span></td>
                        <td>+$250.00</td>
                        <td>$745.62</td>
                    </tr>
                    <tr>
                        <td>Jun 30, 2025</td>
                        <td>Interest Payment</td>
                        <td><span class="transaction-type transaction-deposit">Deposit</span></td>
                        <td>+$1.73</td>
                        <td>$495.62</td>
                    </tr>
                    <tr>
                        <td>Jan 15, 2025</td>
                        <td>Initial Deposit</td>
                        <td><span class="transaction-type transaction-deposit">Deposit</span></td>
                        <td>+$500.00</td>
                        <td>$500.00</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    // Replace dashboard content
    dashboardContent.innerHTML = '';
    dashboardContent.appendChild(content);
    
    // Initialize savings growth chart
    const growthCtx = document.getElementById('savingsGrowthChart');
    if (growthCtx) {
        new Chart(growthCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jun 1', 'Jun 15', 'Jun 30', 'Jul 15', 'Jul 30', 'Aug 15', 'Aug 30'],
                datasets: [{
                    label: 'Savings Balance',
                    data: [493.89, 493.89, 495.62, 745.62, 747.81, 747.81, 750.00],
                    backgroundColor: 'rgba(54, 185, 204, 0.05)',
                    borderColor: 'rgba(54, 185, 204, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54, 185, 204, 1)',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(54, 185, 204, 1)',
                    pointHoverBorderColor: '#fff',
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 7
                        }
                    },
                    y: {
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: "rgb(234, 236, 244)",
                            zeroLineColor: "rgb(234, 236, 244)",
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: "rgb(255, 255, 255)",
                        bodyColor: "#858796",
                        titleMarginBottom: 10,
                        titleColor: '#6e707e',
                        titleFontSize: 14,
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        intersect: false,
                        mode: 'index',
                        caretPadding: 10,
                        callbacks: {
                            label: function(context) {
                                var label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '$' + context.parsed.y.toLocaleString();
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Add event listeners to chart filter buttons
    const chartFilterButtons = content.querySelectorAll('.chart-filters button');
    chartFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            chartFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

/**
 * Create Statements Tab Content
 */
function createStatementsTab(dashboardContent, header) {
    // Create content container
    const content = document.createElement('div');
    content.className = 'tab-content';
    
    // Add header back
    content.appendChild(header.cloneNode(true));
    
    // Create statements content
    content.innerHTML += `
        <div class="chart-container">
            <div class="chart-header">
                <h2>Account Statements</h2>
            </div>
            
            <div class="statement-filters" style="margin-bottom: 20px; display: flex; gap: 15px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px;">
                    <label for="statement-year" style="display: block; margin-bottom: 5px; font-weight: 500;">Year</label>
                    <select id="statement-year" class="form-control">
                        <option value="2025" selected>2025</option>
                    </select>
                </div>
                
                <div style="flex: 1; min-width: 200px;">
                    <label for="statement-month" style="display: block; margin-bottom: 5px; font-weight: 500;">Month</label>
                    <select id="statement-month" class="form-control">
                        <option value="all">All Months</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8" selected>August</option>
                    </select>
                </div>
                
                <div style="flex: 1; min-width: 200px;">
                    <label for="statement-type" style="display: block; margin-bottom: 5px; font-weight: 500;">Type</label>
                    <select id="statement-type" class="form-control">
                        <option value="all" selected>All Types</option>
                        <option value="monthly">Monthly Statements</option>
                        <option value="tax">Tax Documents</option>
                        <option value="receipt">Transaction Receipts</option>
                    </select>
                </div>
            </div>
            
            <table class="transactions-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Period</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Aug 31, 2025</td>
                        <td>Monthly Account Statement</td>
                        <td>Statement</td>
                        <td>Aug 1 - Aug 31, 2025</td>
                        <td>
                            <button class="btn btn-sm btn-primary"><i class="fas fa-download"></i> PDF</button>
                            <button class="btn btn-sm"><i class="fas fa-print"></i> Print</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Aug 28, 2025</td>
                        <td>Weekly Return Receipt</td>
                        <td>Receipt</td>
                        <td>Aug 28, 2025</td>
                        <td>
                            <button class="btn btn-sm btn-primary"><i class="fas fa-download"></i> PDF</button>
                            <button class="btn btn-sm"><i class="fas fa-print"></i> Print</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Aug 21, 2025</td>
                        <td>Weekly Return Receipt</td>
                        <td>Receipt</td>
                        <td>Aug 21, 2025</td>
                        <td>
                            <button class="btn btn-sm btn-primary"><i class="fas fa-download"></i> PDF</button>
                            <button class="btn btn-sm"><i class="fas fa-print"></i> Print</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Aug 15, 2025</td>
                        <td>Investment Confirmation</td>
                        <td>Receipt</td>
                        <td>Aug 15, 2025</td>
                        <td>
                            <button class="btn btn-sm btn-primary"><i class="fas fa-download"></i> PDF</button>
                            <button class="btn btn-sm"><i class="fas fa-print"></i> Print</button>
                        </td>
                    </tr>
                    <tr>
                        <td>Jul 31, 2025</td>
                        <td>Monthly Account Statement</td>
                        <td>Statement</td>
                        <td>Jul 1 - Jul 31, 2025</td>
                        <td>
                            <button class="btn btn-sm btn-primary"><i class="fas fa-download"></i> PDF</button>
                            <button class="btn btn-sm"><i class="fas fa-print"></i> Print</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <h2>Tax Documents</h2>
            </div>
            
            <div class="tax-documents" style="margin-bottom: 30px;">
                <div class="alert alert-info" style="background-color: rgba(54, 185, 204, 0.1); border: 1px solid rgba(54, 185, 204, 0.2); color: #36b9cc; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                    <i class="fas fa-info-circle"></i> Tax documents for the current year will be available by January 31, 2026.
                </div>
                
                <p>No tax documents are available yet for 2025. Tax documents are typically generated at the end of the tax year and will be available in your account by January 31 of the following year.</p>
                
                <p>If you need assistance with tax-related matters, please contact our support team.</p>
            </div>
        </div>
    `;
    
    // Replace dashboard content
    dashboardContent.innerHTML = '';
    dashboardContent.appendChild(content);
}

/**
 * Create Settings Tab Content
 */
function createSettingsTab(dashboardContent, header) {
    // Create content container
    const content = document.createElement('div');
    content.className = 'tab-content';
    
    // Add header back
    content.appendChild(header.cloneNode(true));
    
    // Get user data
    const userData = JSON.parse(sessionStorage.getItem('user')) || {};
    
    // Create settings content
    content.innerHTML += `
        <div class="chart-container">
            <div class="chart-header">
                <h2>Account Settings</h2>
            </div>
            
            <div class="settings-tabs" style="margin-bottom: 30px;">
                <ul class="nav-tabs" style="display: flex; list-style: none; padding: 0; margin: 0 0 20px 0; border-bottom: 1px solid #dee2e6;">
                    <li style="margin-right: 10px;">
                        <a href="#" class="tab-link active" data-tab="profile" style="display: block; padding: 10px 15px; text-decoration: none; color: var(--primary-color); font-weight: 600; border-bottom: 2px solid var(--primary-color);">Profile</a>
                    </li>
                    <li style="margin-right: 10px;">
                        <a href="#" class="tab-link" data-tab="security" style="display: block; padding: 10px 15px; text-decoration: none; color: var(--gray-600); font-weight: 600;">Security</a>
                    </li>
                    <li style="margin-right: 10px;">
                        <a href="#" class="tab-link" data-tab="notifications" style="display: block; padding: 10px 15px; text-decoration: none; color: var(--gray-600); font-weight: 600;">Notifications</a>
                    </li>
                    <li>
                        <a href="#" class="tab-link" data-tab="preferences" style="display: block; padding: 10px 15px; text-decoration: none; color: var(--gray-600); font-weight: 600;">Preferences</a>
                    </li>
                </ul>
                
                <!-- Profile Tab -->
                <div id="profile-tab" class="settings-tab-content" style="display: block;">
                    <form id="profile-form">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                            <div class="form-group">
                                <label for="first-name">First Name</label>
                                <input type="text" id="first-name" class="form-control" value="${userData.name ? userData.name.split(' ')[0] : ''}" placeholder="Enter your first name">
                            </div>
                            
                            <div class="form-group">
                                <label for="last-name">Last Name</label>
                                <input type="text" id="last-name" class="form-control" value="${userData.name && userData.name.split(' ').length > 1 ? userData.name.split(' ')[1] : ''}" placeholder="Enter your last name">
                            </div>
                            
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" class="form-control" value="${userData.email || ''}" placeholder="Enter your email" readonly>
                                <small class="form-text text-muted">Contact support to change your email address.</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="tel" id="phone" class="form-control" placeholder="Enter your phone number">
                            </div>
                            
                            <div class="form-group">
                                <label for="address">Address</label>
                                <input type="text" id="address" class="form-control" placeholder="Enter your address">
                            </div>
                            
                            <div class="form-group">
                                <label for="city">City</label>
                                <input type="text" id="city" class="form-control" placeholder="Enter your city">
                            </div>
                            
                            <div class="form-group">
                                <label for="state">State/Province</label>
                                <input type="text" id="state" class="form-control" placeholder="Enter your state/province">
                            </div>
                            
                            <div class="form-group">
                                <label for="zip">ZIP/Postal Code</label>
                                <input type="text" id="zip" class="form-control" placeholder="Enter your ZIP/postal code">
                            </div>
                            
                            <div class="form-group">
                                <label for="country">Country</label>
                                <select id="country" class="form-control">
                                    <option value="">Select your country</option>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="AU">Australia</option>
                                    <option value="DE">Germany</option>
                                    <option value="FR">France</option>
                                    <option value="JP">Japan</option>
                                    <option value="CN">China</option>
                                    <option value="IN">India</option>
                                    <option value="BR">Brazil</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style="text-align: right;">
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
                
                <!-- Security Tab -->
                <div id="security-tab" class="settings-tab-content" style="display: none;">
                    <form id="security-form">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
                            <div class="form-group" style="grid-column: span 2;">
                                <label for="current-password">Current Password</label>
                                <input type="password" id="current-password" class="form-control" placeholder="Enter your current password">
                            </div>
                            
                            <div class="form-group">
                                <label for="new-password">New Password</label>
                                <input type="password" id="new-password" class="form-control" placeholder="Enter your new password">
                                <small class="form-text text-muted">Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="confirm-password">Confirm New Password</label>
                                <input type="password" id="confirm-password" class="form-control" placeholder="Confirm your new password">
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 30px;">
                            <h3>Two-Factor Authentication</h3>
                            <p>Enhance your account security by enabling two-factor authentication.</p>
                            
                            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                                <div style="margin-right: 20px;">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="enable-2fa" checked>
                                        <label class="form-check-label" for="enable-2fa">Enable Two-Factor Authentication</label>
                                    </div>
                                </div>
                                <button class="btn btn-sm btn-primary">Configure 2FA</button>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 30px;">
                            <h3>Login History</h3>
                            <p>Recent login activity on your account.</p>
                            
                            <table class="transactions-table" style="width: 100%;">
                                <thead>
                                    <tr>
                                        <th>Date & Time</th>
                                        <th>IP Address</th>
                                        <th>Location</th>
                                        <th>Device</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Aug 30, 2025, 10:15 AM</td>
                                        <td>192.168.1.1</td>
                                        <td>New York, USA</td>
                                        <td>Chrome on Windows</td>
                                        <td><span class="status active">Successful</span></td>
                                    </tr>
                                    <tr>
                                        <td>Aug 28, 2025, 3:45 PM</td>
                                        <td>192.168.1.1</td>
                                        <td>New York, USA</td>
                                        <td>Chrome on Windows</td>
                                        <td><span class="status active">Successful</span></td>
                                    </tr>
                                    <tr>
                                        <td>Aug 25, 2025, 9:30 AM</td>
                                        <td>192.168.1.1</td>
                                        <td>New York, USA</td>
                                        <td>Chrome on Windows</td>
                                        <td><span class="status active">Successful</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div style="text-align: right;">
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
                
                <!-- Notifications Tab -->
                <div id="notifications-tab" class="settings-tab-content" style="display: none;">
                    <form id="notifications-form">
                        <div style="margin-bottom: 30px;">
                            <h3>Email Notifications</h3>
                            <p>Choose which email notifications you'd like to receive.</p>
                            
                            <div class="form-check" style="margin-bottom: 15px;">
                                <input class="form-check-input" type="checkbox" id="notify-transactions" checked>
                                <label class="form-check-label" for="notify-transactions">Transaction Confirmations</label>
                                <div style="font-size: 0.9rem; color: var(--gray-600); margin-top: 5px;">Receive email notifications when deposits, withdrawals, or investments are processed.</div>
                            </div>
                            
                            <div class="form-check" style="margin-bottom: 15px;">
                                <input class="form-check-input" type="checkbox" id="notify-returns" checked>
                                <label class="form-check-label" for="notify-returns">Investment Returns</label>
                                <div style="font-size: 0.9rem; color: var(--gray-600); margin-top: 5px;">Receive email notifications when investment returns are credited to your account.</div>
                            </div>
                            
                            <div class="form-check" style="margin-bottom: 15px;">
                                <input class="form-check-input" type="checkbox" id="notify-news" checked>
                                <label class="form-check-label" for="notify-news">News and Updates</label>
                                <div style="font-size: 0.9rem; color: var(--gray-600); margin-top: 5px;">Receive email notifications about platform updates, new features, and investment opportunities.</div>
                            </div>
                            
                            <div class="form-check" style="margin-bottom: 15px;">
                                <input class="form-check-input" type="checkbox" id="notify-security" checked>
                                <label class="form-check-label" for="notify-security">Security Alerts</label>
                                <div style="font-size: 0.9rem; color: var(--gray-600); margin-top: 5px;">Receive email notifications about security-related events, such as password changes and login attempts.</div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 30px;">
                            <h3>SMS Notifications</h3>
                            <p>Choose which SMS notifications you'd like to receive.</p>
                            
                            <div class="form-check" style="margin-bottom: 15px;">
                                <input class="form-check-input" type="checkbox" id="sms-transactions" checked>
                                <label class="form-check-label" for="sms-transactions">Transaction Confirmations</label>
                                <div style="font-size: 0.9rem; color: var(--gray-600); margin-top: 5px;">Receive SMS notifications when deposits, withdrawals, or investments are processed.</div>
                            </div>
                            
                            <div class="form-check" style="margin-bottom: 15px;">
                                <input class="form-check-input" type="checkbox" id="sms-security" checked>
                                <label class="form-check-label" for="sms-security">Security Alerts</label>
                                <div style="font-size: 0.9rem; color: var(--gray-600); margin-top: 5px;">Receive SMS notifications about security-related events, such as password changes and login attempts.</div>
                            </div>
                        </div>
                        
                        <div style="text-align: right;">
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
                
                <!-- Preferences Tab -->
                <div id="preferences-tab" class="settings-tab-content" style="display: none;">
                    <form id="preferences-form">
                        <div style="margin-bottom: 30px;">
                            <h3>Display Preferences</h3>
                            <p>Customize how information is displayed in your dashboard.</p>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
                                <div class="form-group">
                                    <label for="date-format">Date Format</label>
                                    <select id="date-format" class="form-control">
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="time-format">Time Format</label>
                                    <select id="time-format" class="form-control">
                                        <option value="12">12-hour (AM/PM)</option>
                                        <option value="24">24-hour</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="currency">Currency Display</label>
                                    <select id="currency" class="form-control">
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="JPY">JPY (¥)</option>
                                        <option value="CAD">CAD ($)</option>
                                        <option value="AUD">AUD ($)</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="language">Language</label>
                                    <select id="language" class="form-control">
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                        <option value="fr">Français</option>
                                        <option value="de">Deutsch</option>
                                        <option value="zh">中文</option>
                                        <option value="ja">日本語</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 30px;">
                            <h3>Dashboard Layout</h3>
                            <p>Customize which widgets appear on your dashboard and their order.</p>
                            
                            <div style="margin-bottom: 20px;">
                                <div class="form-check" style="margin-bottom: 15px;">
                                    <input class="form-check-input" type="checkbox" id="widget-portfolio" checked>
                                    <label class="form-check-label" for="widget-portfolio">Portfolio Performance</label>
                                </div>
                                
                                <div class="form-check" style="margin-bottom: 15px;">
                                    <input class="form-check-input" type="checkbox" id="widget-allocation" checked>
                                    <label class="form-check-label" for="widget-allocation">Investment Allocation</label>
                                </div>
                                
                                <div class="form-check" style="margin-bottom: 15px;">
                                    <input class="form-check-input" type="checkbox" id="widget-transactions" checked>
                                    <label class="form-check-label" for="widget-transactions">Recent Transactions</label>
                                </div>
                                
                                <div class="form-check" style="margin-bottom: 15px;">
                                    <input class="form-check-input" type="checkbox" id="widget-news">
                                    <label class="form-check-label" for="widget-news">Market News</label>
                                </div>
                            </div>
                        </div>
                        
                        <div style="text-align: right;">
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Replace dashboard content
    dashboardContent.innerHTML = '';
    dashboardContent.appendChild(content);
    
    // Add event listeners to tab links
    const tabLinks = content.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            tabLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all tab content
            const tabContents = content.querySelectorAll('.settings-tab-content');
            tabContents.forEach(tab => tab.style.display = 'none');
            
            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).style.display = 'block';
        });
    });
    
    // Add event listeners to forms
    const forms = content.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            alert('Settings saved successfully!');
        });
    });
}

/**
 * Create Support Tab Content
 */
function createSupportTab(dashboardContent, header) {
    // Create content container
    const content = document.createElement('div');
    content.className = 'tab-content';
    
    // Add header back
    content.appendChild(header.cloneNode(true));
    
    // Create support content
    content.innerHTML += `
        <div class="chart-container">
            <div class="chart-header">
                <h2>Contact Support</h2>
            </div>
            
            <div class="support-options" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <!-- Live Chat -->
                <div class="premium-card">
                    <div class="premium-card-header">
                        <h3><i class="fas fa-comments"></i> Live Chat</h3>
                    </div>
                    <div class="premium-card-body">
                        <p>Get instant help from our support team through our live chat service.</p>
                        <p><strong>Available:</strong> 24/7</p>
                        <p><strong>Response Time:</strong> Immediate</p>
                    </div>
                    <div class="premium-card-footer">
                        <button class="btn btn-primary" onclick="openLiveChat()">Start Chat</button>
                    </div>
                </div>
                
                <!-- Email Support -->
                <div class="premium-card">
                    <div class="premium-card-header">
                        <h3><i class="fas fa-envelope"></i> Email Support</h3>
                    </div>
                    <div class="premium-card-body">
                        <p>Send us an email and we'll get back to you within 24 hours.</p>
                        <p><strong>Email:</strong> support@bluerockam.com</p>
                        <p><strong>Response Time:</strong> Within 24 hours</p>
                    </div>
                    <div class="premium-card-footer">
                        <a href="mailto:support@bluerockam.com" class="btn btn-primary">Email Us</a>
                    </div>
                </div>
                
                <!-- Phone Support -->
                <div class="premium-card">
                    <div class="premium-card-header">
                        <h3><i class="fas fa-phone-alt"></i> Phone Support</h3>
                    </div>
                    <div class="premium-card-body">
                        <p>Call our dedicated support line for immediate assistance.</p>
                        <p><strong>Phone:</strong> +1 (800) 555-1234</p>
                        <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
                    </div>
                    <div class="premium-card-footer">
                        <a href="tel:+18005551234" class="btn btn-primary">Call Us</a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <h2>Submit a Support Ticket</h2>
            </div>
            
            <form id="support-form">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label for="ticket-subject">Subject</label>
                        <select id="ticket-subject" class="form-control" required>
                            <option value="">Select a subject</option>
                            <option value="account">Account Issues</option>
                            <option value="deposit">Deposit Questions</option>
                            <option value="withdrawal">Withdrawal Support</option>
                            <option value="investment">Investment Advice</option>
                            <option value="technical">Technical Support</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="ticket-priority">Priority</label>
                        <select id="ticket-priority" class="form-control" required>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group" style="margin-bottom: 20px;">
                    <label for="ticket-message">Message</label>
                    <textarea id="ticket-message" class="form-control" rows="6" placeholder="Please describe your issue in detail..." required></textarea>
                </div>
                
                <div class="form-group" style="margin-bottom: 20px;">
                    <label for="ticket-attachment">Attachment (Optional)</label>
                    <input type="file" id="ticket-attachment" class="form-control">
                    <small class="form-text text-muted">Max file size: 10MB. Supported formats: JPG, PNG, PDF, DOC, DOCX.</small>
                </div>
                
                <div style="text-align: right;">
                    <button type="submit" class="btn btn-primary">Submit Ticket</button>
                </div>
            </form>
        </div>
        
        <div class="chart-container">
            <div class="chart-header">
                <h2>Frequently Asked Questions</h2>
            </div>
            
            <div class="faq-accordion">
                <div class="faq-item" style="margin-bottom: 15px; border: 1px solid #eee; border-radius: 5px; overflow: hidden;">
                    <div class="faq-question" style="padding: 15px; background-color: #f8f9fa; cursor: pointer; font-weight: 600;">
                        How do I withdraw my funds?
                    </div>
                    <div class="faq-answer" style="padding: 0; max-height: 0; overflow: hidden; transition: all 0.3s ease;">
                        <div style="padding: 15px;">
                            <p>To withdraw your funds, follow these steps:</p>
                            <ol>
                                <li>Navigate to the "Withdrawals" section in your dashboard</li>
                                <li>Enter the amount you wish to withdraw</li>
                                <li>Select your preferred withdrawal method</li>
                                <li>Confirm your withdrawal request</li>
                                <li>Wait for admin approval and processing</li>
                            </ol>
                            <p>Withdrawal requests are typically processed within 24-48 hours.</p>
                        </div>
                    </div>
                </div>
                
                <div class="faq-item" style="margin-bottom: 15px; border: 1px solid #eee; border-radius: 5px; overflow: hidden;">
                    <div class="faq-question" style="padding: 15px; background-color: #f8f9fa; cursor: pointer; font-weight: 600;">
                        How do I update my account information?
                    </div>
                    <div class="faq-answer" style="padding: 0; max-height: 0; overflow: hidden; transition: all 0.3s ease;">
                        <div style="padding: 15px;">
                            <p>You can update your account information in the "Settings" section of your dashboard. Here's how:</p>
                            <ol>
                                <li>Click on "Settings" in the sidebar menu</li>
                                <li>Select the "Profile" tab</li>
                                <li>Update your information as needed</li>
                                <li>Click "Save Changes" to apply your updates</li>
                            </ol>
                            <p>Note that some information, such as your email address, may require verification or support assistance to change.</p>
                        </div>
                    </div>
                </div>
                
                <div class="faq-item" style="margin-bottom: 15px; border: 1px solid #eee; border-radius: 5px; overflow: hidden;">
                    <div class="faq-question" style="padding: 15px; background-color: #f8f9fa; cursor: pointer; font-weight: 600;">
                        When do I receive my investment returns?
                    </div>
                    <div class="faq-answer" style="padding: 0; max-height: 0; overflow: hidden; transition: all 0.3s ease;">
                        <div style="padding: 15px;">
                            <p>Investment returns are credited to your account according to the schedule of your specific investment plan:</p>
                            <ul>
                                <li><strong>Starter Plan:</strong> Weekly returns (every Friday)</li>
                                <li><strong>Growth Plan:</strong> Weekly returns (every Friday)</li>
                                <li><strong>Premium Plan:</strong> Weekly returns (every Friday)</li>
                                <li><strong>VIP Plan:</strong> Daily returns</li>
                            </ul>
                            <p>Returns are automatically added to your account balance and can be viewed in your transaction history.</p>
                        </div>
                    </div>
                </div>
                
                <div class="faq-item" style="margin-bottom: 15px; border: 1px solid #eee; border-radius: 5px; overflow: hidden;">
                    <div class="faq-question" style="padding: 15px; background-color: #f8f9fa; cursor: pointer; font-weight: 600;">
                        How do I change my password?
                    </div>
                    <div class="faq-answer" style="padding: 0; max-height: 0; overflow: hidden; transition: all 0.3s ease;">
                        <div style="padding: 15px;">
                            <p>To change your password, follow these steps:</p>
                            <ol>
                                <li>Click on "Settings" in the sidebar menu</li>
                                <li>Select the "Security" tab</li>
                                <li>Enter your current password</li>
                                <li>Enter and confirm your new password</li>
                                <li>Click "Save Changes" to update your password</li>
                            </ol>
                            <p>For security reasons, make sure your new password is strong and unique.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Replace dashboard content
    dashboardContent.innerHTML = '';
    dashboardContent.appendChild(content);
    
    // Add event listeners to FAQ items
    const faqItems = content.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            // Toggle active class
            item.classList.toggle('active');
            
            // Toggle answer visibility
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '15px';
            } else {
                answer.style.maxHeight = '0';
                answer.style.padding = '0';
            }
        });
    });
    
    // Add event listener to support form
    const supportForm = content.querySelector('#support-form');
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            alert('Support ticket submitted successfully! Our team will respond to your inquiry as soon as possible.');
            
            // Reset form
            this.reset();
        });
    }
}