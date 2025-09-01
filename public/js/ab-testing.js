/**
 * BlueRock Asset Management - A/B Testing Utility
 * This script implements A/B testing for conversion optimization
 */

class ABTesting {
    constructor() {
        this.tests = {};
        this.userSegment = this.getUserSegment();
        this.initFromStorage();
        this.trackPageView();
    }
    
    /**
     * Initialize tests from localStorage if available
     */
    initFromStorage() {
        try {
            const savedTests = localStorage.getItem('ab_tests');
            if (savedTests) {
                const parsedTests = JSON.parse(savedTests);
                // Only use saved tests if they're from the current session
                const lastUpdated = localStorage.getItem('ab_tests_updated');
                const daysSinceUpdate = lastUpdated ? (Date.now() - parseInt(lastUpdated)) / (1000 * 60 * 60 * 24) : null;
                
                // If tests were updated within the last 30 days, use them
                if (daysSinceUpdate !== null && daysSinceUpdate < 30) {
                    this.tests = parsedTests;
                    return;
                }
            }
            
            // If no valid tests found in storage, initialize with defaults
            this.initDefaultTests();
            this.saveToStorage();
        } catch (error) {
            console.error('Error initializing A/B tests from storage:', error);
            this.initDefaultTests();
        }
    }
    
    /**
     * Initialize default A/B tests
     */
    initDefaultTests() {
        // CTA Button Test
        this.tests.ctaButtonTest = {
            name: 'CTA Button Test',
            variants: [
                {
                    id: 'control',
                    name: 'Original Button',
                    styles: {
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        padding: '12px 25px',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        fontWeight: 'normal'
                    },
                    text: 'Get Started'
                },
                {
                    id: 'variant_1',
                    name: 'Bold Button',
                    styles: {
                        backgroundColor: '#ff6b35',
                        color: 'white',
                        padding: '14px 30px',
                        borderRadius: '5px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold'
                    },
                    text: 'Start Investing Now'
                },
                {
                    id: 'variant_2',
                    name: 'Outlined Button',
                    styles: {
                        backgroundColor: 'transparent',
                        color: 'var(--primary-color)',
                        padding: '12px 25px',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        border: '2px solid var(--primary-color)'
                    },
                    text: 'Begin Your Journey'
                }
            ],
            selectedVariant: null,
            impressions: {
                control: 0,
                variant_1: 0,
                variant_2: 0
            },
            conversions: {
                control: 0,
                variant_1: 0,
                variant_2: 0
            },
            targetSelector: '.cta-button, .hero-cta, .primary-cta'
        };
        
        // Hero Headline Test
        this.tests.heroHeadlineTest = {
            name: 'Hero Headline Test',
            variants: [
                {
                    id: 'control',
                    name: 'Original Headline',
                    text: 'Secure Your Financial Future with BlueRock'
                },
                {
                    id: 'variant_1',
                    name: 'Benefit-Focused Headline',
                    text: 'Grow Your Wealth by 15% Annually with BlueRock'
                },
                {
                    id: 'variant_2',
                    name: 'Question Headline',
                    text: 'Ready to Transform Your Financial Future?'
                }
            ],
            selectedVariant: null,
            impressions: {
                control: 0,
                variant_1: 0,
                variant_2: 0
            },
            conversions: {
                control: 0,
                variant_1: 0,
                variant_2: 0
            },
            targetSelector: '.hero-title, .main-headline, h1.hero-heading'
        };
        
        // Form Layout Test
        this.tests.formLayoutTest = {
            name: 'Form Layout Test',
            variants: [
                {
                    id: 'control',
                    name: 'Standard Form',
                    className: 'form-standard'
                },
                {
                    id: 'variant_1',
                    name: 'Compact Form',
                    className: 'form-compact'
                },
                {
                    id: 'variant_2',
                    name: 'Step-by-Step Form',
                    className: 'form-stepped'
                }
            ],
            selectedVariant: null,
            impressions: {
                control: 0,
                variant_1: 0,
                variant_2: 0
            },
            conversions: {
                control: 0,
                variant_1: 0,
                variant_2: 0
            },
            targetSelector: '.signup-form, .contact-form, .login-form'
        };
        
        // Select variants for each test based on user segment
        for (const testId in this.tests) {
            this.selectVariant(testId);
        }
    }
    
