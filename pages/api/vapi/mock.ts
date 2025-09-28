import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // simulate processing
  setTimeout(()=> {
    res.json({ id: 'vapi_' + Date.now(), text: 'mocked voice response' });
  }, 300);
}
