/**
 * BlueRock Asset Management - Dashboard Initialization
 * This file handles the initialization of the client dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = checkLoginStatus();
    
    if (!isLoggedIn) {
        window.location.href = 'login.html?redirect=dashboard.html';
        return;
    }
    
    // Get user data
    const userData = JSON.parse(sessionStorage.getItem('user'));
    
    // Set user name and initial in dashboard
    const userNameElement = document.querySelector('.user-name');
    const userAvatarElement = document.querySelector('.user-avatar');
    
    if (userNameElement && userData) {
        userNameElement.textContent = userData.name;
    }
    
    if (userAvatarElement && userData) {
        // Get initials from name
        const initials = userData.name.split(' ')
            .map(name => name.charAt(0))
            .join('')
            .toUpperCase();
        
        userAvatarElement.textContent = initials;
    }
    
    // Initialize dashboard with zero values for new users
    initializeDashboardValues();
    
    // Check if admin has set values for this user
    checkAdminSetValues();
});

/**
 * Initialize dashboard with zero values
 */
function initializeDashboardValues() {
    // Get all value elements
    const valueElements = document.querySelectorAll('.dashboard-card .value');
    
    // Set default values
    if (valueElements.length > 0) {
        // Portfolio Value
        if (valueElements[0]) {
            valueElements[0].textContent = '$0.00';
        }
        
        // Total Earnings
        if (valueElements[1]) {
            valueElements[1].textContent = '$0.00';
        }
        
        // Active Investments
        if (valueElements[2]) {
            valueElements[2].textContent = '0';
        }
        
        // Next Payout
        if (valueElements[3]) {
            valueElements[3].textContent = '$0.00';
        }
    }
    
    // Clear change indicators
    const changeElements = document.querySelectorAll('.dashboard-card .change');
    changeElements.forEach(element => {
        // Remove positive/negative classes
        element.classList.remove('positive', 'negative');
        
        // Update text
        if (element.querySelector('span')) {
            if (element.parentElement.querySelector('h3').textContent.includes('Next Payout')) {
                element.querySelector('span').textContent = 'No scheduled payouts';
            } else {
                element.querySelector('span').textContent = 'No data available';
            }
        }
    });
    
    // Clear transaction table
    const transactionTableBody = document.querySelector('.transactions-table tbody');
    if (transactionTableBody) {
        transactionTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px;">No transactions available</td>
            </tr>
        `;
    }
    
    // Reset charts
    resetCharts();
}

/**
 * Reset charts to show no data
 */
function resetCharts() {
    // Portfolio chart
    if (window.portfolioChart) {
        window.portfolioChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0];
        window.portfolioChart.update();
    }
    
    // Allocation chart
    if (window.allocationChart) {
        window.allocationChart.data.datasets[0].data = [0, 0, 0, 0];
        window.allocationChart.update();
    }
    
    // Hide investment breakdown if no data
    const breakdownTable = document.querySelector('.chart-container table');
    if (breakdownTable) {
        const rows = breakdownTable.querySelectorAll('tr');
        rows.forEach(row => {
            const percentCell = row.querySelector('td:last-child');
            if (percentCell) {
                percentCell.textContent = '0%';
            }
        });
    }
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
    }
}

/**
 * Update dashboard with data set by admin
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
                    <td>${transaction.amount.startsWith('-') ? '' : '+'}${transaction.amount}</td>
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
 * Check if user is logged in
 */
function checkLoginStatus() {
    return sessionStorage.getItem('user') !== null;
}