// BlueRock Asset Management - Animation and Enhanced UX Scripts

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize scroll reveal
    initScrollReveal();
    
    // Initialize number counters
    initCounters();
    
    // Initialize parallax effects
    initParallax();
    
    // Initialize mobile optimizations
    initMobileOptimizations();
});

// Animation Initialization
function initAnimations() {
    // Add fade-in animation to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.classList.add('fade-in');
    }
    
    // Add slide-up animation to section titles with staggered delay
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach((title, index) => {
        title.classList.add('slide-up');
        title.style.animationDelay = `${0.2 + (index * 0.1)}s`;
    });
    
    // Add scale-up animation to service cards with staggered delay
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.classList.add('scale-up', 'hover-lift');
        card.style.animationDelay = `${0.3 + (index * 0.15)}s`;
    });
    
    // Add slide-in animations to product cards with alternating directions
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        if (index % 2 === 0) {
            card.classList.add('slide-in-left', 'hover-lift');
        } else {
            card.classList.add('slide-in-right', 'hover-lift');
        }
        card.style.animationDelay = `${0.3 + (index * 0.15)}s`;
    });
    
    // Add pulse animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-accent');
    ctaButtons.forEach(button => {
        button.classList.add('pulse', 'btn-shimmer');
    });
    
    // Add floating animation to icons
    const icons = document.querySelectorAll('.fas, .fab');
    icons.forEach(icon => {
        if (icon.parentElement.tagName !== 'BUTTON') {
            icon.classList.add('float');
        }
    });
    
    // Add shine effect to cards
    const cards = document.querySelectorAll('.crypto-option, .investment-returns');
    cards.forEach(card => {
        card.classList.add('card-shine');
    });
}

// Scroll Reveal Initialization
function initScrollReveal() {
    // Add data-aos attributes to elements
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        section.setAttribute('data-aos', index % 2 === 0 ? 'fade-up' : 'fade-down');
    });
    
    const testimonials = document.querySelectorAll('.testimonial-card');
    testimonials.forEach((card, index) => {
        card.setAttribute('data-aos', 'fade-up');
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        item.setAttribute('data-aos', 'fade-right');
        item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Scroll event listener to trigger animations
    window.addEventListener('scroll', function() {
        const scrollElements = document.querySelectorAll('[data-aos]');
        scrollElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight * 0.9) {
                element.classList.add('aos-animate');
            }
        });
    });
    
    // Trigger scroll once to initialize
    window.dispatchEvent(new Event('scroll'));
}

// Number Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.count-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // ms
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                counter.classList.add('animate');
                setTimeout(() => {
                    counter.classList.remove('animate');
                    requestAnimationFrame(updateCounter);
                }, 50);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Parallax Effects
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 20;
            const moveX = (x - 0.5) * speed;
            const moveY = (y - 0.5) * speed;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

// Mobile Optimizations
function initMobileOptimizations() {
    // Improve mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('mobile-nav-active');
            this.classList.toggle('active');
            
            if (nav.classList.contains('mobile-nav-active')) {
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('mobile-nav-active') && 
                !nav.contains(e.target) && 
                e.target !== mobileMenuBtn) {
                nav.classList.remove('mobile-nav-active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('mobile-nav-active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Optimize tables for mobile
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('table-responsive');
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
    
    // Add touch support for hover effects
    const hoverElements = document.querySelectorAll('.hover-grow, .hover-lift');
    hoverElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    });
    
    // Optimize images for mobile
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.classList.add('ripple');
    
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add typing animation to hero heading
window.addEventListener('load', function() {
    const heroHeading = document.querySelector('.hero h1');
    if (heroHeading) {
        heroHeading.classList.add('typing-text');
    }
});

// Add gradient background to CTA sections
document.querySelectorAll('.cta').forEach(cta => {
    cta.classList.add('gradient-bg');
});

// Add glow effect to important elements
document.querySelectorAll('.product-card-header, .crypto-address').forEach(element => {
    element.classList.add('glow');
});

// Add animation to calculator results
function animateCalculatorResults() {
    const results = document.querySelectorAll('.calculator-results');
    results.forEach(result => {
        result.classList.add('scale-up');
    });
}

// Enhance form submissions with animation
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.classList.add('pulse');
            setTimeout(() => {
                submitBtn.classList.remove('pulse');
            }, 1000);
        }
        
        if (this.id === 'savings-calculator-form' || this.id === 'investment-calculator-form') {
            setTimeout(animateCalculatorResults, 300);
        }
    });
});

// Add scroll indicator
const scrollIndicator = document.createElement('div');
scrollIndicator.classList.add('scroll-indicator');
scrollIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
document.body.appendChild(scrollIndicator);

scrollIndicator.addEventListener('click', function() {
    const heroHeight = document.querySelector('.hero').offsetHeight;
    window.scrollTo({
        top: heroHeight,
        behavior: 'smooth'
    });
});

// Hide scroll indicator when scrolling down
window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
        scrollIndicator.classList.add('hide');
    } else {
        scrollIndicator.classList.remove('hide');
    }
});

// Add back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.classList.add('back-to-top');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTopBtn);

backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});