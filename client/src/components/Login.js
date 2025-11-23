// client/src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import useAuthStore from '../store/useAuthStore';
import setAuthToken from '../utils/setAuthToken';
import Button from './ui/Button';
import Input from './ui/Input';

const Login = () => {
    const { loadUser } = useAuthStore();
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'

    // Email Login State
    const [formData, setFormData] = useState({ email: '', password: '' });

    // Phone Login State
    const [phoneStep, setPhoneStep] = useState('phone'); // 'phone' or 'otp'
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Email Submit
    const onEmailSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/login', formData);
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setAuthToken(res.data.token);
                toast.success('Login Successful!');
                await loadUser();
                navigate('/');
            } else {
                toast.info(res.data.msg);
                navigate('/verify-2fa', { state: { email: formData.email } });
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Phone Submit (Request OTP)
    const onPhoneSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post('/api/auth/generate-otp', { phone });
            setPhoneStep('otp');
            toast.success('OTP sent to your phone!');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    // OTP Submit (Verify)
    const onOtpSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/verify-otp', { phone, otp });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setAuthToken(res.data.token);
                toast.success('Login Successful!');
                await loadUser();
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="text-center mb-2">
                <h3 className="text-2xl font-bold text-white mb-1">
                    {loginMethod === 'email' ? 'Welcome Back' : (phoneStep === 'phone' ? 'Login with Phone' : 'Verify OTP')}
                </h3>
                <p className="text-gray-400 text-sm">
                    {loginMethod === 'email'
                        ? 'Enter your credentials to access your account'
                        : (phoneStep === 'phone' ? 'Enter your registered phone number' : `Enter the code sent to ${phone}`)}
                </p>
            </div>

            {loginMethod === 'email' ? (
                <form onSubmit={onEmailSubmit} className="space-y-4">
                    <Input
                        type="email"
                        label="Email Address"
                        placeholder="name@example.com"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                        floatingLabel={true}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        }
                        className="mb-0"
                    />
                    <Input
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        floatingLabel={true}
                        showPasswordToggle={true}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        }
                        className="mb-0"
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition-colors group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer transition-all"
                            />
                            <span className="select-none">Remember me</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => toast.info('Forgot password feature coming soon!')}
                            className="text-primary-400 hover:text-primary-300 transition-colors bg-transparent border-none p-0 cursor-pointer font-medium"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 text-lg font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </span>
                        ) : 'Sign In'}
                    </Button>
                </form>
            ) : (
                // Phone Login UI
                <form onSubmit={phoneStep === 'phone' ? onPhoneSubmit : onOtpSubmit} className="space-y-4">
                    {phoneStep === 'phone' ? (
                        <Input
                            type="tel"
                            label="Phone Number"
                            placeholder="+1234567890"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            floatingLabel={true}
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            }
                        />
                    ) : (
                        <div className="space-y-4">
                            <Input
                                type="text"
                                label="OTP Code"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                floatingLabel={true}
                                icon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                }
                            />
                            <button
                                type="button"
                                onClick={() => setPhoneStep('phone')}
                                className="text-sm text-primary-400 hover:text-primary-300 w-full text-right"
                            >
                                Change Phone Number
                            </button>
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 text-lg font-semibold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {phoneStep === 'phone' ? 'Sending OTP...' : 'Verifying...'}
                            </span>
                        ) : (phoneStep === 'phone' ? 'Send OTP' : 'Verify & Login')}
                    </Button>
                </form>
            )}

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-500">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                        setLoginMethod(loginMethod === 'email' ? 'phone' : 'email');
                        setPhoneStep('phone');
                    }}
                    className="w-full border-gray-600 text-gray-300 hover:bg-white/5 hover:text-white hover:border-primary-500 transition-all"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {loginMethod === 'email' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        )}
                    </svg>
                    {loginMethod === 'email' ? 'Login with Phone' : 'Login with Email'}
                </Button>

                <a href="http://localhost:5000/api/auth/google/login" className="block">
                    <Button
                        variant="outline"
                        type="button"
                        className="w-full border-gray-600 text-gray-300 hover:bg-white/5 hover:text-white hover:border-primary-500 transition-all"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                        </svg>
                        Google
                    </Button>
                </a>
            </div>
        </div>
    );
};

export default Login;