    /**
     * Save tests to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('ab_tests', JSON.stringify(this.tests));
            localStorage.setItem('ab_tests_updated', Date.now().toString());
        } catch (error) {
            console.error('Error saving A/B tests to storage:', error);
        }
    }
    
    /**
     * Get user segment (0-99) for consistent test assignment
     * @returns {number} User segment (0-99)
     */
    getUserSegment() {
        let segment = localStorage.getItem('user_segment');
        
        if (!segment) {
            // Generate a random segment (0-99)
            segment = Math.floor(Math.random() * 100);
            localStorage.setItem('user_segment', segment.toString());
        } else {
            segment = parseInt(segment);
        }
        
        return segment;
    }
    
    /**
     * Select a variant for a test based on user segment
     * @param {string} testId - The test ID
     * @returns {object} The selected variant
     */
    selectVariant(testId) {
        const test = this.tests[testId];
        
        if (!test) return null;
        
        // If a variant is already selected, return it
        if (test.selectedVariant) {
            return test.variants.find(v => v.id === test.selectedVariant);
        }
        
        // Determine which variant to show based on user segment
        const variantCount = test.variants.length;
        const segmentSize = 100 / variantCount;
        const variantIndex = Math.floor(this.userSegment / segmentSize);
        
        // Ensure index is within bounds
        const safeIndex = Math.min(variantIndex, variantCount - 1);
        const selectedVariant = test.variants[safeIndex];
        
        // Store the selected variant
        test.selectedVariant = selectedVariant.id;
        
        return selectedVariant;
    }
    
    /**
     * Apply all active tests to the page
     */
    applyTests() {
        // Apply each test
        for (const testId in this.tests) {
            this.applyTest(testId);
        }
    }
    
    /**
     * Apply a specific test to the page
     * @param {string} testId - The test ID
     */
    applyTest(testId) {
        const test = this.tests[testId];
        if (!test) return;
        
        const variant = this.getVariant(testId);
        if (!variant) return;
        
        // Find target elements
        const targetElements = document.querySelectorAll(test.targetSelector);
        if (targetElements.length === 0) return;
        
        // Apply variant to each target element
        targetElements.forEach(element => {
            // Track impression
            this.trackImpression(testId, variant.id);
            
            // Apply changes based on test type
            switch (testId) {
                case 'ctaButtonTest':
                    // Apply button styles and text
                    Object.assign(element.style, variant.styles);
                    element.textContent = variant.text;
                    
                    // Add click event listener for conversion tracking
                    element.addEventListener('click', () => {
                        this.trackConversion(testId, variant.id);
                    });
                    break;
                    
                case 'heroHeadlineTest':
                    // Update headline text
                    element.textContent = variant.text;
                    break;
                    
                case 'formLayoutTest':
                    // Add variant class and remove other variant classes
                    test.variants.forEach(v => {
                        element.classList.remove(v.className);
                    });
                    element.classList.add(variant.className);
                    
                    // Add form submission event listener for conversion tracking
                    element.addEventListener('submit', (e) => {
                        this.trackConversion(testId, variant.id);
                    });
                    break;
            }
            
            // Mark element as processed
            element.setAttribute('data-ab-applied', testId);
        });
    }
    
    /**
     * Get the selected variant for a test
     * @param {string} testId - The test ID
     * @returns {object} The selected variant
     */
    getVariant(testId) {
        const test = this.tests[testId];
        if (!test) return null;
        
        return test.variants.find(v => v.id === test.selectedVariant);
    }
    
