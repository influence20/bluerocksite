/**
 * BlueRock Asset Management - Structured Data
 * This script adds JSON-LD structured data to improve SEO
 */

document.addEventListener('DOMContentLoaded', function() {
    // Determine which page we're on
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop() || 'index.html';
    
    // Add organization schema to all pages
    addOrganizationSchema();
    
    // Add page-specific schema
    switch (pageName) {
        case 'index.html':
            addHomePageSchema();
            break;
        case 'investment-plans.html':
            addInvestmentPlansSchema();
            break;
        case 'blog.html':
            addBlogSchema();
            break;
        case 'blog-post.html':
            addBlogPostSchema();
            break;
        case 'support.html':
            addSupportSchema();
            break;
        case 'faq.html':
            addFAQSchema();
            break;
        default:
            // For other pages, just add breadcrumb
            addBreadcrumbSchema();
            break;
    }
});

/**
 * Add Organization schema to the page
 */
function addOrganizationSchema() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "FinancialService",
        "name": "BlueRock Asset Management",
        "url": "https://www.bluerockasset.com",
        "logo": "https://www.bluerockasset.com/images/logo.png",
        "sameAs": [
            "https://www.facebook.com/bluerockasset",
            "https://www.twitter.com/bluerockasset",
            "https://www.linkedin.com/company/bluerockasset"
        ],
        "description": "BlueRock Asset Management provides premium investment and asset management services to help clients achieve their financial goals.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Financial District",
            "addressLocality": "New York",
            "addressRegion": "NY",
            "postalCode": "10004",
            "addressCountry": "US"
        },
        "telephone": "+1-800-555-0123",
        "email": "info@bluerockasset.com",
        "openingHours": "Mo,Tu,We,Th,Fr 09:00-17:00",
        "areaServed": {
            "@type": "Country",
            "name": "United States"
        },
        "priceRange": "$$$"
    };
    
    addSchemaToPage(organizationSchema);
}

/**
 * Add Home Page specific schema
 */
function addHomePageSchema() {
    const homePageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "BlueRock Asset Management - Premium Investment Services",
        "description": "BlueRock Asset Management provides premium investment and asset management services to help clients achieve their financial goals.",
        "url": "https://www.bluerockasset.com",
        "mainEntity": {
            "@type": "Service",
            "name": "Investment Management",
            "description": "Professional investment management services tailored to your financial goals.",
            "provider": {
                "@type": "FinancialService",
                "name": "BlueRock Asset Management"
            },
            "serviceType": "Investment Management",
            "areaServed": {
                "@type": "Country",
                "name": "United States"
            }
        }
    };
    
    addSchemaToPage(homePageSchema);
    addBreadcrumbSchema();
}

/**
 * Add Investment Plans specific schema
 */
function addInvestmentPlansSchema() {
    const investmentPlansSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "BlueRock Investment Plans",
        "description": "Premium investment plans designed to maximize returns and minimize risk.",
        "offers": [
            {
                "@type": "Offer",
                "name": "Starter Plan",
                "description": "Entry-level investment plan with balanced risk profile.",
                "price": "300",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "name": "Growth Plan",
                "description": "Mid-level investment plan focused on capital growth.",
                "price": "1000",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            },
            {
                "@type": "Offer",
                "name": "Premium Plan",
                "description": "High-level investment plan for maximum returns.",
                "price": "5000",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            }
        ]
    };
    
    addSchemaToPage(investmentPlansSchema);
    addBreadcrumbSchema(['Investment Plans']);
}

/**
 * Add Blog specific schema
 */
function addBlogSchema() {
    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "BlueRock Asset Management Blog",
        "description": "Financial insights, market updates, and investment strategies from BlueRock Asset Management experts.",
        "url": "https://www.bluerockasset.com/blog.html",
        "publisher": {
            "@type": "Organization",
            "name": "BlueRock Asset Management",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.bluerockasset.com/images/logo.png"
            }
        }
    };
    
    addSchemaToPage(blogSchema);
    addBreadcrumbSchema(['Blog']);
}

