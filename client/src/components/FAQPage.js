// client/src/components/FAQPage.js
import React, { useState } from 'react';

const FAQPage = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const faqData = [
        {
            id: 1,
            category: 'Orders',
            question: 'How do I track my order?',
            answer: 'You can track your order status in real-time by visiting the "My Orders" section of your account. Once logged in, you\'ll see all your orders with their current status, estimated delivery date, and tracking number if available. You can also click on any order to see detailed tracking information.'
        },
        {
            id: 2,
            category: 'Loyalty',
            question: 'How do loyalty points work?',
            answer: 'You earn 1 loyalty point for every $10 spent on purchases. Points accumulate in your account and can be redeemed at checkout. Every 10 points can be redeemed for a $1 discount. Points never expire as long as your account remains active, and you can view your current balance in your account dashboard.'
        },
        {
            id: 3,
            category: 'Orders',
            question: 'Can I modify or cancel my order?',
            answer: 'Yes! You can modify or cancel your order within 2 hours of placing it. After that, your order enters processing and cannot be changed. To modify or cancel, go to "My Orders", find your order, and click the "Modify" or "Cancel" button. Refunds for cancelled orders are processed within 5-7 business days.'
        },
        {
            id: 4,
            category: 'Account',
            question: 'How do I reset my password?',
            answer: 'Click on "Forgot Password" on the login page. Enter your registered email address, and we\'ll send you a password reset link. The link is valid for 24 hours. If you don\'t receive the email, check your spam folder or contact support for assistance.'
        },
        {
            id: 5,
            category: 'Loyalty',
            question: 'Do loyalty points expire?',
            answer: 'No, your loyalty points never expire as long as your account remains active. However, if your account is inactive for more than 2 years (no purchases or logins), points may be forfeited. We\'ll send you email reminders before any points expiration.'
        },
        {
            id: 6,
            category: 'General',
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and bank transfers. All transactions are secured with SSL encryption to protect your financial information. You can also save your payment methods for faster checkout.'
        },
        {
            id: 7,
            category: 'Orders',
            question: 'What is your return policy?',
            answer: 'We offer a 30-day return policy for most items. Products must be unused, in original packaging, and with all tags attached. To initiate a return, go to "My Orders", select the order, and click "Return Items". We\'ll provide a prepaid shipping label, and refunds are processed within 5-7 business days of receiving the returned item.'
        },
        {
            id: 8,
            category: 'Account',
            question: 'How do I update my account information?',
            answer: 'Log into your account and navigate to "Account Settings". Here you can update your name, email, phone number, shipping addresses, and payment methods. Changes are saved automatically. For security reasons, you\'ll need to verify your password when updating sensitive information like email or password.'
        },
        {
            id: 9,
            category: 'General',
            question: 'How can I contact customer support?',
            answer: 'You can reach our customer support team through multiple channels: email us at support@livemart.example.com, call us at +1-XXX-XXX-XXXX (Mon-Fri, 9am-6pm), use the contact form on our Contact page, or raise a query through "My Queries" in your account. We typically respond within 24 hours.'
        },
        {
            id: 10,
            category: 'Orders',
            question: 'Do you offer international shipping?',
            answer: 'Currently, we ship to select international locations. During checkout, enter your shipping address to see if we deliver to your area. International orders typically take 10-15 business days and may be subject to customs fees and import duties, which are the customer\'s responsibility.'
        }
    ];

    const categories = ['All', 'General', 'Orders', 'Loyalty', 'Account'];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const filteredFAQs = faqData.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryColor = (category) => {
        const colors = {
            'General': 'var(--primary-500)',
            'Orders': 'var(--secondary-500)',
            'Loyalty': 'var(--accent-500)',
            'Account': '#a855f7'
        };
        return colors[category] || 'var(--primary-500)';
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '4rem 1.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Elements */}
            <div style={{
                position: 'absolute',
                top: '5%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                animation: 'pulse-glow 4s ease-in-out infinite',
                zIndex: 0
            }}></div>

            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-slide-up">
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: '800',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '1rem',
                        letterSpacing: '-0.02em'
                    }}>
                        Frequently Asked Questions
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        margin: '0 auto 2rem'
                    }}>
                        Find answers to common questions about our services, orders, and policies.
                    </p>

                    {/* Search Bar */}
                    <div style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        position: 'relative'
                    }}>
                        <input
                            type="text"
                            placeholder="🔍 Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1.5rem',
                                fontSize: '1.125rem',
                                borderRadius: 'var(--radius-xl)',
                                border: '2px solid var(--border-primary)',
                                background: 'var(--bg-card)',
                                backdropFilter: 'blur(12px)',
                                color: 'var(--text-primary)',
                                transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--primary-500)';
                                e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'var(--border-primary)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginBottom: '3rem'
                }}>
                    {categories.map((category, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveCategory(category)}
                            className="btn"
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: 'var(--radius-full)',
                                background: activeCategory === category
                                    ? 'var(--gradient-primary)'
                                    : 'var(--bg-tertiary)',
                                color: activeCategory === category
                                    ? 'white'
                                    : 'var(--text-secondary)',
                                border: activeCategory === category
                                    ? 'none'
                                    : '1px solid var(--border-primary)',
                                boxShadow: activeCategory === category
                                    ? '0 4px 15px var(--primary-glow)'
                                    : 'none',
                                transition: 'all 0.3s ease',
                                fontWeight: '600'
                            }}
                            onMouseEnter={(e) => {
                                if (activeCategory !== category) {
                                    e.currentTarget.style.borderColor = 'var(--primary-500)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeCategory !== category) {
                                    e.currentTarget.style.borderColor = 'var(--border-primary)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* FAQ Accordion */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredFAQs.length === 0 ? (
                        <div
                            className="glass-card"
                            style={{
                                padding: '3rem',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                            <h3 style={{
                                fontSize: '1.5rem',
                                color: 'var(--text-primary)',
                                marginBottom: '0.5rem'
                            }}>
                                No results found
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    ) : (
                        filteredFAQs.map((faq, index) => (
                            <div
                                key={faq.id}
                                className="glass-card"
                                style={{
                                    padding: 0,
                                    overflow: 'hidden',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    animation: `slide-up-fade 0.5s ease-out ${index * 0.05}s backwards`,
                                    borderColor: activeIndex === index ? 'var(--primary-500)' : 'var(--border-primary)'
                                }}
                                onMouseEnter={(e) => {
                                    if (activeIndex !== index) {
                                        e.currentTarget.style.borderColor = 'var(--primary-400)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (activeIndex !== index) {
                                        e.currentTarget.style.borderColor = 'var(--border-primary)';
                                    }
                                }}
                            >
                                {/* Question Header */}
                                <div
                                    onClick={() => toggleAccordion(index)}
                                    style={{
                                        padding: '1.5rem 2rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        transition: 'background 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    {/* Number Badge */}
                                    <div style={{
                                        minWidth: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${getCategoryColor(faq.category)}, ${getCategoryColor(faq.category)}dd)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        boxShadow: `0 4px 10px ${getCategoryColor(faq.category)}40`
                                    }}>
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            background: `${getCategoryColor(faq.category)}20`,
                                            color: getCategoryColor(faq.category),
                                            marginBottom: '0.5rem'
                                        }}>
                                            {faq.category}
                                        </div>
                                        <h4 style={{
                                            fontSize: '1.125rem',
                                            fontWeight: '600',
                                            color: 'var(--text-primary)',
                                            margin: 0
                                        }}>
                                            {faq.question}
                                        </h4>
                                    </div>

                                    {/* Chevron Icon */}
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'transform 0.3s ease',
                                        transform: activeIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                        color: 'var(--primary-400)',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold'
                                    }}>
                                        ▼
                                    </div>
                                </div>

                                {/* Answer Content */}
                                <div style={{
                                    maxHeight: activeIndex === index ? '500px' : '0',
                                    overflow: 'hidden',
                                    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}>
                                    <div style={{
                                        padding: '0 2rem 1.5rem 5rem',
                                        color: 'var(--text-secondary)',
                                        lineHeight: '1.7',
                                        fontSize: '1rem'
                                    }}>
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Still Have Questions Section */}
                <div
                    className="glass-card"
                    style={{
                        marginTop: '3rem',
                        padding: '2.5rem',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                        backdropFilter: 'blur(12px)'
                    }}
                >
                    <h3 style={{
                        fontSize: '1.75rem',
                        marginBottom: '1rem',
                        color: 'var(--text-primary)'
                    }}>
                        Still have questions? 💬
                    </h3>
                    <p style={{
                        color: 'var(--text-secondary)',
                        marginBottom: '1.5rem',
                        fontSize: '1.125rem'
                    }}>
                        Can't find what you're looking for? Our support team is here to help!
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <a href="/contact" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                            Contact Support
                        </a>
                        <a href="/my-queries" className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
                            My Queries
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;