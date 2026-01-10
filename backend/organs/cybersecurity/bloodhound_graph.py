from typing import Dict, Any, List, Set
from dataclasses import dataclass
import heapq


@dataclass
class BHNode:
    name: str
    privilege: float = 1.0  # higher = more powerful


@dataclass
class BHEdge:
    source: str
    target: str
    weight: float = 1.0     # privilege cost


class BloodHoundGraph:
    """
    Shared graph engine for BloodHound Red + Blue organs.
    Provides:
      - graph building
      - shortest path
      - reachability
      - path energy
      - high-value node detection
    """

    def __init__(self):
        self.nodes: Dict[str, BHNode] = {}
        self.edges: Dict[str, List[BHEdge]] = {}
        self.high_value_nodes: List[str] = []

    # ---------------------------------------------------------
    # GRAPH BUILDING
    # ---------------------------------------------------------
    def build(self, data: Dict[str, Any]):
        self.nodes = {}
        self.edges = {}
        self.high_value_nodes = data.get("high_value_nodes", [])

        # Load nodes
        for n in data.get("nodes", []):
            name = n["name"]
            privilege = n.get("privilege", 1.0)
            self.nodes[name] = BHNode(name=name, privilege=privilege)

        # Load edges
        for e in data.get("edges", []):
            src = e["source"]
            tgt = e["target"]
            weight = e.get("weight", 1.0)

            if src not in self.edges:
                self.edges[src] = []

            self.edges[src].append(BHEdge(source=src, target=tgt, weight=weight))

        return self

    # ---------------------------------------------------------
    # REACHABILITY
    # ---------------------------------------------------------
    def reachable_nodes(self, start: str) -> Set[str]:
        visited = set()
        stack = [start]

        while stack:
            node = stack.pop()
            if node in visited:
                continue
            visited.add(node)

            for edge in self.edges.get(node, []):
                stack.append(edge.target)

        return visited

    # ---------------------------------------------------------
    # SHORTEST PATH (Dijkstra)
    # ---------------------------------------------------------
    def shortest_path(self, start: str, end: str) -> List[str]:
        if start not in self.nodes or end not in self.nodes:
            return []

        pq = [(0, start, [])]
        visited = set()

        while pq:
            cost, node, path = heapq.heappop(pq)

            if node in visited:
                continue
            visited.add(node)

            new_path = path + [node]

            if node == end:
                return new_path

            for edge in self.edges.get(node, []):
                heapq.heappush(pq, (cost + edge.weight, edge.target, new_path))

        return []

    # ---------------------------------------------------------
    # PATH ENERGY
    # ---------------------------------------------------------
    def compute_path_energy(self, path: List[str]) -> float:
        """
        Energy = sum(privilege jumps + edge weights)
        """
        if len(path) < 2:
            return 0.0

        energy = 0.0

        for i in range(len(path) - 1):
            a = path[i]
            b = path[i + 1]

            # privilege difference
            pa = self.nodes[a].privilege
            pb = self.nodes[b].privilege
            energy += max(0, pb - pa)

            # edge weight
            for edge in self.edges.get(a, []):
                if edge.target == b:
                    energy += edge.weight
                    break

        return energy