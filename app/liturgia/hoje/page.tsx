import { redirect } from "next/navigation";
import fs from "node:fs";
import path from "node:path";

// Helper to get today's slug in format dd-mmmm-yyyy (e.g., 24-julho-2025)
function getTodaySlug() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const monthNames = [
    "janeiro",
    "fevereiro",
    "marco",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  const month = monthNames[today.getMonth()];
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function HojeRedirectPage() {
  const slug = getTodaySlug();
  const filePath = path.join(process.cwd(), "liturgia-content", `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    redirect(`/liturgia/${slug}`);
  } else {
    redirect("/liturgia");
  }
  return null;
}
