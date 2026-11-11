import React from "react";

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  as?: React.ElementType;
}

const SIZE_CLASSES = {
  sm: "max-w-4xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "w-full",
};

export default function PageContainer({
  children,
  className = "",
  size = "xl",
  as: Component = "div",
}: PageContainerProps) {
  return (
    <Component
      className={`mx-auto px-4 sm:px-6 lg:px-8 ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </Component>
  );
}
