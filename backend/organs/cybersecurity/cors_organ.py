from typing import Dict, Any, List
from dataclasses import dataclass


@dataclass
class CORSRule:
    api_origin: str
    allowed_origin: str
    allows_credentials: bool = False
    wildcard: bool = False
    notes: str = ""


@dataclass
class CORSEdge:
    source: str
    target: str
    permeability: float
    risk: float
    notes: str = ""


class CORSOrgan:
    """
    Models CORS membrane apertures between origins.
    Computes:
      - permeability (how open the membrane is)
      - risk (how dangerous the aperture is)
      - misconfigurations (wildcards + credentials)
    """

    def __init__(self):
        self.name = "cors"

    # ---------------------------------------------------------
    # BUILD RULES
    # ---------------------------------------------------------
    def _build_rules(self, data: Dict[str, Any]) -> List[CORSRule]:
        rules = []
        for r in data.get("rules", []):
            rules.append(
                CORSRule(
                    api_origin=r["api_origin"],
                    allowed_origin=r["allowed_origin"],
                    allows_credentials=r.get("allows_credentials", False),
                    wildcard=r.get("wildcard", False),
                    notes=r.get("notes", "")
                )
            )
        return rules

    # ---------------------------------------------------------
    # COMPUTE PERMEABILITY + RISK
    # ---------------------------------------------------------
    def _compute_edges(self, rules: List[CORSRule]) -> List[CORSEdge]:
        edges = []

        for r in rules:
            # Base permeability
            permeability = 1.0

            # Wildcard = more open membrane
            if r.wildcard:
                permeability += 1.0

            # Credentials + wildcard = extremely dangerous
            risk = 0.0
            if r.wildcard and r.allows_credentials:
                risk = 3.0
            elif r.allows_credentials:
                risk = 2.0
            elif r.wildcard:
                risk = 1.5
            else:
                risk = 0.5

            edges.append(
                CORSEdge(
                    source=r.api_origin,
                    target=r.allowed_origin,
                    permeability=permeability,
                    risk=risk,
                    notes=r.notes or "CORS rule"
                )
            )

        return edges

    # ---------------------------------------------------------
    # SUMMARY
    # ---------------------------------------------------------
    def _summarize(self, edges: List[CORSEdge]) -> Dict[str, Any]:
        if not edges:
            return {
                "total_rules": 0,
                "avg_permeability": 0,
                "avg_risk": 0,
                "high_risk_pairs": []
            }

        high_risk = [
            f"{e.source} → {e.target}"
            for e in edges
            if e.risk >= 2.0
        ]

        return {
            "total_rules": len(edges),
            "avg_permeability": sum(e.permeability for e in edges) / len(edges),
            "avg_risk": sum(e.risk for e in edges) / len(edges),
            "high_risk_pairs": high_risk
        }

    # ---------------------------------------------------------
    # PROCESS ENTRYPOINT
    # ---------------------------------------------------------
    def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        rules = self._build_rules(data)
        edges = self._compute_edges(rules)

        return {
            "organ": self.name,
            "edges": [
                {
                    "source": e.source,
                    "target": e.target,
                    "permeability": e.permeability,
                    "risk": e.risk,
                    "notes": e.notes
                }
                for e in edges
            ],
            "summary": self._summarize(edges)
        }