// client/src/components/ui/PasswordStrength.js
import React from 'react';
import './PasswordStrength.css';

const PasswordStrength = ({ password }) => {
  const calculateStrength = (pwd) => {
    let strength = 0;
    if (!pwd) return { score: 0, label: '', color: '' };

    // Length check
    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;

    // Character variety checks
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;

    // Map strength to level
    if (strength <= 2) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (strength <= 4) return { score: 2, label: 'Fair', color: '#f59e0b' };
    if (strength <= 5) return { score: 3, label: 'Good', color: '#10b981' };
    return { score: 4, label: 'Strong', color: '#10b981' };
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="password-strength-bars">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`password-strength-bar ${level <= strength.score ? 'active' : ''}`}
            style={{ backgroundColor: level <= strength.score ? strength.color : undefined }}
          />
        ))}
      </div>
      <p className="password-strength-label" style={{ color: strength.color }}>
        {strength.label}
      </p>
    </div>
  );
};

export default PasswordStrength;
