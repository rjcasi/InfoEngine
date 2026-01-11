import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { CommandPalette } from "./components/CommandPalette";

// Cybersecurity panels
import { BloodHoundRedPanel } from "./panels/Cybersecurity/BloodHoundRedPanel";
import { BloodHoundBluePanel } from "./panels/Cybersecurity/BloodHoundBluePanel";
import { CyberOriginPanel } from "./panels/Cybersecurity/CyberOriginPanel";
import { CORSPanel } from "./panels/Cybersecurity/CORSPanel";
import { XSSPanel } from "./panels/Cybersecurity/XSSPanel";

// NEW — Spiral Panel
import { BloodhoundSpiralPanel } from "./panels/BloodhoundSpiralPanel";

// Computation
import CausalSetSpikePanel from "./panels/CausalSetSpikePanel";
import CausalSetSyntheticPanel from "./panels/CausalSetSyntheticPanel";
import HashPanel from "./panels/HashPanel";

// Physics placeholders (replace later)
const LaplacePanel = () => <div>Laplace Panel</div>;
const KoopmanPanel = () => <div>Koopman Panel</div>;
const ZetaPanel = () => <div>Zeta-Gamma Panel</div>;

export default function App() {
  const [panel, setPanel] = useState("bh_red");
  const [fade, setFade] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Smooth fade animation on panel change
  useEffect(() => {
    setFade(false);
    const t = setTimeout(() => setFade(true), 150);
    return () => clearTimeout(t);
  }, [panel]);

  // Keyboard shortcuts for quick switching
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Command Palette (Ctrl+K)
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }

      // Quick panel switching
      if (e.key === "1") setPanel("bh_red");
      if (e.key === "2") setPanel("bh_blue");
      if (e.key === "3") setPanel("origin");
      if (e.key === "4") setPanel("cors");
      if (e.key === "5") setPanel("xss");
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="app-container">
      <Sidebar setPanel={setPanel} />

      {/* Command Palette Overlay */}
      <CommandPalette
        open={paletteOpen}
        setOpen={setPaletteOpen}
        setPanel={setPanel}
      />

      {/* Main Panel Area */}
      <div className={`panel-container ${fade ? "fade-in" : "fade-out"}`}>
        {/* Cybersecurity */}
        {panel === "bh_red" && <BloodHoundRedPanel />}
        {panel === "bh_blue" && <BloodHoundBluePanel />}
        {panel === "bh_spiral" && <BloodhoundSpiralPanel />}
        {panel === "origin" && <CyberOriginPanel />}
        {panel === "cors" && <CORSPanel />}
        {panel === "xss" && <XSSPanel />}

        {/* Computation */}
        {panel === "spike" && <CausalSetSpikePanel />}
        {panel === "synthetic" && <CausalSetSyntheticPanel />}
        {panel === "hash" && <HashPanel />}

        {/* Physics */}
        {panel === "laplace" && <LaplacePanel />}
        {panel === "koopman" && <KoopmanPanel />}
        {panel === "zeta" && <ZetaPanel />}
      </div>
    </div>
  );
}