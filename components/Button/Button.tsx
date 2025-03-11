import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends Partial<ButtonHTMLAttributes<HTMLButtonElement>> {
  text: string;
}

const Button: React.FC<ButtonProps> = ({ type = "button", text, onClick }) => (
  <button
    type={type}
    onClick={onClick}
    className="drop-shadow-1xl py-2 px-4 bg-gradient-to-tl from-indigo-500 to-indigo-700 text-white text-md rounded-md shadow focus:outline-none"
  >
    {text}
  </button>
);

export default Button;
