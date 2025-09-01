/**
 * BlueRock Asset Management - Dashboard Module
 * Cloudflare Pages Version
 */

// Import API configuration
// Make sure to include config.js before this file in your HTML

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token || !user.id) {
    // Redirect to login if not logged in
    window.location.href = 'login.html';
    return;
  }
  
  // Initialize dashboard
  initDashboard();
  
  // Load user profile
  loadUserProfile();
  
  // Load investments if on dashboard page
  if (window.location.pathname.includes('dashboard.html')) {
    loadInvestments();
    loadTransactions();
  }
  
  // Load specific data based on current page
  if (window.location.pathname.includes('investments.html')) {
    loadAllInvestments();
  }
  
  if (window.location.pathname.includes('transactions.html')) {
    loadAllTransactions();
  }
  
  if (window.location.pathname.includes('withdrawal.html')) {
    loadWithdrawalForm();
  }
  
  if (window.location.pathname.includes('profile.html')) {
    loadFullProfile();
  }
  
  if (window.location.pathname.includes('settings.html')) {
    loadSettings();
  }
  
  // Initialize dashboard
  function initDashboard() {
    // Update user name in the dashboard
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
      el.textContent = user.firstName || 'User';
    });
    
    // Initialize notifications
    loadNotifications();
  }
  
  // Load user profile
  async function loadUserProfile() {
    try {
      const data = await API_CONFIG.fetchWithAuth(API_CONFIG.ENDPOINTS.USER.PROFILE);
      
      // Update user data in local storage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update profile information in UI
      updateProfileUI(data.user);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      showError('Failed to load user profile. Please refresh the page.');
    }
  }
  
  // Update profile UI
  function updateProfileUI(user) {
    // Update user name in header
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
      el.textContent = user.firstName || 'User';
    });
    
    // Update profile details if on profile page
    if (window.location.pathname.includes('profile.html')) {
      document.getElementById('profile-name').textContent = `${user.firstName} ${user.lastName}`;
      document.getElementById('profile-email').textContent = user.email;
      document.getElementById('profile-phone').textContent = user.phone || 'Not provided';
      document.getElementById('profile-address').textContent = user.address || 'Not provided';
      document.getElementById('profile-city').textContent = user.city || 'Not provided';
      document.getElementById('profile-country').textContent = user.country || 'Not provided';
    }
  }
  
  // Load investments
  async function loadInvestments() {
    try {
      const data = await API_CONFIG.fetchWithAuth(API_CONFIG.ENDPOINTS.INVESTMENT.LIST);
      
      // Update investments in UI
      updateInvestmentsUI(data.investments);
      
      // Update investment summary
      updateInvestmentSummary(data.investments);
    } catch (error) {
      console.error('Failed to load investments:', error);
      showError('Failed to load investments. Please refresh the page.');
    }
  }
  
  // Update investments UI
  function updateInvestmentsUI(investments) {
    const investmentsContainer = document.getElementById('investments-list');
    if (!investmentsContainer) return;
    
    if (investments.length === 0) {
      investmentsContainer.innerHTML = '<div class="alert alert-info">You have no active investments.</div>';
      return;
    }
    
    investmentsContainer.innerHTML = '';
    
    investments.forEach(investment => {
      const investmentCard = document.createElement('div');
      investmentCard.className = 'col-md-6 col-lg-4 mb-4';
      investmentCard.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">${investment.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${investment.type}</h6>
            <p class="card-text">Amount: $${investment.amount.toFixed(2)}</p>
            <p class="card-text">Return: ${investment.returnRate}%</p>
            <p class="card-text">Status: <span class="badge ${investment.status === 'Active' ? 'bg-success' : 'bg-warning'}">${investment.status}</span></p>
            <p class="card-text">Start Date: ${new Date(investment.startDate).toLocaleDateString()}</p>
            <p class="card-text">End Date: ${new Date(investment.endDate).toLocaleDateString()}</p>
          </div>
          <div class="card-footer">
            <a href="investment-details.html?id=${investment._id}" class="btn btn-sm btn-primary">View Details</a>
          </div>
        </div>
      `;
      
      investmentsContainer.appendChild(investmentCard);
    });
  }
  
  // Update investment summary
  function updateInvestmentSummary(investments) {
    const totalInvestedElement = document.getElementById('total-invested');
    const totalReturnsElement = document.getElementById('total-returns');
    const activeInvestmentsElement = document.getElementById('active-investments');
    
    if (!totalInvestedElement || !totalReturnsElement || !activeInvestmentsElement) return;
    
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturns = investments.reduce((sum, inv) => {
      const returnAmount = inv.amount * (inv.returnRate / 100);
      return sum + returnAmount;
    }, 0);
    const activeInvestments = investments.filter(inv => inv.status === 'Active').length;
    
    totalInvestedElement.textContent = `$${totalInvested.toFixed(2)}`;
    totalReturnsElement.textContent = `$${totalReturns.toFixed(2)}`;
    activeInvestmentsElement.textContent = activeInvestments;
  }
  
  // Load transactions
  async function loadTransactions() {
    try {
      const data = await API_CONFIG.fetchWithAuth(API_CONFIG.ENDPOINTS.TRANSACTION.LIST + '?limit=5');
      
      // Update transactions in UI
      updateTransactionsUI(data.transactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      showError('Failed to load transactions. Please refresh the page.');
    }
  }
  
  // Update transactions UI
  function updateTransactionsUI(transactions) {
    const transactionsContainer = document.getElementById('recent-transactions');
    if (!transactionsContainer) return;
    
    if (transactions.length === 0) {
      transactionsContainer.innerHTML = '<div class="alert alert-info">No recent transactions.</div>';
      return;
    }
    
    transactionsContainer.innerHTML = '';
    
    transactions.forEach(transaction => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${new Date(transaction.date).toLocaleDateString()}</td>
        <td>${transaction.type}</td>
        <td>${transaction.description}</td>
        <td class="${transaction.type === 'Deposit' ? 'text-success' : 'text-danger'}">
          ${transaction.type === 'Deposit' ? '+' : '-'}$${transaction.amount.toFixed(2)}
        </td>
        <td><span class="badge ${transaction.status === 'Completed' ? 'bg-success' : 'bg-warning'}">${transaction.status}</span></td>
      `;
      
      transactionsContainer.appendChild(row);
    });
  }
  
  // Load notifications
  async function loadNotifications() {
    try {
      const data = await API_CONFIG.fetchWithAuth(API_CONFIG.ENDPOINTS.NOTIFICATION.LIST);
      
      // Update notifications in UI
      updateNotificationsUI(data.notifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }
  
  // Update notifications UI
  function updateNotificationsUI(notifications) {
    const notificationsContainer = document.getElementById('notifications-dropdown');
    const notificationsBadge = document.getElementById('notifications-badge');
    
    if (!notificationsContainer || !notificationsBadge) return;
    
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // Update badge
    if (unreadCount > 0) {
      notificationsBadge.textContent = unreadCount;
      notificationsBadge.style.display = 'inline-block';
    } else {
      notificationsBadge.style.display = 'none';
    }
    
    // Update dropdown
    notificationsContainer.innerHTML = '';
    
    if (notifications.length === 0) {
      notificationsContainer.innerHTML = '<div class="dropdown-item text-center">No notifications</div>';
      return;
    }
    
    // Show only the 5 most recent notifications
    const recentNotifications = notifications.slice(0, 5);
    
    recentNotifications.forEach(notification => {
      const item = document.createElement('a');
      item.className = `dropdown-item ${notification.read ? '' : 'unread'}`;
      item.href = notification.link || '#';
      item.innerHTML = `
        <div class="d-flex align-items-center">
          <div class="notification-icon ${notification.type === 'alert' ? 'bg-danger' : notification.type === 'info' ? 'bg-info' : 'bg-success'}">
            <i class="fas ${notification.type === 'alert' ? 'fa-exclamation' : notification.type === 'info' ? 'fa-info' : 'fa-check'}"></i>
          </div>
          <div class="notification-content">
            <p class="mb-1">${notification.message}</p>
            <small class="text-muted">${new Date(notification.createdAt).toLocaleString()}</small>
          </div>
        </div>
      `;
      
      notificationsContainer.appendChild(item);
    });
    
    // Add "View All" link
    const viewAllLink = document.createElement('div');
    viewAllLink.className = 'dropdown-item text-center view-all';
    viewAllLink.innerHTML = '<a href="notifications.html">View All Notifications</a>';
    notificationsContainer.appendChild(viewAllLink);
  }
  
  // Show error message
  function showError(message) {
    const errorAlert = document.createElement('div');
    errorAlert.className = 'alert alert-danger alert-dismissible fade show';
    errorAlert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.prepend(errorAlert);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      errorAlert.classList.remove('show');
      setTimeout(() => errorAlert.remove(), 150);
    }, 5000);
  }
});