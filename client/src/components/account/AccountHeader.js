// client/src/components/account/AccountHeader.js
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const AccountHeader = ({ user, quickActions = [] }) => {
  if (!user) return null;

  const avatarLetter = user.name?.charAt(0).toUpperCase() || 'U';
  const roleBadgeColors = {
    customer: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
    retailer: 'bg-secondary-500/20 text-secondary-400 border-secondary-500/30',
    wholesaler: 'bg-accent-500/20 text-accent-400 border-accent-500/30'
  };

  return (
    <div className="glass-panel p-6 rounded-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className="w-24 h-24 rounded-xl flex items-center justify-center text-4xl font-bold text-white shadow-glow animate-float"
            style={{
              background: 'var(--gradient-primary)',
              boxShadow: '0 0 30px var(--primary-glow)'
            }}
          >
            {avatarLetter}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-primary">{user.name}</h2>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${roleBadgeColors[user.role] || roleBadgeColors.customer}`}
            >
              {user.role?.toUpperCase()}
            </span>
          </div>
          <p className="text-secondary mb-4">{user.email}</p>

          {/* Loyalty Points - For Customers */}
          {user.role === 'customer' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <span className="text-2xl">✨</span>
              <span className="font-semibold">
                <span className="text-primary-400 text-xl">{user.loyaltyPoints || 0}</span>
                <span className="text-tertiary text-sm ml-1">Loyalty Points</span>
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            {quickActions.map((action, index) => (
              action.to ? (
                <Link key={index} to={action.to}>
                  <Button variant={action.variant || 'outline'} size="sm">
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </Button>
                </Link>
              ) : (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountHeader;
