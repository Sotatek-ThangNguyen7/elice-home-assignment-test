import { render, screen, cleanup } from "@testing-library/react";
import HomePageDecr from "..";

afterEach(() => {
  cleanup();
});

describe("HomePageDecr component", () => {
  test("renders without crashing", () => {
    render(<HomePageDecr />);
  });

  test("toggles file tree on dropdown click", () => {
    render(<HomePageDecr />);
    const dropdownFile = screen.getByText("data");
    expect(dropdownFile).toBeInTheDocument();
  });

  test("changes active tab when clicked", () => {
    render(<HomePageDecr />);
    const tabMainPy = screen.getByTestId("text-test");
    expect(tabMainPy).toHaveStyle({
      fontSize: "16px",
      color: "#f8f8f8",
    });
  });
});
