from typing import Dict, Any, List
from dataclasses import dataclass


@dataclass
class XSSSink:
    attacker_origin: str
    victim_origin: str
    sink_description: str = ""
    severity: float = 1.0


@dataclass
class XSSFlow:
    source: str
    target: str
    energy: float
    notes: str = ""


class XSSOrgan:
    """
    Models XSS origin-identity hijacks.
    Computes:
      - basin jumps (attacker → victim)
      - hijack energy
      - sink severity
      - risk scoring
    """

    def __init__(self):
        self.name = "xss"

    # ---------------------------------------------------------
    # BUILD SINKS
    # ---------------------------------------------------------
    def _build_sinks(self, data: Dict[str, Any]) -> List[XSSSink]:
        sinks = []
        for s in data.get("sinks", []):
            sinks.append(
                XSSSink(
                    attacker_origin=s["attacker_origin"],
                    victim_origin=s["victim_origin"],
                    sink_description=s.get("sink_description", ""),
                    severity=s.get("severity", 1.0)
                )
            )
        return sinks

    # ---------------------------------------------------------
    # COMPUTE FLOWS
    # ---------------------------------------------------------
    def _compute_flows(self, sinks: List[XSSSink]) -> List[XSSFlow]:
        flows = []

        for s in sinks:
            # Hijack energy = severity * 2
            # (XSS is always high-energy because it bypasses SOP)
            energy = s.severity * 2.0

            flows.append(
                XSSFlow(
                    source=s.attacker_origin,
                    target=s.victim_origin,
                    energy=energy,
                    notes=s.sink_description or "XSS sink"
                )
            )

        return flows

    # ---------------------------------------------------------
    # SUMMARY
    # ---------------------------------------------------------
    def _summarize(self, flows: List[XSSFlow]) -> Dict[str, Any]:
        if not flows:
            return {
                "total_sinks": 0,
                "max_energy": 0,
                "avg_energy": 0,
                "critical_sinks": []
            }

        max_energy = max(f.energy for f in flows)
        critical = [f"{f.source} → {f.target}" for f in flows if f.energy >= max_energy]

        return {
            "total_sinks": len(flows),
            "max_energy": max_energy,
            "avg_energy": sum(f.energy for f in flows) / len(flows),
            "critical_sinks": critical
        }

    # ---------------------------------------------------------
    # PROCESS ENTRYPOINT
    # ---------------------------------------------------------
    def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        sinks = self._build_sinks(data)
        flows = self._compute_flows(sinks)

        return {
            "organ": self.name,
            "flows": [
                {
                    "source": f.source,
                    "target": f.target,
                    "energy": f.energy,
                    "notes": f.notes
                }
                for f in flows
            ],
            "summary": self._summarize(flows)
        }