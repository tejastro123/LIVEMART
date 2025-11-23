import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, trend, trendValue, color }) => {
  return (
    <motion.div
      className="stats-card glass-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: 'var(--shadow-glow)' }}
      style={{
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>{title}</p>
          <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0, color: 'var(--text-primary)' }}>{value}</h3>
        </div>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `var(--${color}-500)`,
            opacity: 0.2,
            position: 'absolute',
            right: 'var(--space-6)',
            top: 'var(--space-6)'
          }}
        />
        <div
          style={{
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: `var(--${color}-400)`,
            position: 'relative',
            zIndex: 1
          }}
        >
          {icon}
        </div>
      </div>

      {trend && (
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '0.875rem' }}>
          <span style={{
            color: trend === 'up' ? 'var(--secondary-400)' : 'var(--accent-500)',
            display: 'flex',
            alignItems: 'center',
            fontWeight: '600'
          }}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
          <span style={{ color: 'var(--text-tertiary)' }}>vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
