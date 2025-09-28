export default function NoTenant() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Tenant not found</h2>
      <p>Make sure you are using a mapped subdomain (e.g., acme.localhost).</p>
    </div>
  );
}
