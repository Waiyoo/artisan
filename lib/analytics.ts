// lib/analytics.ts
import { db } from "@/lib/db";
import { headers } from "next/headers";
import crypto from "crypto";

export async function trackinvestmentEvent(investmentId: string, eventType: "VIEW" | "CONTACT_CLICK" | "MEDIA_INTERACTION", weight = 1.0) {
  try {
    const headerList = headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";
    const userAgent = headerList.get("user-agent") || "unknown";

    // Hash IP address for privacy compliance (prevent raw storage while mitigating refresh spam)
    const ipHash = crypto.createHmac("sha256", process.env.IP_HASH_SECRET || "dayton-rich-salt").update(ip).digest("hex");

    // For views, check if same IP viewed this investment within the last 30 minutes to prevent spam inflation
    if (eventType === "VIEW") {
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
      const recentView = await db.investmentMetric.findFirst({
        where: {
          investmentId,
          eventType: "VIEW",
          ipHash,
          timestamp: { gte: thirtyMinsAgo },
        },
      });

      if (recentView) return; // Ignore duplicate rapid-fire view counts from same visitor
    }

    // Record metric asynchronously without blocking caller
    await db.$transaction([
      db.investmentMetric.create({
        data: {
          investmentId,
          eventType,
          weight,
          ipHash,
          userAgent: userAgent.substring(0, 150),
        },
      }),
      ...(eventType === "VIEW"
        ? [
            db.investment.update({
              where: { id: investmentId },
              data: { profileViews: { increment: 1 } },
            }),
          ]
        : []),
    ]);
  } catch (err) {
    console.error("Non-blocking analytics tracking error:", err);
  }
}