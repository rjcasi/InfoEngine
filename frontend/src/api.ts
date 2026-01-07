export async function pingBackend() {
  const res = await fetch("http://localhost:5000/ping");
  return res.json();
}

export async function computeEigen(matrix: number[][]) {
  const res = await fetch("http://localhost:5000/eigen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matrix })
  });
  return res.json();
}

export async function computeNand(a: number, b: number) {
  const res = await fetch("http://localhost:5000/nand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ a, b })
  });
  return res.json();
}