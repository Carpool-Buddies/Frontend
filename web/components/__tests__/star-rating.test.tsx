import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StarRating } from "@/components/star-rating";

describe("StarRating", () => {
  it("renders 5 stars", () => {
    render(<StarRating value={3} readOnly />);
    expect(screen.getByTestId("star-1")).toBeInTheDocument();
    expect(screen.getByTestId("star-5")).toBeInTheDocument();
  });

  it("calls onChange with the clicked star value", async () => {
    const onChange = vi.fn();
    render(<StarRating value={0} onChange={onChange} />);
    await userEvent.click(screen.getByTestId("star-4"));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("does not call onChange when readOnly", async () => {
    const onChange = vi.fn();
    render(<StarRating value={2} onChange={onChange} readOnly />);
    await userEvent.click(screen.getByTestId("star-5"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
