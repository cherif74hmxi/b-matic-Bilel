import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";

// insertPublicRow est simulé : on vérifie les lignes envoyées à page_views.
const insertPublicRow = vi.fn<(table: string, row: Record<string, unknown>) => Promise<boolean>>();
vi.mock("@/lib/publicInsert", () => ({ insertPublicRow: (t: string, r: Record<string, unknown>) => insertPublicRow(t, r) }));
const { default: PageViewTracker } = await import("@/components/PageViewTracker");
const { getSessionId } = await import("@/lib/attribution");

const Aller = () => {
  const navigate = useNavigate();
  return <button onClick={() => navigate("/contact")}>aller</button>;
};

afterEach(() => {
  vi.unstubAllEnvs();
  insertPublicRow.mockReset();
  sessionStorage.clear();
});

describe("PageViewTracker", () => {
  it("numéro de visite sur chaque vue, campagne sur la vue d'entrée seulement, repli si la base refuse", async () => {
    vi.stubEnv("DEV", false);
    sessionStorage.setItem("bmatic-attribution", JSON.stringify({ utm_source: "google", gclid: "abc", referrer: "https://www.google.com/", landing_path: "/pare-brise" }));
    // Vue d'entrée refusée (colonnes absentes) puis acceptée sans elles ; vue suivante acceptée.
    insertPublicRow.mockResolvedValueOnce(false).mockResolvedValue(true);

    render(
      <MemoryRouter initialEntries={["/pare-brise"]}>
        <PageViewTracker trackedPaths={["/pare-brise", "/contact"]} />
        <Aller />
      </MemoryRouter>,
    );
    await waitFor(() => expect(insertPublicRow).toHaveBeenCalledTimes(2));
    fireEvent.click(screen.getByText("aller"));
    await waitFor(() => expect(insertPublicRow).toHaveBeenCalledTimes(3));

    const [entree, repli, suivante] = insertPublicRow.mock.calls.map(([, row]) => row);
    const id = getSessionId();
    expect(entree).toEqual({ path: "/pare-brise", referrer: null, entry: true, session_id: id, utm_source: "google", gclid: "abc" });
    expect(repli).toEqual({ path: "/pare-brise", referrer: null, entry: true });
    expect(suivante).toEqual({ path: "/contact", referrer: null, entry: false, session_id: id });
  });
});
