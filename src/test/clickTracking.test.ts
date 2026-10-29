import { describe, expect, it } from "vitest";
import { classifyContactLink } from "@/lib/clickTracking";

const origin = "https://bmatic.be";

describe("classifyContactLink", () => {
  it("reconnaît les liens de contact", () => {
    expect(classifyContactLink("tel:+32470853551", origin)).toBe("phone");
    expect(classifyContactLink("mailto:bmatic63s@gmail.com", origin)).toBe("email");
    expect(classifyContactLink("https://wa.me/32470853551?text=Bonjour", origin)).toBe("whatsapp");
    expect(classifyContactLink("https://api.whatsapp.com/send?phone=32470853551", origin)).toBe("whatsapp");
  });

  it("compte les liens vers la réservation comme RDV", () => {
    expect(classifyContactLink("/rendez-vous", origin)).toBe("rdv");
    expect(classifyContactLink("https://bmatic.be/rendez-vous/?besoin=pare-brise", origin)).toBe("rdv");
  });

  it("ignore les autres liens", () => {
    expect(classifyContactLink("/contact", origin)).toBeNull();
    expect(classifyContactLink("https://autre-site.be/rendez-vous", origin)).toBeNull();
    expect(classifyContactLink("https://www.facebook.com/bmatic", origin)).toBeNull();
  });
});
