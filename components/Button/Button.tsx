import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps
  extends Partial<ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>> {
  text: string;
  href?: string;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  text,
  onClick,
  href,
  className,
  variant = "primary",
  ...restProps
}) => {
  const getGradientClass = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-tl from-indigo-500 to-indigo-700";
      case "secondary":
        return "bg-gradient-to-tl from-purple-400 to-purple-600";
      default:
        return "bg-gradient-to-tl from-indigo-500 to-indigo-700";
    }
  };

  const baseClassName = `cursor-pointer drop-shadow-1xl py-2 px-4 ${getGradientClass()} text-white text-md rounded-md shadow focus:outline-none`;
  const combinedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={combinedClassName}
        {...restProps}
      >
        {text}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedClassName}
      {...restProps}
    >
      {text}
    </button>
  );
};

export default Button;
