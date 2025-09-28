import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const host = req.headers.host || '';
  const subdomain = host.split(':')[0].split('.')[0];
  const tenant = await prisma.tenant.findUnique({ where: { subdomain } });
  if (!tenant) return res.status(400).json({ error: 'tenant not found' });

  const calls = await prisma.callLog.findMany({ where: { tenantId: tenant.id }, orderBy: { createdAt: 'desc' }, take: 50 });
  res.json({ calls });
}
