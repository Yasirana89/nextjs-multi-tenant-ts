import { useState } from 'react';
import Router from 'next/router';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenant, setTenant] = useState('');

  async function signup(e:any){
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, tenantSubdomain: tenant, name: 'Demo' })
    });
    const json = await res.json();
    if (json.ok) {
      Router.push('/dashboard');
    } else {
      alert(json.error || 'Signup failed');
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Multi-tenant SaaS (demo)</h1>
      <form onSubmit={signup} style={{ maxWidth: 420 }}>
        <div>
          <label>Tenant subdomain (e.g., acme)</label><br/>
          <input value={tenant} onChange={e=>setTenant(e.target.value)} required/>
        </div>
        <div>
          <label>Email</label><br/>
          <input value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div>
          <label>Password</label><br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        <button type="submit">Sign up (creates tenant if missing)</button>
      </form>
    </div>
  );
}
