import { describe, expect, it } from "vitest";
import { autoExcerpt, postPublishBlocker } from "@/lib/posts";
import { SLUG_MAX, withSuffix } from "@/lib/slug";

describe("actualités", () => {
  it("autoExcerpt coupe sur un mot et ajoute « … »", () => {
    expect(autoExcerpt("Court.")).toBe("Court.");
    const long = "Le contrôle technique change en 2026 : voici ce qu'il faut savoir avant de prendre rendez-vous au garage. ".repeat(3);
    const ex = autoExcerpt(long);
    expect(ex.length).toBeLessThanOrEqual(161);
    expect(ex.endsWith("…")).toBe(true);
    expect(ex).not.toMatch(/\s…$/);
  });
  it("publication refusée si le contenu est trop court", () => {
    expect(postPublishBlocker({ title: "Titre", content: "trop court" })).toMatch(/trop court/);
    expect(postPublishBlocker({ title: "Titre", content: "x".repeat(60) })).toBeNull();
  });
});

describe("withSuffix", () => {
  it("ajoute -n en restant dans la longueur maximale", () => {
    expect(withSuffix("golf-7", 2)).toBe("golf-7-2");
    const long = withSuffix("a".repeat(SLUG_MAX), 12);
    expect(long.length).toBe(SLUG_MAX);
    expect(long.endsWith("-12")).toBe(true);
    expect(withSuffix(`${"a".repeat(77)}-bb`, 2)).toBe(`${"a".repeat(77)}-2`);
  });
});
