import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import React from "react";

import Input from "../Input";

// Mock the styles to avoid styled-jsx issues
jest.mock("../Input.styles", () => ({
  __esModule: true,
  default: "",
}));

describe("Input Component", () => {
  it("renders an input element", () => {
    const { container } = render(<Input />);
    const inputElement = container.querySelector("input");
    expect(inputElement).toBeInTheDocument();
  });

  it("has type of text", () => {
    const { container } = render(<Input />);
    const inputElement = container.querySelector("input");
    expect(inputElement).toHaveAttribute("type", "text");
  });

  it("has the correct class name", () => {
    const { container } = render(<Input />);
    const inputElement = container.querySelector("input");
    expect(inputElement).toHaveClass("t-gen--cell");
  });
});
