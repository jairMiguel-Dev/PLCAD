import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'locked';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  size = 'md',
  disabled,
  ...props 
}) => {
  
  const baseStyle = "font-bold rounded-xl transition-all duration-200 transform active:translate-y-[4px] active:shadow-none flex items-center justify-center uppercase tracking-wide";
  
  const variants = {
    primary: "bg-brand text-white shadow-btn-primary hover:bg-brand-light",
    secondary: "bg-secondary text-white shadow-[0_4px_0_#A545EE] hover:bg-secondary-light",
    danger: "bg-danger text-white shadow-btn-danger hover:brightness-110",
    outline: "bg-white text-neutral-700 border-2 border-neutral-200 shadow-card hover:bg-neutral-100",
    ghost: "bg-transparent text-brand hover:bg-brand-dim shadow-none active:translate-y-0",
    locked: "bg-neutral-200 text-neutral-400 shadow-none cursor-not-allowed active:translate-y-0"
  };

  const sizes = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled || variant === 'locked' ? "opacity-100 cursor-not-allowed active:translate-y-0 active:shadow-none pointer-events-none" : "";

  // If locked, override variant styling slightly for visual consistency if passed explicitly
  const appliedVariant = disabled ? variants.locked : variants[variant];

  return (
    <button 
      className={`${baseStyle} ${appliedVariant} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};