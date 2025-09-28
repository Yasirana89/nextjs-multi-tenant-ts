import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import fetch from 'isomorphic-unfetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // basic tenant detection from host header (middleware also sets header in advanced setups)
  const host = req.headers.host || '';
  const subdomain = host.split(':')[0].split('.')[0];
  const tenant = await prisma.tenant.findUnique({ where: { subdomain } });
  if (!tenant) return res.status(400).json({ error: 'tenant not found' });

  // call mock vapi
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/vapi/mock`);
  const data = await r.json();

  const call = await prisma.callLog.create({
    data: { tenantId: tenant.id, status: 'ok', response: data }
  });

  // notify socket by emitting event via in-process Socket.IO (attached to server)
  try {
    // @ts-ignore
    const io = (res.socket as any).server?.io;
    if (io) {
      io.to(tenant.id).emit('call.created', call);
    }
  } catch (e) {
    // ignore
  }

  await prisma.auditLog.create({ data: { tenantId: tenant.id, event: 'call.created', meta: data } });
  res.json({ ok: true, call });
}
