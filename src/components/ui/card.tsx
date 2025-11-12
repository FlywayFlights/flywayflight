import React from "react";
import clsx from "clsx";

export const Card: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div
    className={clsx(
      "bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all",
      className
    )}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="p-4 border-b border-gray-100">{children}</div>;

export const CardContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="p-4">{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="p-4 border-t border-gray-100">{children}</div>;
