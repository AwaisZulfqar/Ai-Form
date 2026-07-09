import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  as?: React.ElementType;
}

const Card: React.FC<CardProps> = ({
  hoverable = false,
  as: Component = "div",
  className = "",
  children,
  ...rest
}) => {
  const classes = [
    "bg-surface border border-border rounded-lg p-4",
    hoverable && "transition-shadow hover:shadow-card-hover",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};

export default Card;
