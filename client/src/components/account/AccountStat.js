// client/src/components/account/AccountStat.js
import React from 'react';

const AccountStat = ({
  icon,
  label,
  value,
  trend,
  trendValue,
  color = 'primary'
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/30',
      text: 'text-primary-400',
      glow: '0 0 20px var(--primary-glow)'
    },
    secondary: {
      bg: 'bg-secondary-500/10',
      border: 'border-secondary-500/30',
      text: 'text-secondary-400',
      glow: '0 0 20px var(--secondary-glow)'
    },
    accent: {
      bg: 'bg-accent-500/10',
      border: 'border-accent-500/30',
      text: 'text-accent-400',
      glow: '0 0 20px var(--accent-glow)'
    }
  };

  const colors = colorClasses[color] || colorClasses.primary;

  const trendIcon = trend === 'up' ? '📈' : trend === 'down' ? '📉' : null;
  const trendColor = trend === 'up' ? 'text-secondary-400' : trend === 'down' ? 'text-red-400' : 'text-tertiary';

  return (
    <div
      className={`glass-card p-5 rounded-lg border-2 ${colors.border} ${colors.bg} transition-all hover:scale-105 cursor-default`}
      style={{ boxShadow: colors.glow }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{icon}</div>
        {trendIcon && trendValue && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
            <span>{trendIcon}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      <div className={`text-3xl font-bold mb-1 ${colors.text}`}>
        {value}
      </div>

      <div className="text-sm text-tertiary font-medium">
        {label}
      </div>
    </div>
  );
};

export default AccountStat;
