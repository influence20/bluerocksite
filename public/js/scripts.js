// BlueRock Asset Management - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav');
    const body = document.body;
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('mobile-nav-active');
            body.classList.toggle('menu-active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (body.classList.contains('menu-active') && 
                !event.target.closest('nav') && 
                !event.target.closest('.mobile-menu-btn')) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('mobile-nav-active');
                body.classList.remove('menu-active');
            }
        });
    }
    
    // FAQ accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                // Toggle active class on question
                this.classList.toggle('active');
                
                // Toggle active class on answer
                const answer = this.nextElementSibling;
                answer.classList.toggle('active');
            });
        });
    }
    
    // Calculator tabs
    const calculatorTabs = document.querySelectorAll('.calculator-tab');
    const calculatorContents = document.querySelectorAll('.calculator-content');
    
    if (calculatorTabs.length > 0 && calculatorContents.length > 0) {
        calculatorTabs.forEach((tab, index) => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                calculatorTabs.forEach(tab => tab.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get data-tab attribute
                const tabId = this.getAttribute('data-tab');
                
                // Hide all calculator contents
                calculatorContents.forEach(content => content.classList.remove('active'));
                
                // Show selected calculator content
                document.getElementById(tabId + '-calculator').classList.add('active');
            });
        });
    }
    
    // Savings calculator
    const savingsCalculatorForm = document.getElementById('savings-calculator-form');
    
    if (savingsCalculatorForm) {
        savingsCalculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get input values
            const initialAmount = parseFloat(document.getElementById('initial-amount').value);
            const monthlyDeposit = parseFloat(document.getElementById('monthly-deposit').value);
            const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
            const years = parseInt(document.getElementById('years').value);
            
            // Calculate future value
            let futureValue = initialAmount;
            let totalDeposits = initialAmount;
            let totalInterest = 0;
            
            for (let i = 0; i < years * 12; i++) {
                futureValue = futureValue * (1 + interestRate / 12) + monthlyDeposit;
                totalDeposits += monthlyDeposit;
            }
            
            totalInterest = futureValue - totalDeposits;
            
            // Update results
            document.getElementById('savings-result-value').textContent = '$' + futureValue.toFixed(2);
            document.getElementById('savings-result-deposits').textContent = '$' + totalDeposits.toFixed(2);
            document.getElementById('savings-result-interest').textContent = '$' + totalInterest.toFixed(2);
            
            // Show results
            document.getElementById('savings-calculator-results').style.display = 'block';
        });
    }
    
    // Investment calculator
    const investmentCalculatorForm = document.getElementById('investment-calculator-form');
    
    if (investmentCalculatorForm) {
        investmentCalculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get input values
            const investmentAmount = parseFloat(document.getElementById('investment-amount').value);
            const returnRate = parseFloat(document.getElementById('return-rate').value) / 100;
            const investmentPeriod = parseInt(document.getElementById('investment-period').value);
            
            // Calculate future value
            const futureValue = investmentAmount * Math.pow(1 + returnRate, investmentPeriod);
            const totalReturns = futureValue - investmentAmount;
            
            // Update results
            document.getElementById('investment-result-value').textContent = '$' + futureValue.toFixed(2);
            document.getElementById('investment-result-principal').textContent = '$' + investmentAmount.toFixed(2);
            document.getElementById('investment-result-returns').textContent = '$' + totalReturns.toFixed(2);
            
            // Show results
            document.getElementById('investment-calculator-results').style.display = 'block';
        });
    }
    
    // Scroll to sections smoothly
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetSection = document.querySelector(href);
            
            if (targetSection) {
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('mobile-nav-active')) {
                    mobileMenuBtn.classList.remove('active');
                    navMenu.classList.remove('mobile-nav-active');
                    body.classList.remove('menu-active');
                }
                
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Ripple effect for buttons
    const rippleButtons = document.querySelectorAll('.ripple');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right');
    
    function checkIfInView() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
            
            if (isVisible) {
                element.classList.add('active');
            }
        });
    }
    
    // Check elements on load
    checkIfInView();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkIfInView);
    
    // Copy to clipboard functionality
    window.copyToClipboard = function(elementId) {
        const element = document.getElementById(elementId);
        const text = element.innerText;
        
        navigator.clipboard.writeText(text).then(() => {
            const button = element.nextElementSibling;
            const originalText = button.innerText;
            
            button.innerText = 'Copied!';
            
            setTimeout(() => {
                button.innerText = originalText;
            }, 2000);
        });
    };
    
    // Generate QR codes for crypto addresses
    const qrContainers = document.querySelectorAll('.qr-code');
    
    if (typeof QRCode !== 'undefined' && qrContainers.length > 0) {
        qrContainers.forEach(container => {
            const id = container.id.split('-')[0];
            const address = document.getElementById(id + '-address').innerText;
            
            const qr = new QRCode(container, {
                text: address,
                width: 128,
                height: 128,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });
        });
    }
    
    // Count up animation for numbers
    const countElements = document.querySelectorAll('.count-number');
    
    if (countElements.length > 0) {
        countElements.forEach(element => {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCount = () => {
                current += step;
                
                if (current < target) {
                    element.innerText = '$' + Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    element.innerText = '$' + target;
                }
            };
            
            // Start animation when element is in view
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCount();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }
});