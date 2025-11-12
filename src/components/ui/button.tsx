import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const base = "font-semibold rounded-lg transition-all active:scale-95";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
    outline:
      "border border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10",
    ghost:
      "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-700",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      {...props}
      className={clsx(base, variants[variant], sizes[size], className)}
    >
      {children}
    </button>
  );
};
