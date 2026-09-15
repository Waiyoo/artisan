//src/app/api/admin/auth/login/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSessionToken, checkLoginRateLimit, recordFailedLogin, resetFailedLogins } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const rateCheck = await checkLoginRateLimit(username);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many failed attempts. Account locked. Try again in ${rateCheck.waitMinutes} minutes.` },
        { status: 429 }
      );
    }

    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin) {
      await recordFailedLogin(username);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      await recordFailedLogin(username);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await resetFailedLogins(username);

    const token = await createSessionToken(admin.id);

    cookies().set({
      name: 'dr_admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return NextResponse.json({ success: true, user: { username: admin.username, role: admin.role } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
