export async function pingBackend() {
  const res = await fetch("http://localhost:5000/ping");
  return res.json();
}