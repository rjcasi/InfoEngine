import numpy as np

class CausalSetOrgan:
    """
    Causal Set Organ
    Computes a simple causal set structure from a 1D signal.
    A causal set is a partially ordered set (poset) where
    elements are ordered by a causal relation.
    """

    def __init__(self):
        pass

    def analyze(self, signal: np.ndarray):
        x = np.array(signal, dtype=float)

        n = len(x)
        if n < 2:
            return {"error": "Signal too short for causal set analysis"}

        # Build causal relation: i < j if x[i] < x[j]
        causal_matrix = np.zeros((n, n), dtype=int)
        for i in range(n):
            for j in range(i + 1, n):
                if x[i] < x[j]:
                    causal_matrix[i, j] = 1

        # Count relations
        relation_count = int(np.sum(causal_matrix))

        # Compute transitive reduction (very simplified)
        transitive_reduction = causal_matrix.copy()
        for i in range(n):
            for j in range(n):
                if causal_matrix[i, j]:
                    for k in range(n):
                        if causal_matrix[j, k]:
                            transitive_reduction[i, k] = 0

        return {
            "causal_matrix": causal_matrix.tolist(),
            "relation_count": relation_count,
            "transitive_reduction": transitive_reduction.tolist()
        }