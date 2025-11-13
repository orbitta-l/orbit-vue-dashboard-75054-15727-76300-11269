import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";

function Hello() {
  return <h1>Hello World</h1>;
}

test("renderiza Hello World", () => {
  render(<Hello />);
  expect(screen.getByText("Hello World")).toBeInTheDocument();
});