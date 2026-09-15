// lib/settings.ts
import { db } from "@/lib/db";

const DEFAULT_SETTINGS = {
  heroTitle: "Discover Exceptional Independent Talent",
  heroDescription: "Explore verified artists, creatives, and performers across global stages.",
  heroImage: "",
  ctaText: "Explore Artists",
  ctaDestination: "/artists",
  introHeading: "Curated Excellence",
  introBody: "Connecting promoters, venues, and fans directly with verified talent.",
  defaultWhatsapp: "",
  defaultEmail: "contact@daytonrich.com",
  defaultWebsite: "",
  socialInstagram: "",
  socialTwitter: "",
  socialYoutube: "",
  socialSoundcloud: "",
  showPromotionalBanner: true,
};

export async function getSiteSettings() {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: "default-site-settings" },
    });
    if (!settings) {
      // Seed default record if not present
      return await db.siteSettings.create({
        data: { id: "default-site-settings", ...DEFAULT_SETTINGS },
      });
    }
    return settings;
  } catch (err) {
    console.error("Failed to fetch site settings, returning fallbacks:", err);
    return { id: "default-site-settings", ...DEFAULT_SETTINGS, updatedAt: new Date() };
  }
}

export async function getPublishedBanners() {
  try {
    return await db.banner.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (err) {
    console.error("Failed to fetch banners:", err);
    return [];
  }
}