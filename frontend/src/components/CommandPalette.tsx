import React, { useEffect, useState } from "react";

export const CommandPalette = ({ open, setOpen, setPanel }) => {
  const [query, setQuery] = useState("");

  const commands = [
    { name: "BloodHound Red", panel: "bh_red" },
    { name: "BloodHound Blue", panel: "bh_blue" },
    { name: "Cyber Origin", panel: "origin" },
    { name: "CORS Analyzer", panel: "cors" },
    { name: "XSS Analyzer", panel: "xss" },
    { name: "Hash Organ", panel: "hash" },
    { name: "Spike Panel", panel: "spike" },
    { name: "Synthetic Causal Graph", panel: "synthetic" },
    { name: "Laplace", panel: "laplace" },
    { name: "Koopman", panel: "koopman" },
    { name: "Zeta-Gamma", panel: "zeta" }
  ];

  const filtered = commands.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "10vh",
        zIndex: 9999
      }}
    >
      <div
        style={{
          width: "600px",
          background: "#111",
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "1rem"
        }}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search panels…"
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#000",
            color: "#eee",
            border: "1px solid #333",
            borderRadius: "4px",
            marginBottom: "1rem"
          }}
        />

        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {filtered.map((cmd, i) => (
            <div
              key={i}
              onClick={() => {
                setPanel(cmd.panel);
                setOpen(false);
              }}
              style={{
                padding: "0.5rem",
                cursor: "pointer",
                borderRadius: "4px",
                marginBottom: "0.25rem"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {cmd.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};