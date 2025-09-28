import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { sign } from '../../../lib/jwt';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password, tenantSubdomain, name } = req.body;
  if (!email || !password || !tenantSubdomain) return res.status(400).json({ error: 'missing' });

  // find or create tenant
  let tenant = await prisma.tenant.findUnique({ where: { subdomain: tenantSubdomain } });
  if (!tenant) {
    tenant = await prisma.tenant.create({ data: { name: tenantSubdomain, subdomain: tenantSubdomain } });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: 'user exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name, tenantId: tenant.id, role: 'ADMIN' }
  });

  const token = sign({ userId: user.id, tenantId: tenant.id, role: user.role });
  res.setHeader('Set-Cookie', cookie.serialize('sid', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  }));

  await prisma.auditLog.create({ data: { tenantId: tenant.id, userId: user.id, event: 'signup' } });

  return res.json({ ok: true, user: { id: user.id, email: user.email } });
}