    /**
     * Track an impression for a variant
     * @param {string} testId - The test ID
     * @param {string} variantId - The variant ID
     */
    trackImpression(testId, variantId) {
        const test = this.tests[testId];
        if (!test || !test.impressions[variantId]) return;
        
        test.impressions[variantId]++;
        this.saveToStorage();
        
        // Send analytics event
        this.sendAnalyticsEvent('ab_impression', {
            test_id: testId,
            variant_id: variantId
        });
    }
    
    /**
     * Track a conversion for a variant
     * @param {string} testId - The test ID
     * @param {string} variantId - The variant ID
     */
    trackConversion(testId, variantId) {
        const test = this.tests[testId];
        if (!test || !test.conversions[variantId]) return;
        
        test.conversions[variantId]++;
        this.saveToStorage();
        
        // Send analytics event
        this.sendAnalyticsEvent('ab_conversion', {
            test_id: testId,
            variant_id: variantId
        });
    }
    
    /**
     * Track a page view
     */
    trackPageView() {
        // Get current page
        const page = window.location.pathname.split('/').pop() || 'index.html';
        
        // Send analytics event
        this.sendAnalyticsEvent('page_view', {
            page: page
        });
    }
    
    /**
     * Send an analytics event
     * @param {string} eventName - The event name
     * @param {object} eventData - The event data
     */
    sendAnalyticsEvent(eventName, eventData) {
        // In a real implementation, this would send data to an analytics service
        // For this demo, we'll just log to console and store locally
        console.log('Analytics Event:', eventName, eventData);
        
        // Store event in localStorage
        try {
            const events = JSON.parse(localStorage.getItem('ab_events') || '[]');
            events.push({
                event: eventName,
                data: eventData,
                timestamp: Date.now()
            });
            
            // Keep only the last 100 events
            if (events.length > 100) {
                events.shift();
            }
            
            localStorage.setItem('ab_events', JSON.stringify(events));
        } catch (error) {
            console.error('Error storing analytics event:', error);
        }
    }
    
    /**
     * Get test results
     * @returns {object} Test results
     */
    getResults() {
        const results = {};
        
        for (const testId in this.tests) {
            const test = this.tests[testId];
            results[testId] = {
                name: test.name,
                variants: test.variants.map(variant => {
                    const impressions = test.impressions[variant.id] || 0;
                    const conversions = test.conversions[variant.id] || 0;
                    const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;
                    
                    return {
                        id: variant.id,
                        name: variant.name,
                        impressions: impressions,
                        conversions: conversions,
                        conversionRate: conversionRate.toFixed(2) + '%'
                    };
                })
            };
        }
        
        return results;
    }
    
