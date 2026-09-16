//src/app/api/investments/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    const location = searchParams.get('location') || '';
    const featured = searchParams.get('featured');
    const trending = searchParams.get('trending');
    const requestedLimit = Number.parseInt(searchParams.get('limit') || '50', 10);
    const requestedPage = Number.parseInt(searchParams.get('page') || '1', 10);
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 50;
    const page = Number.isFinite(requestedPage) ? Math.max(requestedPage, 1) : 1;
    const skip = (page - 1) * limit;

    const where: any = {
      isDeleted: false,
      status: 'PUBLISHED',
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (trending === 'true') {
      where.isTrending = true;
    }

    if (category) {
      where.categories = {
        some: {
          category: { slug: category },
        },
      };
    }

    if (tag) {
      where.tags = {
        some: {
          tag: { slug: tag },
        },
      };
    }

    const [investments, total] = await Promise.all([
      prisma.investment.findMany({
        where,
        include: {
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          bookingContact: true,
        },
        orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
        take: limit,
        skip,
      }),
      prisma.investment.count({ where }),
    ]);

    return NextResponse.json({
      investments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch investments error:', error);
    return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 });
  }
}
