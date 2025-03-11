import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import Button from "../Button";

describe("Button component", () => {
  test("renders the button with the correct text", () => {
    render(<Button text="Click me" />);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test("applies the correct class names", () => {
    render(<Button text="Click me" />);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toHaveClass(
      "drop-shadow-1xl py-2 px-4 bg-gradient-to-tl from-indigo-500 to-indigo-700 text-white text-md rounded-md shadow focus:outline-none"
    );
  });

  test("calls the onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button text="Click me" onClick={handleClick} />);
    const buttonElement = screen.getByText(/click me/i);

    // Using userEvent instead of fireEvent
    await user.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("renders with the correct type attribute", () => {
    render(<Button text="Submit" type="submit" />);
    const buttonElement = screen.getByText(/submit/i);
    expect(buttonElement).toHaveAttribute("type", "submit");
  });

  test("renders with the default type attribute when not specified", () => {
    render(<Button text="Click me" />);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toHaveAttribute("type", "button");
  });
});
