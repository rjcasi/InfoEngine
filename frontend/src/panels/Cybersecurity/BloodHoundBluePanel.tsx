import React, { useState } from "react";
import { post } from "../../api";

export const BloodHoundBluePanel: React.FC = () => {
  const [nodes, setNodes] = useState([
    { name: "User", privilege: 1 },
    { name: "Workstation", privilege: 2 },
    { name: "Server", privilege: 3 },
    { name: "DomainAdmin", privilege: 5 },
  ]);

  const [edges, setEdges] = useState([
    { source: "User", target: "Workstation", weight: 1 },
    { source: "Workstation", target: "Server", weight: 1 },
    { source: "Server", target: "DomainAdmin", weight: 2 },
  ]);

  const [highValueNodes, setHighValueNodes] = useState(["DomainAdmin"]);

  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await post("/cyber/bloodhound/blue", {
        nodes,
        edges,
        high_value_nodes: highValueNodes,
      });
      setResult(res);
    } catch (err) {
      console.error("BloodHound Blue error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h2>BloodHound Blue Organ</h2>
      <p>Backward privilege-flow analysis (remediation physics).</p>

      <button onClick={runAnalysis} disabled={loading}>
        {loading ? "Analyzing..." : "Run Blue Analysis"}
      </button>

      {result && (
        <div className="results">
          <h3>Summary</h3>
          <pre>{JSON.stringify(result.summary, null, 2)}</pre>

          <h3>Remediation Paths</h3>
          <pre>{JSON.stringify(result.remediation_paths, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};