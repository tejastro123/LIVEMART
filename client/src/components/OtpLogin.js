// client/src/components/OtpLogin.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const OtpLogin = ({ loadUser }) => {
//     const [phone, setPhone] = useState('');
//     const [otp, setOtp] = useState('');
//     const [step, setStep] = useState(1); // 1 for phone input, 2 for OTP input

//     const handleSendOtp = async (e) => {
//         e.preventDefault();
//         try {
//         await axios.post('/api/auth/generate-otp', { phone });
//         alert('OTP has been sent to your phone!');
//         setStep(2);
//         } catch (err) {
//         alert('Error: ' + err.response.data.msg);
//         }
//     };

//     const handleVerifyOtp = async (e) => {
//         e.preventDefault();
//         try {
//         const res = await axios.post('/api/auth/verify-otp', { phone, otp });
//         localStorage.setItem('token', res.data.token);
//         alert('Login Successful!');
//         loadUser();
//         } catch (err) {
//         alert('Error: ' + err.response.data.msg);
//         }
//     };

//     return (
//         <div>
//         {step === 1 && (
//             <form onSubmit={handleSendOtp}>
//             <h3>Login with OTP</h3>
//             <input
//                 type="text"
//                 placeholder="Phone Number (e.g., +91...)"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 required
//             />
//             <button type="submit">Send OTP</button>
//             </form>
//         )}

//         {step === 2 && (
//             <form onSubmit={handleVerifyOtp}>
//             <h3>Enter OTP</h3>
//             <p>An OTP was sent to {phone}.</p>
//             <input
//                 type="text"
//                 placeholder="6-Digit OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 required
//             />
//             <button type="submit">Verify & Login</button>
//             <button type="button" onClick={() => setStep(1)}>Back</button>
//             </form>
//         )}
//         </div>
//     );
// };

// export default OtpLogin;