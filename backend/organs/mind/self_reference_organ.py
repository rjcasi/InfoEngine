import numpy as np

class SelfReferenceOrgan:
    """
    Self-Reference Organ
    Computes fixed points, self-maps, and recursive echoes of the signal.
    Symbolic self-reference is approximated by iterating a transformation
    until convergence or oscillation.
    """

    def __init__(self, iterations=32):
        self.iterations = iterations

    def analyze(self, signal: np.ndarray):
        x = np.array(signal, dtype=float)

        if len(x) == 0:
            return {"error": "Empty signal"}

        # Normalize
        x0 = (x - np.mean(x)) / (np.std(x) + 1e-8)

        # Recursive self-map: f(x) = tanh(Wx)
        # Use a simple scalar contraction for stability
        W = 0.85

        history = []
        current = x0.copy()

        for _ in range(self.iterations):
            next_state = np.tanh(W * current)
            history.append(next_state.tolist())

            # Check for fixed point
            if np.allclose(next_state, current, atol=1e-6):
                return {
                    "fixed_point": next_state.tolist(),
                    "iterations": len(history),
                    "trajectory": history
                }

            current = next_state

        # If no fixed point, return final state + trajectory
        return {
            "fixed_point": None,
            "iterations": self.iterations,
            "trajectory": history,
            "final_state": current.tolist()
        }