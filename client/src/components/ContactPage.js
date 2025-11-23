// client/src/components/ContactPage.js
import React, { useState } from 'react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
        alert('Thank you for contacting us! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
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
                top: '10%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 8s ease-in-out infinite',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '5%',
                width: '350px',
                height: '350px',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 10s ease-in-out infinite',
                animationDelay: '2s',
                zIndex: 0
            }}></div>

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                {/* Hero Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-slide-up">
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
                        Get In Touch
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    {/* Contact Information Cards */}
                    {[
                        {
                            icon: '📧',
                            title: 'Email Us',
                            info: 'support@livemart.example.com',
                            description: 'We\'ll respond within 24 hours'
                        },
                        {
                            icon: '📞',
                            title: 'Call Us',
                            info: '+1-XXX-XXX-XXXX',
                            description: 'Mon-Fri from 9am to 6pm'
                        },
                        {
                            icon: '📍',
                            title: 'Visit Us',
                            info: '123 Business Street',
                            description: 'New York, NY 10001'
                        }
                    ].map((contact, index) => (
                        <div
                            key={index}
                            className="glass-card"
                            style={{
                                padding: '2rem',
                                textAlign: 'center',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                animation: `slide-up-fade 0.6s ease-out ${index * 0.1}s backwards`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.borderColor = 'var(--primary-500)';
                                e.currentTarget.style.boxShadow = '0 0 30px var(--primary-glow)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'var(--border-primary)';
                                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                            }}
                        >
                            <div style={{
                                fontSize: '3rem',
                                marginBottom: '1rem',
                                filter: 'drop-shadow(0 0 10px var(--primary-glow))'
                            }}>
                                {contact.icon}
                            </div>
                            <h3 style={{
                                fontSize: '1.5rem',
                                marginBottom: '0.5rem',
                                color: 'var(--text-primary)'
                            }}>
                                {contact.title}
                            </h3>
                            <p style={{
                                fontSize: '1.125rem',
                                color: 'var(--primary-400)',
                                fontWeight: '600',
                                marginBottom: '0.5rem'
                            }}>
                                {contact.info}
                            </p>
                            <p style={{
                                fontSize: '0.875rem',
                                color: 'var(--text-tertiary)',
                                marginBottom: 0
                            }}>
                                {contact.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Contact Form Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '2rem',
                    alignItems: 'start'
                }}>
                    {/* Form */}
                    <div
                        className="glass-card"
                        style={{
                            padding: '2.5rem',
                            animation: 'slide-up-fade 0.6s ease-out 0.3s backwards'
                        }}
                    >
                        <h2 style={{
                            fontSize: '2rem',
                            marginBottom: '1.5rem',
                            color: 'var(--text-primary)'
                        }}>
                            Send us a Message
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: 'var(--text-secondary)',
                                    fontWeight: '500'
                                }}>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    placeholder="John Doe"
                                    style={{
                                        transform: focusedField === 'name' ? 'scale(1.02)' : 'scale(1)',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: 'var(--text-secondary)',
                                    fontWeight: '500'
                                }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    placeholder="john@example.com"
                                    style={{
                                        transform: focusedField === 'email' ? 'scale(1.02)' : 'scale(1)',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: 'var(--text-secondary)',
                                    fontWeight: '500'
                                }}>
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('subject')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    placeholder="How can we help?"
                                    style={{
                                        transform: focusedField === 'subject' ? 'scale(1.02)' : 'scale(1)',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: 'var(--text-secondary)',
                                    fontWeight: '500'
                                }}>
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    rows="5"
                                    placeholder="Tell us more about your inquiry..."
                                    style={{
                                        resize: 'vertical',
                                        transform: focusedField === 'message' ? 'scale(1.02)' : 'scale(1)',
                                        transition: 'all 0.3s ease'
                                    }}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    fontSize: '1.125rem',
                                    fontWeight: '600'
                                }}
                            >
                                Send Message ✨
                            </button>
                        </form>
                    </div>

                    {/* Additional Info */}
                    <div style={{ animation: 'slide-up-fade 0.6s ease-out 0.4s backwards' }}>
                        <div
                            className="glass-card"
                            style={{
                                padding: '2.5rem',
                                marginBottom: '1.5rem'
                            }}
                        >
                            <h3 style={{
                                fontSize: '1.5rem',
                                marginBottom: '1rem',
                                color: 'var(--text-primary)'
                            }}>
                                💬 Quick Support
                            </h3>
                            <p style={{
                                color: 'var(--text-secondary)',
                                marginBottom: '1rem'
                            }}>
                                For immediate assistance with your orders, you can raise a query directly with a retailer through your "My Queries" page in your account dashboard.
                            </p>
                            <a
                                href="/my-queries"
                                className="btn btn-secondary"
                                style={{ width: '100%', textAlign: 'center' }}
                            >
                                Go to My Queries
                            </a>
                        </div>

                        <div
                            className="glass-card"
                            style={{
                                padding: '2.5rem',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                                backdropFilter: 'blur(12px)'
                            }}
                        >
                            <h3 style={{
                                fontSize: '1.5rem',
                                marginBottom: '1rem',
                                color: 'var(--text-primary)'
                            }}>
                                🚀 Connect With Us
                            </h3>
                            <p style={{
                                color: 'var(--text-secondary)',
                                marginBottom: '1.5rem'
                            }}>
                                Follow us on social media for updates, promotions, and community support.
                            </p>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'center'
                            }}>
                                {['Twitter', 'Facebook', 'Instagram', 'LinkedIn'].map((social, idx) => (
                                    <button
                                        key={idx}
                                        className="btn btn-secondary"
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            padding: '0',
                                            borderRadius: '50%',
                                            fontSize: '1.25rem'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                                        }}
                                        title={social}
                                    >
                                        {['🐦', '👥', '📸', '💼'][idx]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;