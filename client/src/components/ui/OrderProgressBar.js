import React from 'react';

const OrderProgressBar = ({ status }) => {
  const statuses = ['Pending', 'Processing', 'In Transit', 'Delivered'];
  const currentIndex = statuses.indexOf(status);

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '8px' }}>
        {/* Progress line */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '0',
          right: '0',
          height: '4px',
          background: 'var(--glass-border)',
          zIndex: 0
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            width: `${(currentIndex / (statuses.length - 1)) * 100}%`,
            transition: 'width 0.5s ease'
          }} />
        </div>

        {statuses.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 1,
              position: 'relative'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: isCompleted
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'var(--glass-bg)',
                border: `2px solid ${isCompleted ? '#667eea' : 'var(--glass-border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isCompleted ? 'white' : 'var(--text-muted)',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                boxShadow: isCompleted ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {isCompleted ? '✓' : index + 1}
              </div>
              <span style={{
                fontSize: '0.7rem',
                marginTop: '6px',
                color: isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: isCurrent ? 'bold' : 'normal',
                textAlign: 'center'
              }}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderProgressBar;
