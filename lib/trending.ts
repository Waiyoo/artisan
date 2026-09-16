// lib/trending.ts
import { db } from "@/lib/db";

/**
 * Configurable, defensible decaying weighted trending algorithm.
 * Incorporates:
 * - Recent views & engagement metrics over sliding time windows (e.g., last 7 and 30 days)
 * - Exponential decay factor to prevent historical dominance by older profiles
 * - Real activity recorded via investmentMetric table
 */
export async function calculateTrendinginvestments(limit = 10) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Fetch published investments with their recent metrics and baseline views
  const investments = await db.investment.findMany({
    where: { status: "PUBLISHED", isDeleted: false },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      media: { where: { isPrimary: true } },
      metrics: {
        where: {
          timestamp: { gte: thirtyDaysAgo },
        },
      },
    },
  });

  const scoredinvestments = investments.map((investment) => {
    // Separate metrics into recent (7 days) and sustained (30 days)
    const recentMetrics = investment.metrics.filter((m) => new Date(m.timestamp) >= sevenDaysAgo);
    const sustainedMetrics = investment.metrics;

    // Calculate weighted engagement sum
    const recentEngagementScore = recentMetrics.reduce((acc, m) => acc + m.weight * 2.0, 0);
    const sustainedEngagementScore = sustainedMetrics.reduce((acc, m) => acc + m.weight * 1.0, 0);

    // Profile lifetime recency decay factor
    const ageInDays = (now.getTime() - new Date(investment.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    const recencyDecay = Math.max(0.2, 1 / (1 + ageInDays * 0.05));

    // Defensible composite trending score
    const trendingScore = (recentEngagementScore * 1.5 + sustainedEngagementScore * 0.5 + investment.profileViews * 0.1) * recencyDecay;

    return {
      ...investment,
      trendingScore,
    };
  });

  scoredinvestments.sort((a, b) => b.trendingScore - a.trendingScore);
  return scoredinvestments.slice(0, limit);
}