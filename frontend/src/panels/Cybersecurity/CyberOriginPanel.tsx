import React, { useState } from "react";
import { post } from "../../api";

export const CyberOriginPanel: React.FC = () => {
  const [origins, setOrigins] = useState([
    { name: "https://app.com", role: "frontend", has_internal_app: true },
    { name: "https://api.app.com", role: "api" },
    { name: "https://evil.com", role: "attacker" }
  ]);

  const [corsRules, setCorsRules] = useState([
    {
      api_origin: "https://api.app.com",
      allowed_origin: "https://app.com",
      allows_credentials: true,
      wildcard: false
    }
  ]);

  const [xssSinks, setXssSinks] = useState([
    {
      attacker_origin: "https://evil.com",
      victim_origin: "https://app.com",
      sink_description: "Reflected XSS in search"
    }
  ]);

  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await post("/cyber/origin", {
        origins,
        cors_rules: corsRules,
        xss_sinks: xssSinks
      });
      setResult(res);
    } catch (err) {
      console.error("Cyber Origin error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h2>Cyber Origin Organ</h2>
      <p>Models SOP, CORS, and XSS flows between browser origins.</p>

      <button onClick={runAnalysis} disabled={loading}>
        {loading ? "Analyzing..." : "Run Origin Analysis"}
      </button>

      {result && (
        <div className="results">
          <h3>Summary</h3>
          <pre>{JSON.stringify(result.summary, null, 2)}</pre>

          <h3>Origins</h3>
          <pre>{JSON.stringify(result.nodes, null, 2)}</pre>

          <h3>Edges</h3>
          <pre>{JSON.stringify(result.edges, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};