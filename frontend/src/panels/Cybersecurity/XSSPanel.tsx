import React, { useState } from "react";
import { post } from "../../api";

export const XSSPanel: React.FC = () => {
  const [sinks, setSinks] = useState([
    {
      attacker_origin: "https://evil.com",
      victim_origin: "https://app.com",
      sink_description: "Reflected XSS in search",
      severity: 1.5
    },
    {
      attacker_origin: "https://evil.com",
      victim_origin: "https://api.app.com",
      sink_description: "Stored XSS in comments",
      severity: 2.0
    }
  ]);

  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await post("/cyber/xss", { sinks });
      setResult(res);
    } catch (err) {
      console.error("XSS Organ error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h2>XSS Organ</h2>
      <p>Analyzes origin-identity hijacks and basin jumps.</p>

      <button onClick={runAnalysis} disabled={loading}>
        {loading ? "Analyzing..." : "Run XSS Analysis"}
      </button>

      {result && (
        <div className="results">
          <h3>Summary</h3>
          <pre>{JSON.stringify(result.summary, null, 2)}</pre>

          <h3>XSS Flows</h3>
          <pre>{JSON.stringify(result.flows, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};