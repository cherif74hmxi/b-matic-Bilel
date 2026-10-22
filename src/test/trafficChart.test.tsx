import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import TrafficChart from "@/components/admin/TrafficChart";

const points = [
  { bucket: "2026-10-20T00:00:00", views: 10, visits: 4 },
  { bucket: "2026-10-21T00:00:00", views: 0, visits: 0 },
  { bucket: "2026-10-22T00:00:00", views: 6, visits: 3 },
];

describe("TrafficChart", () => {
  it("affiche le total puis le détail du point choisi au clavier", () => {
    render(<TrafficChart points={points} bucket="day" metric="visits" />);
    expect(screen.getByText("7 visites")).toBeInTheDocument();
    const plot = screen.getByRole("img");
    fireEvent.keyDown(plot, { key: "ArrowRight" });
    expect(screen.getByText("4 visites")).toBeInTheDocument();
    expect(screen.getByText(/10 pages vues/)).toBeInTheDocument();
  });
});
