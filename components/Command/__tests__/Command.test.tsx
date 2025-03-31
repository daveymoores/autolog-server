import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import Command, { CommandProps } from "../Command";

// Mock the styles to avoid styled-jsx issues
jest.mock("../Command.styles", () => ({
  __esModule: true,
  default: "",
}));

describe("Command Component", () => {
  const defaultProps: CommandProps = {
    code: "timesheet-gen edit -h 5 -d 8 -m 10 -y 2021",
    heading: "Initialise for current directory",
  };

  it("renders the heading correctly", () => {
    render(<Command {...defaultProps} />);
    expect(screen.getByText(defaultProps.heading)).toBeInTheDocument();
  });

  it("renders code with prefix", () => {
    render(<Command {...defaultProps} />);
    expect(screen.getByText(`> ${defaultProps.code}`)).toBeInTheDocument();
  });

  it("renders SVG button", () => {
    const { container } = render(<Command {...defaultProps} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders correctly with empty heading", () => {
    render(<Command code={defaultProps.code} heading="" />);
    const headingElement = screen.queryByRole("heading");
    expect(headingElement?.textContent).toBe("");
  });

  it("has basic component structure", () => {
    const { container } = render(<Command {...defaultProps} />);
    expect(container.querySelector("section")).toBeInTheDocument();
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("h3")).toBeInTheDocument();
    expect(container.querySelector("code")).toBeInTheDocument();
  });
});
