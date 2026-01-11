import { RiskSpiral } from "../components/RiskSpiral";

export function BloodhoundSpiralPanel() {
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Bloodhound Risk Spiral</h2>

      <RiskSpiral
        risk={7.5}
        prevRisk={5.2}
        mode="hybrid"
      />
    </div>
  );
}