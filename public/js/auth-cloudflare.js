/**
 * BlueRock Asset Management - Authentication Module
 * Cloudflare Pages Version
 */

// Import API configuration
// Make sure to include config.js before this file in your HTML

document.addEventListener('DOMContentLoaded', function() {
  // Check if user is logged in
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (token && user.id) {
      // User is logged in
      if (window.location.pathname.includes('login.html') || 
          window.location.pathname.includes('signup.html')) {
        // Redirect to dashboard if on login or signup page
        window.location.href = 'dashboard.html';
      } else {
        // Update UI for logged in user
        updateAuthUI(true, user);
      }
    } else {
      // User is not logged in
      if (!window.location.pathname.includes('login.html') && 
          !window.location.pathname.includes('signup.html') &&
          !window.location.pathname.includes('index.html') &&
          !window.location.pathname.includes('blog.html') &&
          !window.location.pathname.includes('blog-post.html') &&
          !window.location.pathname.includes('investment-plans.html') &&
          !window.location.pathname.includes('investments.html') &&
          !window.location.pathname.includes('education.html') &&
          !window.location.pathname.includes('support.html') &&
          !window.location.pathname.includes('terms.html') &&
          !window.location.pathname.includes('privacy-policy.html') &&
          !window.location.pathname.includes('cookie-policy.html') &&
          !window.location.pathname.includes('disclaimer.html') &&
          !window.location.pathname.includes('regulatory.html') &&
          !window.location.pathname.includes('gdpr-compliance.html') &&
          !window.location.pathname.includes('ssl-implementation.html') &&
          !window.location.pathname.includes('investment-guide.html') &&
          !window.location.pathname.includes('forgot-password.html') &&
          !window.location.pathname.includes('reset-password.html') &&
          window.location.pathname !== '/') {
        // Redirect to login if on protected page
        window.location.href = 'login.html';
      } else {
        // Update UI for logged out user
        updateAuthUI(false);
      }
    }
  };
  
  // Update UI based on authentication status
  const updateAuthUI = (isLoggedIn, user = {}) => {
    const loginButtons = document.querySelectorAll('.login-button');
    const signupButtons = document.querySelectorAll('.signup-button');
    const logoutButtons = document.querySelectorAll('.logout-button');
    const dashboardButtons = document.querySelectorAll('.dashboard-button');
    const userNameElements = document.querySelectorAll('.user-name');
    
    if (isLoggedIn) {
      // Hide login/signup buttons
      loginButtons.forEach(btn => btn.style.display = 'none');
      signupButtons.forEach(btn => btn.style.display = 'none');
      
      // Show logout/dashboard buttons
      logoutButtons.forEach(btn => btn.style.display = 'inline-block');
      dashboardButtons.forEach(btn => btn.style.display = 'inline-block');
      
      // Update user name elements
      userNameElements.forEach(el => {
        el.textContent = user.firstName || 'User';
      });
    } else {
      // Show login/signup buttons
      loginButtons.forEach(btn => btn.style.display = 'inline-block');
      signupButtons.forEach(btn => btn.style.display = 'inline-block');
      
      // Hide logout/dashboard buttons
      logoutButtons.forEach(btn => btn.style.display = 'none');
      dashboardButtons.forEach(btn => btn.style.display = 'none');
    }
  };
  
  // Handle login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errorMessage = document.getElementById('error-message');
      const loginButton = document.querySelector('button[type="submit"]');
      
      // Validate inputs
      if (!email || !password) {
        errorMessage.textContent = 'Please enter both email and password';
        errorMessage.style.display = 'block';
        return;
      }
      
      // Disable button and show loading state
      loginButton.disabled = true;
      loginButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';
      
      try {
        const response = await fetch(API_CONFIG.getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        // Save token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      } catch (error) {
        errorMessage.textContent = error.message || 'Login failed. Please try again.';
        errorMessage.style.display = 'block';
        
        // Reset button state
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
      }
    });
  }
  
  // Handle signup form submission
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const errorMessage = document.getElementById('error-message');
      const signupButton = document.querySelector('button[type="submit"]');
      
      // Validate inputs
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        errorMessage.textContent = 'Please fill in all fields';
        errorMessage.style.display = 'block';
        return;
      }
      
      if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.style.display = 'block';
        return;
      }
      
      // Disable button and show loading state
      signupButton.disabled = true;
      signupButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating account...';
      
      try {
        const response = await fetch(API_CONFIG.getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstName, lastName, email, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }
        
        // Save token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      } catch (error) {
        errorMessage.textContent = error.message || 'Registration failed. Please try again.';
        errorMessage.style.display = 'block';
        
        // Reset button state
        signupButton.disabled = false;
        signupButton.textContent = 'Create Account';
      }
    });
  }
  
  // Handle forgot password form submission
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const errorMessage = document.getElementById('error-message');
      const successMessage = document.getElementById('success-message');
      const submitButton = document.querySelector('button[type="submit"]');
      
      // Validate inputs
      if (!email) {
        errorMessage.textContent = 'Please enter your email address';
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        return;
      }
      
      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
      
      try {
        const response = await fetch(API_CONFIG.getApiUrl(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Request failed');
        }
        
        // Show success message
        errorMessage.style.display = 'none';
        successMessage.textContent = 'Password reset instructions have been sent to your email.';
        successMessage.style.display = 'block';
        
        // Reset form
        forgotPasswordForm.reset();
      } catch (error) {
        errorMessage.textContent = error.message || 'Request failed. Please try again.';
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
      } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = 'Reset Password';
      }
    });
  }
  
  // Handle reset password form submission
  const resetPasswordForm = document.getElementById('reset-password-form');
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (!token) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = 'Invalid or missing reset token';
        errorMessage.style.display = 'block';
        return;
      }
      
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const errorMessage = document.getElementById('error-message');
      const successMessage = document.getElementById('success-message');
      const submitButton = document.querySelector('button[type="submit"]');
      
      // Validate inputs
      if (!password || !confirmPassword) {
        errorMessage.textContent = 'Please enter both password fields';
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        return;
      }
      
      if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        return;
      }
      
      // Disable button and show loading state
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...';
      
      try {
        const response = await fetch(API_CONFIG.getApiUrl(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Password reset failed');
        }
        
        // Show success message
        errorMessage.style.display = 'none';
        successMessage.textContent = 'Password has been reset successfully. You can now login with your new password.';
        successMessage.style.display = 'block';
        
        // Add login link
        const loginLink = document.createElement('p');
        loginLink.innerHTML = '<a href="login.html" class="btn btn-primary mt-3">Go to Login</a>';
        successMessage.appendChild(loginLink);
        
        // Hide the form
        resetPasswordForm.style.display = 'none';
      } catch (error) {
        errorMessage.textContent = error.message || 'Password reset failed. Please try again.';
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
      } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = 'Update Password';
      }
    });
  }
  
  // Handle logout
  const logoutButtons = document.querySelectorAll('.logout-button');
  logoutButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to home page
      window.location.href = 'index.html';
    });
  });
  
  // Check authentication status on page load
  checkAuth();
});