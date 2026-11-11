import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANT_CLASSES = {
  primary:
    "bg-[#008081] hover:bg-[#006666] text-white shadow-sm hover:shadow-md border border-transparent",
  secondary:
    "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200",
  outline:
    "bg-transparent hover:bg-teal-50/60 text-[#008081] border border-[#008081]",
  ghost:
    "bg-transparent hover:bg-slate-100 text-slate-700 border border-transparent",
  accent:
    "bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border border-transparent shadow-sm",
};

const SIZE_CLASSES = {
  sm: "px-3.5 py-1.5 text-xs rounded-full gap-1.5",
  md: "px-5 py-2.5 text-xs sm:text-sm rounded-full gap-2",
  lg: "px-6 py-3.5 text-sm sm:text-base rounded-full gap-2.5 font-semibold",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = `inline-flex items-center justify-center font-bold transition-all cursor-pointer select-none active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${
    VARIANT_CLASSES[variant]
  } ${SIZE_CLASSES[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  const content = (
    <>
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={baseClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  );
}
