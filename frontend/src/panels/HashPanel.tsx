import { useState } from "react";

export default function HashPanel() {
  const [input, setInput] = useState("hello world");
  const [algorithm, setAlgorithm] = useState("sha256");
  const [data, setData] = useState<any>(null);

  async function run() {
    const res = await fetch("/api/hash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: input, algorithm })
    });

    const json = await res.json();
    setData(json);
  }

  return (
    <section style={{ padding: "1rem", border: "1px solid #444" }}>
      <h2>Hash Organ</h2>

      <label>Input:</label>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          background: "#111",
          color: "#eee",
          border: "1px solid #333"
        }}
      />

      <label>Algorithm:</label>
      <select
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          background: "#111",
          color: "#eee",
          border: "1px solid #333"
        }}
      >
        <option value="sha256">SHA-256</option>
        <option value="sha1">SHA-1</option>
        <option value="md5">MD5</option>
        <option value="sha3_256">SHA3-256</option>
        <option value="blake2b">BLAKE2b</option>
      </select>

      <button
        onClick={run}
        style={{
          padding: "0.5rem 1rem",
          background: "#222",
          border: "1px solid #444",
          color: "#eee",
          cursor: "pointer"
        }}
      >
        Compute Hash
      </button>

      {data && (
        <pre style={{ marginTop: "1rem", color: "#ccc" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </section>
  );
}