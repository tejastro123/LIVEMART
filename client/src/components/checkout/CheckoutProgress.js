// client/src/components/checkout/CheckoutProgress.js
import React from 'react';
import { Check, Package, CreditCard, Eye, CheckCircle } from 'lucide-react';
import './CheckoutProgress.css';

const STEPS = [
  { id: 1, name: 'Shipping', icon: Package, description: 'Delivery details' },
  { id: 2, name: 'Payment', icon: CreditCard, description: 'Payment method' },
  { id: 3, name: 'Review', icon: Eye, description: 'Review order' },
  { id: 4, name: 'Complete', icon: CheckCircle, description: 'Order placed' }
];

const CheckoutProgress = ({ currentStep, onStepClick }) => {
  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  const canNavigateToStep = (stepId) => {
    // Can only navigate to completed or current step
    return stepId <= currentStep;
  };

  return (
    <div className="checkout-progress">
      <div className="progress-container">
        {/* Progress Bar Background */}
        <div className="progress-bar-background" />

        {/* Active Progress Bar */}
        <div
          className="progress-bar-fill"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {STEPS.map((step, index) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          const isClickable = canNavigateToStep(step.id) && onStepClick && step.id !== currentStep;

          return (
            <div key={step.id} className="progress-step-wrapper">
              <button
                className={`progress-step ${status} ${isClickable ? 'clickable' : ''}`}
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                aria-label={`Step ${step.id}: ${step.name}`}
                aria-current={status === 'active' ? 'step' : undefined}
              >
                <div className="step-icon-wrapper">
                  {status === 'completed' ? (
                    <Check className="step-icon check-icon" size={20} />
                  ) : (
                    <Icon className="step-icon" size={20} />
                  )}
                </div>
                <div className="step-content">
                  <div className="step-name">{step.name}</div>
                  <div className="step-description">{step.description}</div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Mobile Progress */}
      <div className="progress-mobile">
        <div className="mobile-step-info">
          <span className="mobile-step-number">Step {currentStep} of {STEPS.length}</span>
          <span className="mobile-step-name">{STEPS[currentStep - 1]?.name}</span>
        </div>
        <div className="mobile-progress-bar">
          <div
            className="mobile-progress-fill"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutProgress;
