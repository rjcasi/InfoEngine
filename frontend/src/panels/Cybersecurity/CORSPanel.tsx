import React, { useState } from "react";
import { post } from "../../api";

export const CORSPanel: React.FC = () => {
  const [rules, setRules] = useState([
    {
      api_origin: "https://api.app.com",
      allowed_origin: "https://app.com",
      allows_credentials: true,
      wildcard: false,
      notes: "Primary API → App"
    },
    {
      api_origin: "https://api.app.com",
      allowed_origin: "*",
      allows_credentials: false,
      wildcard: true,
      notes: "Wildcard read access"
    }
  ]);

  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await post("/cyber/cors", { rules });
      setResult(res);
    } catch (err) {
      console.error("CORS Organ error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h2>CORS Organ</h2>
      <p>Analyzes membrane permeability and cross-origin exposure.</p>

      <button onClick={runAnalysis} disabled={loading}>
        {loading ? "Analyzing..." : "Run CORS Analysis"}
      </button>

      {result && (
        <div className="results">
          <h3>Summary</h3>
          <pre>{JSON.stringify(result.summary, null, 2)}</pre>

          <h3>CORS Edges</h3>
          <pre>{JSON.stringify(result.edges, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};ne