import type * as React from "react";
import Link from "next/link";

/**
 * The four policy documents, transcribed from the live migssinteriors.com.
 *
 * Kept as data rather than four page bodies so the layout stays one component.
 * Paragraphs and list items are ReactNode, which is why this is .tsx — email
 * addresses and cross-references between the policies render as real links.
 */

export type LegalBlock =
  | { kind: "p"; content: React.ReactNode }
  | { kind: "ul"; items: React.ReactNode[] }
  | { kind: "ol"; items: React.ReactNode[] };

export type LegalSection = {
  /** Omitted for the opening blocks of a document that starts with prose. */
  heading?: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
};

const EMAIL = "info@migssinteriors.com";

/** All four documents are revised together, so the date lives in one place. */
const LAST_UPDATED = "17th September 2026";

function Email() {
  return (
    <a
      href={`mailto:${EMAIL}`}
      className="text-migss-accent-700 underline-offset-[3px]"
    >
      {EMAIL}
    </a>
  );
}

function Internal({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="text-migss-accent-700 underline-offset-[3px]">
      {children}
    </Link>
  );
}

const REGISTERED = (
  <>
    This website is operated by Migss Tiles &amp; Luxury Interiors, a company
    registered in England and Wales under company number 16508162, with
    registered office at Gable House, 1 Balfour Road, Gable House Suite C, Room
    3, Ilford, United Kingdom, IG1 4HP.
  </>
);

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "terms-of-use",
    title: "Website Terms of Use",
    description:
      "The terms governing your use of the Migss Interiors website.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "About us",
        blocks: [
          {
            kind: "p",
            content: (
              <>
                {REGISTERED} For any question about these terms, contact us at{" "}
                <Email />.
              </>
            ),
          },
        ],
      },
      {
        heading: "Acceptance of these terms",
        blocks: [
          {
            kind: "p",
            content:
              "By using this website, you agree to these Terms of Use. If you do not agree with them, please do not continue to use the site.",
          },
          {
            kind: "p",
            content:
              "These terms apply to your use of the website itself. They do not form the contract for any renovation project, which is governed separately by our Terms and Conditions, agreed at the point of contract.",
          },
        ],
      },
      {
        heading: "Intellectual property",
        blocks: [
          {
            kind: "p",
            content:
              "All content on this website, including text, images, project photography, logos, and branding, is owned by or licensed to Migss Interiors and is protected by copyright and other intellectual property laws.",
          },
          {
            kind: "p",
            content:
              "You may view and print pages for your own personal, non-commercial use. You may not reproduce, distribute, or use any content from this site for commercial purposes without our prior written permission.",
          },
        ],
      },
      {
        heading: "Accuracy of information",
        blocks: [
          {
            kind: "p",
            content:
              "We take care to keep the information on this website accurate and up to date. However:",
          },
          {
            kind: "ul",
            items: [
              "Project examples, timelines, and descriptions are provided for general guidance and inspiration and do not constitute a quote or guarantee for your own project",
              "Computer-generated visuals and design concepts shown are illustrative and may differ from a finished installation",
              "We do not guarantee that the website will be uninterrupted, error-free, or free of viruses",
            ],
          },
        ],
      },
      {
        heading: "Acceptable use",
        blocks: [
          { kind: "p", content: "You agree not to use this website:" },
          {
            kind: "ul",
            items: [
              "In any way that breaches applicable law or regulation",
              "To transmit or upload any harmful or malicious code",
              "To attempt to gain unauthorised access to the website, our systems, or any connected network",
            ],
          },
        ],
      },
      {
        heading: "Links to other websites",
        blocks: [
          {
            kind: "p",
            content:
              "This website may contain links to third-party websites, including social media platforms. We are not responsible for the content or privacy practices of any external website.",
          },
        ],
      },
      {
        heading: "Liability",
        blocks: [
          {
            kind: "p",
            content:
              "We are not liable for any loss or damage arising from your use of, or inability to use, this website, except where such liability cannot be excluded under English law (for example, liability for death or personal injury caused by our negligence).",
          },
        ],
      },
      {
        heading: "Changes to these terms",
        blocks: [
          {
            kind: "p",
            content:
              "We may update these Terms of Use from time to time. The date at the top of this page shows when it was last revised. Continued use of the website after changes are made constitutes acceptance of the updated terms.",
          },
        ],
      },
      {
        heading: "Governing law",
        blocks: [
          {
            kind: "p",
            content:
              "These terms are governed by the laws of England and Wales, and any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.",
          },
        ],
      },
      {
        heading: "Related policies",
        blocks: [
          {
            kind: "p",
            content: (
              <>
                Our use of your personal data is set out separately in our{" "}
                <Internal href="/privacy-policy">Privacy Policy</Internal>.
                Please read this alongside these Terms of Use.
              </>
            ),
          },
        ],
      },
    ],
  },

  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description:
      "How Migss Interiors collects, uses and protects your personal information.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "Who we are",
        blocks: [
          {
            kind: "p",
            content: (
              <>
                {REGISTERED} For any question about this policy or how we handle
                your information, contact us at <Email />.
              </>
            ),
          },
        ],
      },
      {
        heading: "What information we collect",
        blocks: [
          {
            kind: "p",
            content:
              "We collect information when you interact with this website, including:",
          },
          {
            kind: "ul",
            items: [
              <>
                <strong className="font-medium">
                  Contact and consultation booking forms:
                </strong>{" "}
                name, email address, phone number, property location, and
                details of your enquiry
              </>,
              <>
                <strong className="font-medium">Newsletter sign-up:</strong>{" "}
                email address, and name if provided
              </>,
              <>
                <strong className="font-medium">
                  Analytics and advertising:
                </strong>{" "}
                technical data collected through Google Analytics and Meta
                Pixel, including pages visited, device and browser type, and how
                you arrived at our site
              </>,
            ],
          },
        ],
      },
      {
        heading: "Cookies",
        blocks: [
          {
            kind: "p",
            content:
              "This website uses cookies. Strictly necessary cookies, needed for the site to function, are used without requiring consent. Analytics cookies (Google Analytics) and advertising cookies (Meta Pixel) are not essential and are only set once you have given consent through our cookie banner. You can withdraw consent at any time by adjusting your cookie preferences.",
          },
        ],
      },
      {
        heading: "Who we share your information with",
        blocks: [
          {
            kind: "p",
            content:
              "We may share your information with trusted third parties who help us operate our business, including:",
          },
          {
            kind: "ul",
            items: [
              "Website hosting and platform providers",
              "Email and newsletter service providers",
              "Google (Analytics) and Meta (Pixel), for site analytics and advertising purposes",
            ],
          },
          {
            kind: "p",
            content:
              "We do not sell your personal information to third parties.",
          },
        ],
      },
      {
        heading: "How long we keep your information",
        blocks: [
          {
            kind: "p",
            content:
              "We keep enquiry and consultation information for as long as necessary to respond to you and, where you become a client, for the duration of our working relationship and afterwards as required for our legal and accounting obligations. Newsletter email addresses are kept until you unsubscribe.",
          },
        ],
      },
      {
        heading: "International transfers",
        blocks: [
          {
            kind: "p",
            content:
              "Where any of our third-party providers store or process data outside the UK, we ensure appropriate safeguards are in place in line with UK GDPR requirements.",
          },
        ],
      },
      {
        heading: "Your rights",
        blocks: [
          { kind: "p", content: "Under UK GDPR, you have the right to:" },
          {
            kind: "ul",
            items: [
              "Access the personal information we hold about you",
              "Have inaccurate information corrected",
              "Ask us to delete your information, where applicable",
              "Object to how we use your information",
              "Withdraw consent at any time, where consent is our lawful basis",
            ],
          },
          {
            kind: "p",
            content: (
              <>
                To exercise any of these rights, contact us at <Email />.
              </>
            ),
          },
        ],
      },
      {
        heading: "How to complain",
        blocks: [
          {
            kind: "p",
            content: (
              <>
                If you have a concern about how we handle your information,
                contact us directly at <Email /> and we will do our best to
                resolve it. You also have the right to complain to the
                Information Commissioner&rsquo;s Office (ICO), the UK&rsquo;s
                independent regulator for data protection, at{" "}
                <a
                  href="https://ico.org.uk"
                  rel="noreferrer noopener"
                  target="_blank"
                  className="text-migss-accent-700 underline-offset-[3px]"
                >
                  ico.org.uk
                </a>
                .
              </>
            ),
          },
        ],
      },
      {
        heading: "Changes to this policy",
        blocks: [
          {
            kind: "p",
            content:
              "We may update this policy from time to time. The date at the top shows when it was last revised.",
          },
        ],
      },
    ],
  },

  {
    slug: "labour-guarantee",
    title: "Labour Guarantee",
    description:
      "The ten-year workmanship guarantee covering every installation carried out by Migss Interiors.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "Our promise",
        blocks: [
          {
            kind: "p",
            content:
              "Every installation carried out by Migss Interiors is covered by a ten-year workmanship guarantee. This guarantee reflects our confidence in the standard of our work and the training of our team.",
          },
          {
            kind: "p",
            content:
              "It applies to all labour carried out directly by Migss Interiors operatives across bathroom, kitchen, and interior renovation projects, including home cinema, media wall, dressing room, and smart automation installations.",
          },
        ],
      },
      {
        heading: "What is covered",
        blocks: [
          {
            kind: "p",
            content:
              "The guarantee covers defects arising from the quality of our installation work, including:",
          },
          {
            kind: "ol",
            items: [
              "Plumbing connections and pipework carried out during the project",
              "Tiling, including adhesion, levelling, and grouting",
              "Waterproofing, tanking, and floor falls in wet rooms and tanked showers",
              "Electrical connections made as part of the installation",
              "Joinery and fitted carpentry",
              "Fitting and setting of sanitaryware, fixtures, and cabinetry supplied and installed by Migss Interiors",
            ],
          },
          {
            kind: "p",
            content:
              "Where a defect is found to result from our workmanship, we will return to assess and repair it at no cost to the client.",
          },
        ],
      },
      {
        heading: "What is not covered",
        blocks: [
          { kind: "p", content: "This guarantee does not cover:" },
          {
            kind: "ol",
            items: [
              <>
                Manufacturer defects in products or materials, which are covered
                separately under the relevant{" "}
                <Internal href="/product-warantee">product warranty</Internal>
              </>,
              "Damage caused by misuse, neglect, or lack of routine maintenance",
              "Normal wear and tear",
              "Work carried out, repaired, altered, or interfered with by anyone other than a Migss Interiors operative",
              "Damage caused by other trades not engaged by Migss Interiors",
              "Faults arising from materials supplied by the client rather than Migss Interiors",
              "Sealant and silicone maintenance, which is the client's responsibility to maintain under standard terms. Clients who have purchased a Migss Interiors aftercare package are covered for sealant and silicone maintenance as set out in that package.",
            ],
          },
        ],
      },
      {
        heading: "Duration",
        blocks: [
          {
            kind: "p",
            content:
              "This guarantee runs for ten years from the date of practical completion, as recorded on the client's completion certificate.",
          },
        ],
      },
      {
        heading: "Making a claim",
        blocks: [
          {
            kind: "p",
            content: "To make a claim under this guarantee:",
          },
          {
            kind: "ol",
            items: [
              <>
                Contact Migss Interiors at <Email /> with your name, project
                address, and a description of the issue
              </>,
              "Where possible, include photographs of the affected area",
              "We will respond within 48 hours to acknowledge your claim and arrange an assessment",
              "Where a claim is valid, we will agree a timeline for repair with you directly",
            ],
          },
        ],
      },
      {
        heading: "Conditions",
        blocks: [
          {
            kind: "p",
            content:
              "This guarantee becomes void if the work is repaired, modified, or interfered with by anyone other than a Migss Interiors operative. It applies to the original client named on the project contract and does not automatically transfer to a new owner of the property unless otherwise agreed in writing.",
          },
        ],
      },
      {
        heading: "Your statutory rights",
        blocks: [
          {
            kind: "p",
            content:
              "This guarantee is in addition to, and does not affect, your statutory rights under the Consumer Rights Act 2015, including the right to repeat performance where a service has not been carried out with reasonable care and skill.",
          },
        ],
      },
    ],
  },

  {
    slug: "product-warantee",
    title: "Product Warranty",
    description:
      "How manufacturer warranties on products fitted by Migss Interiors are registered and managed on your behalf.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        blocks: [
          {
            kind: "p",
            content:
              "The products and materials fitted as part of your Migss Interiors project, including sanitaryware, tiles, appliances, fixtures, and smart automation components, are covered by the warranty terms of their respective manufacturers. These terms vary by product and supplier.",
          },
          {
            kind: "p",
            content:
              "Migss Interiors takes responsibility for registering and managing these warranties on your behalf. You will not need to locate manufacturer paperwork, register products individually, or track separate warranty periods yourself. We hold and manage this on your file.",
          },
        ],
      },
      {
        heading: "What this means for you",
        blocks: [
          {
            kind: "ul",
            items: [
              "On completion of your project, Migss Interiors registers eligible products with the relevant manufacturers where registration is required to activate warranty cover",
              "We retain a record of all product warranties associated with your project, including duration and terms",
              "If a product develops a fault within its warranty period, contact Migss Interiors directly and we will manage the claim with the manufacturer on your behalf",
            ],
          },
        ],
      },
      {
        heading: "What is covered",
        blocks: [
          {
            kind: "p",
            content:
              "Product and materials warranties typically cover manufacturing defects in the product itself, such as:",
          },
          {
            kind: "ul",
            items: [
              "Faults in appliance components",
              "Defects in sanitary-ware finish or construction",
              "Manufacturing faults in tiles, fittings, or smart automation hardware",
            ],
          },
          {
            kind: "p",
            content:
              "Coverage periods and specific terms are set by each manufacturer and will differ between products. Full details for your specific project are confirmed on handover.",
          },
        ],
      },
      {
        heading: "What is not covered",
        blocks: [
          {
            kind: "ul",
            items: [
              "Damage caused by incorrect use, accidental damage, or lack of routine maintenance",
              <>
                Installation defects, which fall under our separate{" "}
                <Internal href="/labour-guarantee">Labour Guarantee</Internal>{" "}
                rather than product warranty
              </>,
              "Wear and tear consistent with normal use",
              "Products supplied by the client rather than sourced through Migss Interiors, unless separately agreed",
            ],
          },
        ],
      },
      {
        heading: "Making a claim",
        blocks: [
          {
            kind: "p",
            content:
              "To make a warranty claim on a product fitted by Migss Interiors:",
          },
          {
            kind: "ol",
            items: [
              <>
                Contact Migss Interiors at <Email /> with your name, project
                address, and a description of the fault
              </>,
              "We will confirm the applicable manufacturer warranty and manage the claim on your behalf",
              "We will respond within 48 hours to acknowledge your claim and advise next steps",
            ],
          },
        ],
      },
      {
        heading: "Distinction from our Labour Guarantee",
        blocks: [
          {
            kind: "p",
            content: (
              <>
                This warranty covers the products themselves. Faults arising from
                how a product was installed are covered under our separate
                ten-year{" "}
                <Internal href="/labour-guarantee">Labour Guarantee</Internal>,
                not this document. If you are unsure which applies, contact us
                and we will confirm.
              </>
            ),
          },
        ],
      },
      {
        heading: "Your statutory rights",
        blocks: [
          {
            kind: "p",
            content:
              "This warranty is in addition to, and does not affect, your statutory rights under the Consumer Rights Act 2015 and the Consumer Protection Act 1987.",
          },
        ],
      },
    ],
  },
];

export function getLegalDoc(slug: string) {
  return LEGAL_DOCS.find((doc) => doc.slug === slug);
}
