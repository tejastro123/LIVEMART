import React from 'react';
import './Card.css';

const Card = ({
  children,
  className = '',
  hover = true,
  glass = true,
  ...props
}) => {
  return (
    <div
      className={`
        card 
        ${glass ? 'card-glass' : 'card-solid'} 
        ${hover ? 'card-hover' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
