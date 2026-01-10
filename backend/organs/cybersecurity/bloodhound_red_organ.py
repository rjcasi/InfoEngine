from typing import Dict, Any, List
from dataclasses import dataclass
from .bloodhound_graph import BloodHoundGraph


@dataclass
class AttackPath:
    path: List[str]
    energy: float
    notes: str = ""


class BloodHoundRedOrgan:
    """
    Forward privilege-flow organ.
    Computes attack paths, escalation energy, and lateral movement trajectories.
    """

    def __init__(self):
        self.name = "bloodhound_red"
        self.graph = BloodHoundGraph()

    def _compute_attack_paths(self, graph_data: Dict[str, Any]) -> List[AttackPath]:
        """
        Uses BloodHoundGraph to compute forward privilege paths.
        """
        paths = []
        g = self.graph.build(graph_data)

        for start in g.high_value_nodes:
            for end in g.reachable_nodes(start):
                if start == end:
                    continue

                path = g.shortest_path(start, end)
                if not path:
                    continue

                energy = g.compute_path_energy(path)

                paths.append(
                    AttackPath(
                        path=path,
                        energy=energy,
                        notes=f"Privilege escalation from {start} → {end}"
                    )
                )

        return paths

    def _summarize(self, paths: List[AttackPath]) -> Dict[str, Any]:
        if not paths:
            return {
                "count": 0,
                "max_energy": 0,
                "avg_energy": 0,
                "most_critical_path": None
            }

        max_energy_path = max(paths, key=lambda p: p.energy)

        return {
            "count": len(paths),
            "max_energy": max_energy_path.energy,
            "avg_energy": sum(p.energy for p in paths) / len(paths),
            "most_critical_path": max_energy_path.path
        }

    def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Expected input:
        {
          "nodes": [...],
          "edges": [...],
          "high_value_nodes": [...]
        }
        """
        attack_paths = self._compute_attack_paths(data)

        return {
            "organ": self.name,
            "attack_paths": [
                {
                    "path": p.path,
                    "energy": p.energy,
                    "notes": p.notes
                }
                for p in attack_paths
            ],
            "summary": self._summarize(attack_paths)
        }