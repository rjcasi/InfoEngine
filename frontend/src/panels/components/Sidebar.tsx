import React from "react";

export const Sidebar = ({ setPanel }) => {
  const sectionStyle = {
    marginTop: "1.5rem",
    marginBottom: "0.5rem",
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#bbb",
    textTransform: "uppercase",
    letterSpacing: "1px"
  };

  const buttonStyle = {
    display: "block",
    width: "100%",
    padding: "0.5rem 0.75rem",
    marginBottom: "0.25rem",
    background: "transparent",
    border: "1px solid #333",
    color: "#eee",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "4px"
  };

  return (
    <div
      style={{
        width: "240px",
        background: "#0d0d0d",
        color: "#eee",
        padding: "1rem",
        borderRight: "1px solid #333",
        height: "100vh",
        overflowY: "auto"
      }}
    >
      <div style={sectionStyle}>Cybersecurity</div>
      <button style={buttonStyle} onClick={() => setPanel("bh_red")}>BloodHound Red</button>
      <button style={buttonStyle} onClick={() => setPanel("bh_blue")}>BloodHound Blue</button>
      <button style={buttonStyle} onClick={() => setPanel("origin")}>Cyber Origin</button>
      <button style={buttonStyle} onClick={() => setPanel("cors")}>CORS Analyzer</button>
      <button style={buttonStyle} onClick={() => setPanel("xss")}>XSS Analyzer</button>

      <div style={sectionStyle}>Computation</div>
      <button style={buttonStyle} onClick={() => setPanel("hash")}>Hash Organ</button>
      <button style={buttonStyle} onClick={() => setPanel("spike")}>Spike Panel</button>
      <button style={buttonStyle} onClick={() => setPanel("synthetic")}>Synthetic Causal Graph</button>

      <div style={sectionStyle}>Physics</div>
      <button style={buttonStyle} onClick={() => setPanel("laplace")}>Laplace</button>
      <button style={buttonStyle} onClick={() => setPanel("koopman")}>Koopman</button>
      <button style={buttonStyle} onClick={() => setPanel("zeta")}>Zeta-Gamma</button>
    </div>
  );
};