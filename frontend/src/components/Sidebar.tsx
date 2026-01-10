import React, { useState } from "react";
import { FaShieldAlt, FaBrain, FaCogs, FaChevronDown, FaChevronRight } from "react-icons/fa";

export const Sidebar = ({ setPanel }) => {
  const [open, setOpen] = useState({
    cyber: true,
    computation: true,
    physics: true
  });

  const section = (label, icon, key) => (
    <div
      onClick={() => setOpen({ ...open, [key]: !open[key] })}
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        marginTop: "1rem",
        color: "#bbb",
        fontWeight: "bold",
        userSelect: "none"
      }}
    >
      {open[key] ? <FaChevronDown /> : <FaChevronRight />}
      <span style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>{icon}</span>
      {label}
    </div>
  );

  const button = (label, panel) => (
    <button
      onClick={() => setPanel(panel)}
      style={{
        width: "100%",
        padding: "0.4rem 0.75rem",
        marginTop: "0.25rem",
        background: "transparent",
        border: "1px solid #333",
        color: "#eee",
        textAlign: "left",
        cursor: "pointer",
        borderRadius: "4px",
        transition: "0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {label}
    </button>
  );

  return (
    <div
      style={{
        width: "260px",
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(8px)",
        color: "#eee",
        padding: "1rem",
        borderRight: "1px solid #333",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Cybersecurity */}
      {section("Cybersecurity", <FaShieldAlt />, "cyber")}
      {open.cyber && (
        <>
          {button("BloodHound Red", "bh_red")}
          {button("BloodHound Blue", "bh_blue")}
          {button("Cyber Origin", "origin")}
          {button("CORS Analyzer", "cors")}
          {button("XSS Analyzer", "xss")}
        </>
      )}

      {/* Computation */}
      {section("Computation", <FaCogs />, "computation")}
      {open.computation && (
        <>
          {button("Hash Organ", "hash")}
          {button("Spike Panel", "spike")}
          {button("Synthetic Causal Graph", "synthetic")}
        </>
      )}

      {/* Physics */}
      {section("Physics", <FaBrain />, "physics")}
      {open.physics && (
        <>
          {button("Laplace", "laplace")}
          {button("Koopman", "koopman")}
          {button("Zeta-Gamma", "zeta")}
        </>
      )}
    </div>
  );
};