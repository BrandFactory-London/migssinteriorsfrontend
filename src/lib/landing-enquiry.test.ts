import { describe, expect, it } from "vitest";

import {
  checkAllLanding,
  checkLandingStep,
  EMPTY_LANDING_VALUES,
  firstLandingStepWithError,
  normalisePostcode,
} from "@/lib/landing-enquiry";
import { LANDING_PAGES, landingFormName } from "@/lib/landing-pages";

const valid = {
  timing: "3 to 6 months",
  postcode: "ig7 6aa",
  firstName: "Sam",
  phone: "07700 900123",
  email: "",
};

describe("landing enquiry rules", () => {
  it("accepts a complete answer with no email", () => {
    expect(checkAllLanding(valid)).toEqual({});
  });

  it("requires a timing from the list", () => {
    expect(checkLandingStep(1, { ...valid, timing: "" }).timing).toBeTruthy();
    expect(checkLandingStep(1, { ...valid, timing: "Tomorrow" }).timing).toBeTruthy();
  });

  it.each(["IG7 6AA", "n6", "N6 4AB", "EN4 0PA", "E18"])("accepts postcode %s", (postcode) => {
    expect(checkLandingStep(2, { ...valid, postcode }).postcode).toBeUndefined();
  });

  it.each(["", "hello", "12345"])("rejects postcode %j", (postcode) => {
    expect(checkLandingStep(2, { ...valid, postcode }).postcode).toBeTruthy();
  });

  it("requires name and a plausible phone, email optional but checked", () => {
    const errors = checkLandingStep(3, { ...valid, firstName: " ", phone: "123", email: "nope" });
    expect(Object.keys(errors).sort()).toEqual(["email", "firstName", "phone"]);
  });

  it("sends the visitor back to the earliest step with an error", () => {
    expect(firstLandingStepWithError(checkAllLanding(EMPTY_LANDING_VALUES))).toBe(1);
    expect(firstLandingStepWithError(checkAllLanding({ ...valid, phone: "" }))).toBe(3);
  });

  it("formats postcodes", () => {
    expect(normalisePostcode("ig76aa")).toBe("IG7 6AA");
    expect(normalisePostcode(" n6 ")).toBe("N6");
  });
});

describe("landing pages", () => {
  it("has the four pages with unique slugs", () => {
    const slugs = LANDING_PAGES.map((page) => page.slug);
    expect(slugs).toHaveLength(4);
    expect(new Set(slugs).size).toBe(4);
  });

  it("cross-links only to other landing pages or the resources hub", () => {
    for (const page of LANDING_PAGES) {
      for (const href of [page.otherRoom.href, page.otherArea.href]) {
        expect(LANDING_PAGES.some((p) => `/lp/${p.slug}` === href)).toBe(true);
        expect(href).not.toBe(`/lp/${page.slug}`);
      }
    }
  });

  it("names each page's leads for the CRM", () => {
    expect(landingFormName("bathrooms-chigwell-essex")).toBe(
      "Meta LP: Bathrooms, Chigwell & Essex",
    );
    expect(landingFormName("nope")).toBeNull();
  });

  it("never puts a pound sign in landing copy", () => {
    expect(JSON.stringify(LANDING_PAGES)).not.toContain("£");
  });
});
