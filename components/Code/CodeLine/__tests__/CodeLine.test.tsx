import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import React from "react";

import CodeLine from "../CodeLine";

describe("CodeLine component", () => {
  // Test 1: Component renders correctly
  test("renders a command with proper structure", () => {
    const { container } = render(
      <CodeLine command="git commit -m 'message'" />
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  // Test 2: Check dollar sign rendering
  test("renders a dollar sign at the beginning", () => {
    const { getByText } = render(<CodeLine command="any command" />);
    const dollarSign = getByText("$");
    expect(dollarSign).toHaveClass("text-green-300");
  });

  // Test 3: Verify color coding for first word
  test("applies rose-500 color to the first command word", () => {
    const { getByText } = render(<CodeLine command="git status" />);
    const firstWord = getByText("git");
    expect(firstWord).toHaveClass("text-rose-500");
  });

  // Test 4: Verify color coding for second word
  test("applies rose-200 color to the second command word", () => {
    const { getByText } = render(<CodeLine command="git commit" />);
    const secondWord = getByText("commit");
    expect(secondWord).toHaveClass("text-rose-200");
  });

  // Test 5: Verify color coding for remaining words
  test("applies green-100 color to remaining command words", () => {
    const { getByText } = render(<CodeLine command="git commit -m 'test'" />);
    const thirdWord = getByText("-m");
    const fourthWord = getByText("'test'");
    expect(thirdWord).toHaveClass("text-green-100");
    expect(fourthWord).toHaveClass("text-green-100");
  });

  // Test 6: Test with empty command
  test("renders correctly with empty command", () => {
    const { container } = render(<CodeLine command="" />);
    const rootElement = container.firstChild;
    expect(rootElement).toBeInTheDocument();
    expect(rootElement?.textContent?.trim()).toBe("$");
  });

  // Test 7: Test with single word command
  test("renders correctly with a single word command", () => {
    const { getByText } = render(<CodeLine command="ls" />);
    const firstWord = getByText("ls");
    expect(firstWord).toHaveClass("text-rose-500");
  });

  // Test 8: Test with multi-word command
  test("parses and renders a complex command correctly", () => {
    const complexCommand = "docker run -it --rm -p 8080:8080 myimage:latest";
    const { getByText } = render(<CodeLine command={complexCommand} />);

    expect(getByText("docker")).toHaveClass("text-rose-500");
    expect(getByText("run")).toHaveClass("text-rose-200");
    expect(getByText("-it")).toHaveClass("text-green-100");
    expect(getByText("--rm")).toHaveClass("text-green-100");
    expect(getByText("-p")).toHaveClass("text-green-100");
    expect(getByText("8080:8080")).toHaveClass("text-green-100");
    expect(getByText("myimage:latest")).toHaveClass("text-green-100");
  });

  // Test 9: Test with very long command
  test("handles very long commands appropriately", () => {
    const longCommand =
      "npm install --save-dev @testing-library/react @testing-library/jest-dom typescript ts-jest";
    const { getByText } = render(<CodeLine command={longCommand} />);

    expect(getByText("npm")).toHaveClass("text-rose-500");
    expect(getByText("typescript")).toHaveClass("text-green-100");
  });

  // Test 10: Verify font styling
  test("uses monospace font", () => {
    const { container } = render(<CodeLine command="test" />);
    const rootElement = container.firstChild;
    expect(rootElement).toHaveClass("font-mono");
  });
});
