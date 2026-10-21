export const divisions = {
  dumpster: {
    name: "DMK Home Improvement LLC",
    short: "Clean space. Fresh start.",
    title: "Make room for what’s next.",
    href: "/dumpster-rentals",
    label: "Dumpster rentals & cleanouts",
    description:
      "From renovation debris to a full property cleanout, tell us what needs to go. Our team will help you plan the next step.",
    tags: [
      "Dumpster rental inquiries",
      "Residential & eviction cleanouts",
      "Construction & yard debris",
    ],
  },
  property: {
    name: "DK Entity LLC",
    short: "A property. A possibility.",
    title: "Your property. A new possibility.",
    href: "/sell-your-property",
    label: "Sell your property",
    description:
      "Inherited, vacant, damaged, or simply ready for a change? Start a conversation about selling your property as-is, on a timeline that works for you.",
    tags: [
      "Inherited & vacant homes",
      "Distressed & fire-damaged properties",
      "As-is acquisition inquiries",
    ],
  },
  homeowner: {
    name: "Homeowner Solutions",
    short: "More clarity. Less pressure.",
    title: "A conversation can change your outlook.",
    href: "/homeowner-solutions",
    label: "Homeowner solutions",
    description:
      "When property decisions feel complicated, you deserve a human conversation. Tell us about repairs, an inheritance, liens, relocation, or a potential foreclosure.",
    tags: [
      "Human consultation requests",
      "Repair & transition planning",
      "Property situation intake",
    ],
  },
} as const;
export type Division = keyof typeof divisions;
export const faqs = [
  [
    "What areas do you serve?",
    "Our team is based in Columbus, Georgia. Tell us your property or service address so we can confirm coverage. Availability outside Columbus, including wider Georgia acquisitions, must be confirmed individually.",
  ],
  [
    "Can I get a guaranteed quote online?",
    "No. Dumpster pricing, sizes, inventory, delivery dates, and site requirements are confirmed by a team member after reviewing your inquiry.",
  ],
  [
    "Does my property need repairs before I reach out?",
    "No. DK Entity LLC welcomes inquiries about as-is, vacant, inherited, distressed, and fire-damaged properties. An inquiry is not an offer or an obligation to sell.",
  ],
  [
    "Can you stop a foreclosure or resolve a lien?",
    "We cannot guarantee legal or financial outcomes. Homeowner Solutions is a consultation service division, not a law firm or verified separate legal entity. Speak with a qualified attorney, financial professional, or HUD-approved housing counselor about your circumstances.",
  ],
  [
    "Am I talking to a person in the chat?",
    "The website receptionist is an automated, AI-labelled guided demo. It routes inquiries and can direct you to a human. Live AI voice and telephone integrations are not enabled.",
  ],
  [
    "Will submitting a form authorize automated marketing calls?",
    "No. Form submission is a request for a human response to your inquiry. Optional contact permission is separate and unchecked. Automated outbound AI calling is disabled.",
  ],
  [
    "How do I opt out?",
    "Use the contact page opt-out form to suppress future marketing contact for your phone number or email. You can also call (678) 684-7341 to discuss your request.",
  ],
];
