// client/src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from './ui/Button';
import Input from './ui/Input';
import PasswordStrength from './ui/PasswordStrength';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'customer',
        phone: '',
        latitude: '',
        longitude: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            setLocationLoading(true);
            navigator.geolocation.getCurrentPosition(
                position => {
                    setFormData({
                        ...formData,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    toast.success('Location captured!');
                    setLocationLoading(false);
                },
                () => {
                    toast.error('Could not get your location.');
                    setLocationLoading(false);
                }
            );
        } else {
            toast.error('Geolocation is not supported by this browser.');
        }
    };

    const { name, email, password, role, phone } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/register', formData);
            console.log('Registration successful:', res.data);
            toast.success('Registration successful! Please log in.');
        } catch (err) {
            console.error('Registration error:', err.response.data);
            toast.error('Error: ' + (err.response.data.msg || 'Registration failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <div className="text-center mb-2">
                <h3 className="text-2xl font-bold text-white mb-1">Create Account</h3>
                <p className="text-gray-400 text-sm">Join us to start your journey</p>
            </div>

            <div className="space-y-4">
                <Input
                    type="text"
                    label="Full Name"
                    placeholder="John Doe"
                    name="name"
                    value={name}
                    onChange={onChange}
                    required
                    floatingLabel={true}
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    }
                    className="mb-0"
                />
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
                <div>
                    <Input
                        type="password"
                        label="Password"
                        placeholder="Create a strong password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        minLength="6"
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
                    <PasswordStrength password={password} />
                </div>
                <Input
                    type="text"
                    label="Phone Number"
                    placeholder="+91 98765 43210"
                    name="phone"
                    value={phone}
                    onChange={onChange}
                    required
                    floatingLabel={true}
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    }
                    className="mb-0"
                />

                <div className="form-group">
                    <label className="block mb-2 text-sm font-medium text-gray-200">Account Type</label>
                    <div className="relative">
                        <select
                            name="role"
                            value={role}
                            onChange={onChange}
                            className="w-full p-3 rounded bg-gray-800/50 border-2 border-gray-600 text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all appearance-none cursor-pointer hover:border-primary-400 hover:bg-gray-700/50"
                        >
                            <option value="customer" className="bg-gray-900">🛒 Customer</option>
                            <option value="retailer" className="bg-gray-900">🏪 Retailer</option>
                            <option value="wholesaler" className="bg-gray-900">🏭 Wholesaler</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={handleGetLocation}
                disabled={locationLoading}
                className="w-full border-dashed border-2 border-gray-600 text-gray-300 hover:bg-white/5 hover:text-white hover:border-primary-500 transition-all"
            >
                {formData.latitude ? (
                    <span className="flex items-center justify-center gap-2 text-green-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Location Captured
                    </span>
                ) : locationLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Getting Location...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Get My Location
                    </span>
                )}
            </Button>

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
                        Creating Account...
                    </span>
                ) : (
                    'Create Account'
                )}
            </Button>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-500">Or sign up with</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
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
        </form>
    );
};

export default Register;