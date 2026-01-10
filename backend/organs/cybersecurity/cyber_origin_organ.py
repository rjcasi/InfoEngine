from typing import Dict, Any, List
from dataclasses import dataclass
from .bloodhound_graph import BloodHoundGraph


@dataclass
class RemediationPath:
    path: List[str]
    stability_gain: float
    notes: str = ""


class BloodHoundBlueOrgan:
    """
    Backward privilege-flow organ.
    Computes remediation paths, stability basins, and risk-dissipation energy.
    """

    def __init__(self):
        self.name = "bloodhound_blue"
        self.graph = BloodHoundGraph()

    # ---------------------------------------------------------
    # BACKWARD REACHABILITY (reverse graph)
    # ---------------------------------------------------------
    def _reverse_edges(self, g: BloodHoundGraph) -> Dict[str, List[str]]:
        reverse = {node: [] for node in g.nodes}

        for src, edges in g.edges.items():
            for edge in edges:
                reverse[edge.target].append(src)

        return reverse

    def _reverse_reachable(self, start: str, reverse_edges: Dict[str, List[str]]) -> List[str]:
        visited = set()
        stack = [start]

        while stack:
            node = stack.pop()
            if node in visited:
                continue
            visited.add(node)

            for prev in reverse_edges.get(node, []):
                stack.append(prev)

        return list(visited)

    # ---------------------------------------------------------
    # REMEDIATION PATHS
    # ---------------------------------------------------------
    def _compute_remediation_paths(self, graph_data: Dict[str, Any]) -> List[RemediationPath]:
        g = self.graph.build(graph_data)
        reverse_edges = self._reverse_edges(g)

        paths = []

        for hv in g.high_value_nodes:
            backward_nodes = self._reverse_reachable(hv, reverse_edges)

            for node in backward_nodes:
                if node == hv:
                    continue

                # Reverse path = forward shortest path from node → hv
                path = g.shortest_path(node, hv)
                if not path:
                    continue

                # Stability gain = how much risk is reduced by fixing this node
                stability_gain = self._compute_stability_gain(g, path)

                paths.append(
                    RemediationPath(
                        path=path,
                        stability_gain=stability_gain,
                        notes=f"Fixing {node} reduces attack surface toward {hv}"
                    )
                )

        return paths

    # ---------------------------------------------------------
    # STABILITY GAIN
    # ---------------------------------------------------------
    def _compute_stability_gain(self, g: BloodHoundGraph, path: List[str]) -> float:
        """
        Stability gain = sum of privilege drops + edge weights
        (opposite of attack energy)
        """
        if len(path) < 2:
            return 0.0

        gain = 0.0

        for i in range(len(path) - 1):
            a = path[i]
            b = path[i + 1]

            pa = g.nodes[a].privilege
            pb = g.nodes[b].privilege

            # privilege drop = good for remediation
            gain += max(0, pa - pb)

            # edge weight = cost to traverse (removing it increases stability)
            for edge in g.edges.get(a, []):
                if edge.target == b:
                    gain += edge.weight
                    break

        return gain

    # ---------------------------------------------------------
    # SUMMARY
    # ---------------------------------------------------------
    def _summarize(self, paths: List[RemediationPath]) -> Dict[str, Any]:
        if not paths:
            return {
                "count": 0,
                "max_gain": 0,
                "avg_gain": 0,
                "most_impactful_path": None
            }

        max_gain_path = max(paths, key=lambda p: p.stability_gain)

        return {
            "count": len(paths),
            "max_gain": max_gain_path.stability_gain,
            "avg_gain": sum(p.stability_gain for p in paths) / len(paths),
            "most_impactful_path": max_gain_path.path
        }

    # ---------------------------------------------------------
    # PROCESS ENTRYPOINT
    # ---------------------------------------------------------
    def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        remediation_paths = self._compute_remediation_paths(data)

        return {
            "organ": self.name,
            "remediation_paths": [
                {
                    "path": p.path,
                    "stability_gain": p.stability_gain,
                    "notes": p.notes
                }
                for p in remediation_paths
            ],
            "summary": self._summarize(remediation_paths)
        }