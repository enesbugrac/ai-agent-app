import React, { ReactNode } from 'react';

interface SuccessMessageProps {
  title: string;
  message: string;
  icon?: ReactNode;
  className?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  icon = <div className="text-green-400 text-xl mb-2">✓</div>,
  className = ""
}) => {
  return (
    <div className={`text-center p-4 ${className}`}>
      {icon}
      <h3 className="text-white text-lg font-medium mb-2">
        {title}
      </h3>
      <p className="text-secondary text-sm">
        {message}
      </p>
    </div>
  );
};

export default SuccessMessage; 