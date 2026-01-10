import React, { useState } from "react";
import { post } from "../../api";

export const BloodHoundRedPanel: React.FC = () => {
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
      const res = await post("/cyber/bloodhound/red", {
        nodes,
        edges,
        high_value_nodes: highValueNodes,
      });
      setResult(res);
    } catch (err) {
      console.error("BloodHound Red error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h2>BloodHound Red Organ</h2>
      <p>Forward privilege-flow analysis (attack-path physics).</p>

      <button onClick={runAnalysis} disabled={loading}>
        {loading ? "Analyzing..." : "Run Red Analysis"}
      </button>

      {result && (
        <div className="results">
          <h3>Summary</h3>
          <pre>{JSON.stringify(result.summary, null, 2)}</pre>

          <h3>Attack Paths</h3>
          <pre>{JSON.stringify(result.attack_paths, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};