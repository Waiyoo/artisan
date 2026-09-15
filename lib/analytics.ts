// lib/analytics.ts
import { db } from "@/lib/db";
import { headers } from "next/headers";
import crypto from "crypto";

export async function trackArtistEvent(artistId: string, eventType: "VIEW" | "CONTACT_CLICK" | "MEDIA_INTERACTION", weight = 1.0) {
  try {
    const headerList = headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";
    const userAgent = headerList.get("user-agent") || "unknown";

    // Hash IP address for privacy compliance (prevent raw storage while mitigating refresh spam)
    const ipHash = crypto.createHmac("sha256", process.env.IP_HASH_SECRET || "dayton-rich-salt").update(ip).digest("hex");

    // For views, check if same IP viewed this artist within the last 30 minutes to prevent spam inflation
    if (eventType === "VIEW") {
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
      const recentView = await db.artistMetric.findFirst({
        where: {
          artistId,
          eventType: "VIEW",
          ipHash,
          timestamp: { gte: thirtyMinsAgo },
        },
      });

      if (recentView) return; // Ignore duplicate rapid-fire view counts from same visitor
    }

    // Record metric asynchronously without blocking caller
    await db.$transaction([
      db.artistMetric.create({
        data: {
          artistId,
          eventType,
          weight,
          ipHash,
          userAgent: userAgent.substring(0, 150),
        },
      }),
      ...(eventType === "VIEW"
        ? [
            db.artist.update({
              where: { id: artistId },
              data: { profileViews: { increment: 1 } },
            }),
          ]
        : []),
    ]);
  } catch (err) {
    console.error("Non-blocking analytics tracking error:", err);
  }
}