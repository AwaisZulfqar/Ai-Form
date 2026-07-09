import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  loading?: boolean;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-pink-700 text-white hover:bg-pink-600",
  secondary: "bg-surface text-primary border border-border hover:bg-background",
};

const SIZE_CLASSES: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-10",
  sm: "h-8",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const classes = [
    "inline-flex items-center justify-center gap-2 px-4 rounded-lg text-label-md font-semibold",
    "transition-colors focus-visible:outline-none",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    isDisabled && "opacity-50 cursor-not-allowed",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={isDisabled} {...rest}>
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
