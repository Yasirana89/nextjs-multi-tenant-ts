import { useEffect, useState } from 'react';
import io from 'socket.io-client';

type Call = { id: string; status: string; createdAt: string; response?: any };

export default function Dashboard() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    fetch('/api/socketio').catch(()=>{});
    const s = io();
    setSocket(s);
    s.on('connect', ()=> console.log('socket connected'));
    s.on('call.created', (payload:Call) => {
      setCalls(prev=>[payload, ...prev]);
    });
    // load existing calls
    fetch('/api/calls').then(r=>r.json()).then(j=>setCalls(j.calls || []));
    return ()=> s.disconnect();
  }, []);

  async function makeCall() {
    await fetch('/api/call', { method: 'POST' });
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      <button onClick={makeCall}>Make test call (Vapi)</button>
      <h3>Recent Calls</h3>
      <ul>
        {calls.map(c=>(
          <li key={c.id}>{c.id} — {c.status} — {new Date(c.createdAt).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}
