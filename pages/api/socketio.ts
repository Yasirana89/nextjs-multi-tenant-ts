import type { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server as any);
    // store server instance
    // @ts-ignore
    res.socket.server.io = io;

    io.on('connection', async socket => {
      // simple tenant join by query subdomain or cookie (for demo)
      const { tenant } = socket.handshake.query;
      if (tenant) socket.join(String(tenant));
      else {
        // attempt to determine tenant from host header is not available here; clients should pass tenant id
      }
    });

    // attach a small helper to allow emitting to tenant rooms by id later
  }
  res.end();
}
