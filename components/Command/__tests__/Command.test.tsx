import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";
import * as useSystemThemeModule from "react-use-system-theme";

import Command, { CommandProps } from "../Command";

// Mock the styles to avoid styled-jsx issues
jest.mock("../Command.styles", () => ({
  __esModule: true,
  default: "",
}));

// Mock the useSystemTheme hook
jest.mock("react-use-system-theme");
const mockUseSystemTheme = useSystemThemeModule.default as jest.MockedFunction<
  typeof useSystemThemeModule.default
>;

describe("Command Component", () => {
  const defaultProps: CommandProps = {
    code: "timesheet-gen edit -h 5 -d 8 -m 10 -y 2021",
    heading: "Initialise for current directory",
  };

  beforeEach(() => {
    mockUseSystemTheme.mockReset();
    mockUseSystemTheme.mockReturnValue("dark");
  });

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

  it("handles theme changes", () => {
    mockUseSystemTheme.mockReturnValue("dark");
    const { rerender } = render(<Command {...defaultProps} />);

    mockUseSystemTheme.mockReturnValue("light");
    rerender(<Command {...defaultProps} />);
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
