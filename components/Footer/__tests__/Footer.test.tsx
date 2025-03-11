import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import Footer from "../Footer";

// Mock only the router, which is essential for the conditional rendering
jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

// We don't need to mock Next/Image in detail since we're not testing its behavior
// Just make it render something we can detect
jest.mock("next/image", () => ({
  __esModule: true,
  default: () => <div data-testid="logo-image" />,
}));

// Link doesn't need complex mocking either for basic tests
jest.mock("next/link", () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

import { NextRouter, useRouter } from "next/router";
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("Footer Component", () => {
  it("renders links when not in print mode", () => {
    mockUseRouter.mockReturnValue({ query: {} } as NextRouter);

    render(<Footer />);

    expect(screen.getByText("Github")).toBeInTheDocument();
    expect(screen.getByText("Linkedin")).toBeInTheDocument();
    expect(screen.getByTestId("logo-image")).toBeInTheDocument();
  });

  it("hides links in print mode", () => {
    mockUseRouter.mockReturnValue({
      query: { print: "true" },
    } as unknown as NextRouter);

    render(<Footer />);

    expect(screen.queryByText("Github")).not.toBeInTheDocument();
    expect(screen.queryByText("Linkedin")).not.toBeInTheDocument();
    expect(screen.getByTestId("logo-image")).toBeInTheDocument();
  });
});