/**
 * Add Blog Post specific schema
 */
function addBlogPostSchema() {
    // Try to extract blog post information from the page
    const title = document.querySelector('h1')?.textContent || 'Investment Strategies for 2025';
    const datePublished = document.querySelector('.post-date')?.textContent || '2025-08-15';
    const author = document.querySelector('.post-author')?.textContent || 'Financial Expert';
    const image = document.querySelector('.post-image')?.src || 'https://www.bluerockasset.com/images/blog/investment-strategies.jpg';
    
    const blogPostSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "name": title,
        "description": "Learn about the latest investment strategies for maximizing returns in the current market conditions.",
        "datePublished": datePublished,
        "dateModified": datePublished,
        "author": {
            "@type": "Person",
            "name": author
        },
        "publisher": {
            "@type": "Organization",
            "name": "BlueRock Asset Management",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.bluerockasset.com/images/logo.png"
            }
        },
        "image": {
            "@type": "ImageObject",
            "url": image,
            "width": "1200",
            "height": "630"
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
        }
    };
    
    addSchemaToPage(blogPostSchema);
    addBreadcrumbSchema(['Blog', 'Investment Strategies for 2025']);
}

/**
 * Add Support page specific schema
 */
function addSupportSchema() {
    const supportSchema = {
        "@context": "https://schema.org",
        "@type": "CustomerService",
        "name": "BlueRock Asset Management Customer Support",
        "description": "Get help with your BlueRock Asset Management account and investments.",
        "telephone": "+1-800-555-0123",
        "email": "support@bluerockasset.com",
        "availableLanguage": {
            "@type": "Language",
            "name": "English"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-800-555-0123",
            "contactType": "customer service",
            "availableLanguage": ["English"],
            "contactOption": "TollFree",
            "hoursAvailable": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                ],
                "opens": "09:00",
                "closes": "17:00"
            }
        }
    };
    
    addSchemaToPage(supportSchema);
    addBreadcrumbSchema(['Support']);
}

/**
 * Add FAQ specific schema
 */
function addFAQSchema() {
    // Try to extract FAQ items from the page
    const faqItems = [];
    const faqElements = document.querySelectorAll('.faq-item');
    
    if (faqElements.length > 0) {
        faqElements.forEach(item => {
            const question = item.querySelector('.faq-question')?.textContent;
            const answer = item.querySelector('.faq-answer')?.textContent;
            
            if (question && answer) {
                faqItems.push({
                    "@type": "Question",
                    "name": question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": answer
                    }
                });
            }
        });
    } else {
        // Default FAQ items if none found on page
        faqItems.push(
            {
                "@type": "Question",
                "name": "What is the minimum investment amount?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The minimum investment amount is $300 for our Starter Plan."
                }
            },
            {
                "@type": "Question",
                "name": "How do I withdraw my funds?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can request a withdrawal through your dashboard. Withdrawals are typically processed within 1-3 business days."
                }
            },
            {
                "@type": "Question",
                "name": "What are the fees for investment management?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our fees range from 0.5% to 1.5% annually, depending on the investment plan and amount invested."
                }
            }
        );
    }
    
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems
    };
    
    addSchemaToPage(faqSchema);
    addBreadcrumbSchema(['FAQ']);
}

/**
 * Add Breadcrumb schema to the page
 * @param {Array} items - Array of breadcrumb items (excluding Home)
 */
function addBreadcrumbSchema(items = []) {
    const breadcrumbItems = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.bluerockasset.com"
        }
    ];
    
    // Add additional items
    items.forEach((item, index) => {
        breadcrumbItems.push({
            "@type": "ListItem",
            "position": index + 2,
            "name": item,
            "item": `https://www.bluerockasset.com/${item.toLowerCase().replace(/\s+/g, '-')}.html`
        });
    });
    
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems
    };
    
    addSchemaToPage(breadcrumbSchema);
}

/**
 * Add schema to the page
 * @param {Object} schema - The schema object to add
 */
function addSchemaToPage(schema) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}