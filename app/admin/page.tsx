import type { Metadata } from "next";
import Dashboard from "@/components/Dashboard";
export const metadata: Metadata = {
  title: "Team CRM",
  robots: { index: false, follow: false },
};
export default function Admin() {
  return <Dashboard />;
}
