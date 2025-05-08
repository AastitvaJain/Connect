import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <button
      className={`bg-blue-400 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-md transition duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;