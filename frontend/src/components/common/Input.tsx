import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, name, className = "", ...rest }, ref) => {
    const inputId = id ?? name;

    const classes = [
      "h-10 w-full rounded-lg border bg-surface px-3 text-body-md text-on-surface",
      "placeholder:text-secondary transition-shadow",
      error ? "border-error" : "border-border",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-label-md text-on-surface">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          className={classes}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        {error && <span className="text-body-sm text-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
