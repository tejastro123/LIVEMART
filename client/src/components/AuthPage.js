// client/src/components/AuthPage.js
import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import Card from './ui/Card';

const AuthPage = ({ loadUser }) => {
    const [activeTab, setActiveTab] = useState('login');

    return (
        <div className="page-wrapper flex items-center justify-center min-h-screen bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: 'url(/assets/auth-bg.jpg)' }}>
            {/* Enhanced Overlay with better blur */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-sm"></div>

            <div className="container relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-6">

                {/* Left Side: Welcome Message */}
                <div className="text-center md:text-left space-y-6 animate-slide-up">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                        <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                            Welcome to Live MART
                        </span>
                    </h1>
                    <p className="text-xl text-gray-200 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                        Experience the freshest local produce and daily essentials delivered to your doorstep.
                        Join our community of customers, retailers, and wholesalers.
                    </p>

                    <div className="hidden md:flex gap-6">
                        <div className="glass-panel p-6 rounded-2xl flex-1 text-center transform hover:-translate-y-1 transition-transform duration-300 hover:shadow-xl hover:shadow-primary-500/20">
                            <span className="text-3xl font-bold text-primary-400 block mb-1">100%</span>
                            <span className="text-sm text-gray-300 font-medium uppercase tracking-wider">Fresh Quality</span>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl flex-1 text-center transform hover:-translate-y-1 transition-transform duration-300 hover:shadow-xl hover:shadow-secondary-500/20">
                            <span className="text-3xl font-bold text-secondary-400 block mb-1">Fast</span>
                            <span className="text-sm text-gray-300 font-medium uppercase tracking-wider">Delivery</span>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl flex-1 text-center transform hover:-translate-y-1 transition-transform duration-300 hover:shadow-xl hover:shadow-accent-500/20">
                            <span className="text-3xl font-bold text-accent-400 block mb-1">24/7</span>
                            <span className="text-sm text-gray-300 font-medium uppercase tracking-wider">Support</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Forms - Enhanced Card */}
                <div className="w-full max-w-md mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <Card className="glass-card border-0 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/5 hover:shadow-primary-500/10 transition-shadow duration-500">
                        <div className="flex border-b border-white/10 relative">
                            {/*  Animated tab indicator */}
                            <div
                                className="absolute bottom-0 h-0.5 bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-300 ease-out"
                                style={{
                                    left: activeTab === 'login' ? '0%' : '50%',
                                    width: '50%'
                                }}
                            />
                            <button
                                className={`flex-1 p-4 text-center font-bold transition-all duration-300 ${activeTab === 'login'
                                    ? 'text-white bg-primary-600/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                onClick={() => setActiveTab('login')}
                            >
                                Login
                            </button>
                            <button
                                className={`flex-1 p-4 text-center font-bold transition-all duration-300 ${activeTab === 'register'
                                    ? 'text-white bg-primary-600/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                onClick={() => setActiveTab('register')}
                            >
                                Register
                            </button>
                        </div>

                        <div className="p-6 md:p-8">
                            {activeTab === 'login' ? (
                                <Login loadUser={loadUser} />
                            ) : (
                                <Register />
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;