    /**
     * Create a results dashboard
     * @returns {HTMLElement} The dashboard element
     */
    createDashboard() {
        const results = this.getResults();
        
        // Create dashboard container
        const dashboard = document.createElement('div');
        dashboard.className = 'ab-dashboard';
        dashboard.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 15px;
            max-width: 400px;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        
        // Create dashboard header
        const header = document.createElement('div');
        header.className = 'ab-dashboard-header';
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        `;
        
        const title = document.createElement('h3');
        title.textContent = 'A/B Testing Results';
        title.style.margin = '0';
        
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            color: #999;
        `;
        closeButton.addEventListener('click', () => {
            dashboard.remove();
        });
        
        header.appendChild(title);
        header.appendChild(closeButton);
        dashboard.appendChild(header);
        
        // Create test results
        for (const testId in results) {
            const testResult = results[testId];
            
            const testSection = document.createElement('div');
            testSection.className = 'ab-test-section';
            testSection.style.cssText = `
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #eee;
            `;
            
            const testTitle = document.createElement('h4');
            testTitle.textContent = testResult.name;
            testTitle.style.cssText = `
                margin: 0 0 10px 0;
                color: #333;
            `;
            
            testSection.appendChild(testTitle);
            
            // Create variant results table
            const table = document.createElement('table');
            table.style.cssText = `
                width: 100%;
                border-collapse: collapse;
                font-size: 13px;
            `;
            
            // Create table header
            const thead = document.createElement('thead');
            thead.innerHTML = `
                <tr>
                    <th style="text-align: left; padding: 5px; border-bottom: 1px solid #eee;">Variant</th>
                    <th style="text-align: right; padding: 5px; border-bottom: 1px solid #eee;">Impressions</th>
                    <th style="text-align: right; padding: 5px; border-bottom: 1px solid #eee;">Conversions</th>
                    <th style="text-align: right; padding: 5px; border-bottom: 1px solid #eee;">Rate</th>
                </tr>
            `;
            
            // Create table body
            const tbody = document.createElement('tbody');
            
            testResult.variants.forEach(variant => {
                const tr = document.createElement('tr');
                
                const nameTd = document.createElement('td');
                nameTd.textContent = variant.name;
                nameTd.style.cssText = `
                    padding: 5px;
                    border-bottom: 1px solid #f5f5f5;
                `;
                
                const impressionsTd = document.createElement('td');
                impressionsTd.textContent = variant.impressions;
                impressionsTd.style.cssText = `
                    text-align: right;
                    padding: 5px;
                    border-bottom: 1px solid #f5f5f5;
                `;
                
                const conversionsTd = document.createElement('td');
                conversionsTd.textContent = variant.conversions;
                conversionsTd.style.cssText = `
                    text-align: right;
                    padding: 5px;
                    border-bottom: 1px solid #f5f5f5;
                `;
                
                const rateTd = document.createElement('td');
                rateTd.textContent = variant.conversionRate;
                rateTd.style.cssText = `
                    text-align: right;
                    padding: 5px;
                    border-bottom: 1px solid #f5f5f5;
                    font-weight: bold;
                `;
                
                tr.appendChild(nameTd);
                tr.appendChild(impressionsTd);
                tr.appendChild(conversionsTd);
                tr.appendChild(rateTd);
                
                tbody.appendChild(tr);
            });
            
            table.appendChild(thead);
            table.appendChild(tbody);
            testSection.appendChild(table);
            
            dashboard.appendChild(testSection);
        }
        
        // Create footer with reset button
        const footer = document.createElement('div');
        footer.style.cssText = `
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
        `;
        
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Tests';
        resetButton.style.cssText = `
            background-color: #f44336;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
        `;
        resetButton.addEventListener('click', () => {
            localStorage.removeItem('ab_tests');
            localStorage.removeItem('ab_tests_updated');
            window.location.reload();
        });
        
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export Data';
        exportButton.style.cssText = `
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
        `;
        exportButton.addEventListener('click', () => {
            // Export test data as JSON
            const data = {
                tests: this.tests,
                events: JSON.parse(localStorage.getItem('ab_events') || '[]'),
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ab_testing_data.json';
            a.click();
            
            URL.revokeObjectURL(url);
        });
        
        footer.appendChild(resetButton);
        footer.appendChild(exportButton);
        dashboard.appendChild(footer);
        
        return dashboard;
    }
    
    /**
     * Show the results dashboard
     */
    showDashboard() {
        const dashboard = this.createDashboard();
        document.body.appendChild(dashboard);
    }
}

// Initialize A/B testing when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create global AB testing instance
    window.abTesting = new ABTesting();
    
    // Apply tests
    window.abTesting.applyTests();
    
    // Add keyboard shortcut to show dashboard (Ctrl+Shift+A)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            window.abTesting.showDashboard();
        }
    });
});

// Add CSS for form variants
(function() {
    const style = document.createElement('style');
    style.textContent = `
        /* Standard Form */
        .form-standard {
            display: block;
        }
        
        /* Compact Form */
        .form-compact {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .form-compact .form-group {
            flex: 1 1 calc(50% - 10px);
            min-width: 200px;
        }
        
        .form-compact .form-group.full-width {
            flex: 1 1 100%;
        }
        
        .form-compact button[type="submit"] {
            margin-top: 10px;
        }
        
        /* Stepped Form */
        .form-stepped .form-step {
            display: none;
        }
        
        .form-stepped .form-step.active {
            display: block;
        }
        
        .form-stepped .step-navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
    `;
    document.head.appendChild(style);
})();