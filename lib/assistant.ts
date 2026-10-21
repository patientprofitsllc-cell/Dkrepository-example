export function routeMessage(message: string) {
  const m = message.toLowerCase();
  if (/\b(stop|unsubscribe|opt out|do not call)\b/.test(m))
    return {
      route: "optout",
      text: "You can record a marketing opt-out on our contact page. Please enter the email or phone number you want suppressed there; do not share sensitive information in chat.",
      href: "/contact#opt-out",
    };
  if (/\b(human|person|agent|representative|call me)\b/.test(m))
    return {
      route: "human",
      text: "A team member can help. Call (678) 684-7341 or request human follow-up through our contact form. This chat does not transfer or place telephone calls.",
      href: "/contact",
    };
  if (/\b(legal|tax|bankrupt|foreclos|lien|financial|lawyer)/.test(m))
    return {
      route: "homeowner",
      text: "I can help route you to a human consultation, but cannot give legal, financial, or tax advice or guarantee an outcome. If a deadline is approaching, contact a qualified professional promptly.",
      href: "/homeowner-solutions",
    };
  if (/dumpster|debris|cleanout|rubbish|trash|renovat|yard/.test(m))
    return {
      route: "dumpster",
      text: "DMK Home Improvement LLC handles dumpster and cleanout inquiries. Tell our team the debris type, service address, requested date, and access details using the quote form. A human will confirm availability and pricing.",
      href: "/dumpster-rentals#inquiry",
    };
  if (/sell|offer|inherited|vacant|fire|property|house/.test(m))
    return {
      route: "property",
      text: "DK Entity LLC can review your property inquiry. Share the address, condition, occupancy, and timeline on the property form. I cannot make a binding offer or promise a closing date.",
      href: "/sell-your-property#inquiry",
    };
  if (/repair|relocat|homeowner|help/.test(m))
    return {
      route: "homeowner",
      text: "Homeowner Solutions offers a human conversation about your situation. Request a consultation and our team can discuss next steps without pressure or guarantees.",
      href: "/homeowner-solutions#inquiry",
    };
  return {
    route: "choose",
    text: "Welcome. I’m the DK automated receptionist, running in guided demo mode. Are you looking for a dumpster or cleanout, selling a property, or homeowner support? You can ask for a human at any time.",
    href: "/contact",
  };
}
export function outboundAllowed() {
  return false;
}
