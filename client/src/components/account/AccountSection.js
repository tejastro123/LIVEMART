// client/src/components/account/AccountSection.js
import React from 'react';
import { Link } from 'react-router-dom';

const AccountSection = ({
  title,
  actionLabel,
  actionLink,
  actionOnClick,
  children,
  className = ''
}) => {
  return (
    <div className={`glass-panel p-6 rounded-lg animate-slide-up ${className}`}>
      {/* Section Header */}
      {(title || actionLabel) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-glass">
          {title && <h3 className="text-xl font-bold text-primary">{title}</h3>}
          {actionLabel && (
            actionLink ? (
              <Link
                to={actionLink}
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                {actionLabel} →
              </Link>
            ) : (
              <button
                onClick={actionOnClick}
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                {actionLabel}
              </button>
            )
          )}
        </div>
      )}

      {/* Section Content */}
      <div>
        {children}
      </div>
    </div>
  );
};

export default AccountSection;
