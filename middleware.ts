import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from './lib/prisma';

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const [subdomain] = host.split(':')[0].split('.');
  if (!subdomain || subdomain === 'localhost' || subdomain === 'www') {
    return NextResponse.next();
  }
  // try to find tenant quickly (safe for dev)
  const tenant = await prisma.tenant.findUnique({ where: { subdomain } });
  if (!tenant) return NextResponse.rewrite(new URL('/no-tenant', req.url));
  const res = NextResponse.next();
  res.headers.set('x-tenant-id', tenant.id);
  res.headers.set('x-tenant-subdomain', tenant.subdomain);
  return res;
}

export const config = {
  matcher: '/:path*'
};
