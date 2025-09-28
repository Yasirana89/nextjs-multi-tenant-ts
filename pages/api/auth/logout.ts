import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', cookie.serialize('sid', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0)
  }));
  res.json({ ok: true });
}
