export async function pingBackend() {
  const res = await fetch("http://localhost:8000/ping");
  return res.json();
}