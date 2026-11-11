import { describe, expect, it } from "vitest";

import {
  checkAll,
  checkStep,
  EMPTY_VALUES,
  type EnquiryValues,
  firstStepWithError,
  initialValues,
  isEnquiryFocus,
} from "@/lib/enquiry";

const valid: EnquiryValues = {
  ...EMPTY_VALUES,
  firstName: "Jane",
  phone: "07700 900123",
  email: "jane@example.com",
  projectType: "Bathroom",
};

describe("initialValues", () => {
  it("pre-selects the room from a service page", () => {
    expect(initialValues({ focus: "bathroom" }).projectType).toBe("Bathroom");
    expect(initialValues({ focus: "kitchen" }).projectType).toBe("Kitchen");
    expect(initialValues({ focus: "interior" }).projectType).toBe("Whole home");
  });

  it("pre-fills the town from a location page", () => {
    expect(initialValues({ town: "Chigwell, IG7" }).town).toBe("Chigwell, IG7");
  });

  it("starts empty with no context", () => {
    const values = initialValues();
    expect(values.projectType).toBe("");
    expect(values.town).toBe("");
    expect(values.budget).toBe("Not sure yet");
  });
});

describe("isEnquiryFocus", () => {
  it("accepts only the three service rooms", () => {
    expect(isEnquiryFocus("bathroom")).toBe(true);
    expect(isEnquiryFocus("garden")).toBe(false);
    expect(isEnquiryFocus(undefined)).toBe(false);
  });
});

describe("checkStep", () => {
  it("passes a complete step 1", () => {
    expect(checkStep(1, valid)).toEqual({});
  });

  it("requires name, phone and email on step 1", () => {
    expect(Object.keys(checkStep(1, EMPTY_VALUES)).sort()).toEqual([
      "email",
      "firstName",
      "phone",
    ]);
  });

  it.each(["07700 900123", "+44 7700 900123", "020 8243 2903", "(020) 8243-2903"])(
    "accepts the phone number %s",
    (phone) => {
      expect(checkStep(1, { ...valid, phone }).phone).toBeUndefined();
    },
  );

  it.each(["12345", "call me", "0770090012345678901"])(
    "rejects the phone number %s",
    (phone) => {
      expect(checkStep(1, { ...valid, phone }).phone).toBeDefined();
    },
  );

  it("rejects a malformed email", () => {
    expect(checkStep(1, { ...valid, email: "jane@" }).email).toBeDefined();
  });

  it("requires a known project type on step 2", () => {
    expect(checkStep(2, { ...valid, projectType: "" }).projectType).toBeDefined();
    expect(checkStep(2, { ...valid, projectType: "Garden" }).projectType).toBeDefined();
    expect(checkStep(2, valid)).toEqual({});
  });

  it("has nothing to check on step 3", () => {
    expect(checkStep(3, EMPTY_VALUES)).toEqual({});
  });
});

describe("firstStepWithError", () => {
  it("returns the earliest step with a problem", () => {
    expect(firstStepWithError(checkAll({ ...valid, projectType: "" }))).toBe(2);
    expect(firstStepWithError(checkAll({ ...valid, phone: "", projectType: "" }))).toBe(1);
    expect(firstStepWithError(checkAll(valid))).toBeNull();
  });
});
