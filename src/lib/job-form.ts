/**
 * The Job Form's option values, exactly as Wix defines them.
 *
 * Kept outside `lib/wix/forms.ts` (which is server-only) because the
 * application form renders these options in the browser. Any value sent to
 * Wix that is not in these lists fails the whole submission.
 */
export const JOB_EXPERIENCE = ["5-10 years", "10-14 years", "14 years +"];

export const JOB_WORK_TYPES = [
  "Full Bathroom Fit Out",
  "Tiling",
  "Plumbing",
  "Sanitary ware",
  "Wetrooms",
  "Kitchens",
  "Full Home Interior",
];

export const JOB_START = ["Immediately", "Within 1-2 Weeks", "Within 1 Month"];
