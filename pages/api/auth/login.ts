import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { sign } from '../../../lib/jwt';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'missing' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'invalid' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'invalid' });

  const token = sign({ userId: user.id, tenantId: user.tenantId, role: user.role });
  res.setHeader('Set-Cookie', cookie.serialize('sid', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  }));

  await prisma.auditLog.create({ data: { tenantId: user.tenantId, userId: user.id, event: 'login' } });
  return res.json({ ok: true });
}
