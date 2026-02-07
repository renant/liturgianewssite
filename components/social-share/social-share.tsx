"use client";

import { Button } from "@/components/ui/button";
import {
  Facebook,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
import { usePathname } from "next/navigation";

// Simple WhatsApp icon SVG component
function WhatsAppIcon({
  className,
  ariaLabel = "WhatsApp",
}: {
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

interface SocialShareProps {
  title: string;
  description?: string;
  className?: string;
}

export function SocialShare({
  title,
  description,
  className = "",
}: SocialShareProps) {
  const pathname = usePathname();
  const url = `https://www.liturgianews.site${pathname}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(
    description || title
  );

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
  };

  const handleShare = async (platform: keyof typeof shareLinks) => {
    const shareUrl = shareLinks[platform];

    if (platform === "email") {
      window.location.href = shareUrl;
      return;
    }

    // Use Web Share API se disponível (mobile)
    if (navigator.share && (platform === "whatsapp" || platform === "facebook")) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url,
        });
        return;
      } catch (error) {
        // User cancelled or error occurred, fall back to URL
      }
    }

    // Open in new window
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleShare("whatsapp")}
        aria-label="Compartilhar no WhatsApp"
        className="flex items-center gap-2"
      >
        <WhatsAppIcon className="w-4 h-4" ariaLabel="WhatsApp" />
        <span className="hidden sm:inline">WhatsApp</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleShare("facebook")}
        aria-label="Compartilhar no Facebook"
        className="flex items-center gap-2"
      >
        <Facebook className="w-4 h-4" aria-label="Facebook" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleShare("twitter")}
        aria-label="Compartilhar no Twitter/X"
        className="flex items-center gap-2"
      >
        <Twitter className="w-4 h-4" aria-label="Twitter/X" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleShare("linkedin")}
        aria-label="Compartilhar no LinkedIn"
        className="flex items-center gap-2"
      >
        <Linkedin className="w-4 h-4" aria-label="LinkedIn" />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => handleShare("email")}
        aria-label="Compartilhar por e-mail"
        className="flex items-center gap-2"
      >
        <Mail className="w-4 h-4" aria-label="E-mail" />
        <span className="hidden sm:inline">E-mail</span>
      </Button>
    </div>
  );
}

