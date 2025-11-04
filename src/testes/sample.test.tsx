import { render, screen } from "@testing-library/react";

function Hello() {
  return <h1>Hello World</h1>;
}

test("renderiza Hello World", () => {
  render(<Hello />);
  expect(screen.getByText("Hello World")).toBeInTheDocument();
});
