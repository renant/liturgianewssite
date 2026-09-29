"use client";

import { Button } from "@/components/ui/button";
import { captureEvent } from "@/lib/analytics";
import { Facebook, Linkedin, Mail, Twitter } from "lucide-react";
import { usePathname } from "next/navigation";

function WhatsAppIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="WhatsApp"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>;
}

type Platform = "whatsapp" | "facebook" | "x" | "linkedin" | "email_share";

export function SocialShare({ title, description, slug, imagePath, className = "" }: {
  title: string;
  description?: string;
  slug?: string;
  imagePath?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const contentSlug = slug || pathname.split("/").filter(Boolean).at(-1) || "home";
  const canonical = `https://www.liturgianews.site${pathname}`;
  const trackedUrl = (source: Platform, medium: "social" | "email") => {
    const url = new URL(canonical);
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", medium);
    url.searchParams.set("utm_campaign", "liturgia");
    url.searchParams.set("utm_content", contentSlug);
    return url.toString();
  };
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || title);
  const destinations: Array<{ platform: Platform; label: string; href: string; icon: React.ReactNode }> = [
    { platform: "whatsapp", label: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodeURIComponent(trackedUrl("whatsapp", "social"))}`, icon: <WhatsAppIcon className="w-4 h-4" /> },
    { platform: "facebook", label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(trackedUrl("facebook", "social"))}`, icon: <Facebook className="w-4 h-4" aria-hidden /> },
    { platform: "x", label: "X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(trackedUrl("x", "social"))}&text=${encodedTitle}`, icon: <Twitter className="w-4 h-4" aria-hidden /> },
    { platform: "linkedin", label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(trackedUrl("linkedin", "social"))}`, icon: <Linkedin className="w-4 h-4" aria-hidden /> },
    { platform: "email_share", label: "E-mail", href: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodeURIComponent(trackedUrl("email_share", "email"))}`, icon: <Mail className="w-4 h-4" aria-hidden /> },
  ];

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {destinations.map((item) => (
          <Button key={item.platform} asChild variant="outline" size="sm">
            <a href={item.href} target={item.platform === "email_share" ? undefined : "_blank"} rel={item.platform === "email_share" ? undefined : "noopener noreferrer"} onClick={() => captureEvent("share_click", { platform: item.platform, slug: contentSlug })}>
              {item.icon}<span className="ml-2 hidden sm:inline">{item.label}</span>
            </a>
          </Button>
        ))}
      </div>
      {imagePath && <a href={imagePath} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-medium text-amber-700 underline underline-offset-4" onClick={() => captureEvent("share_click", { platform: "image", slug: contentSlug })}>
        Abrir imagem para compartilhar
      </a>}
    </div>
  );
}
