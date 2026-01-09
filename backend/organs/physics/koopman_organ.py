import numpy as np

class KoopmanOrgan:
    def __init__(self, sample_rate=1.0):
        self.sample_rate = sample_rate

    def analyze(self, signal: np.ndarray):
        # Simple Koopman approximation: delay embedding + SVD
        x = np.array(signal, dtype=float)
        if len(x) < 3:
            return {"error": "Signal too short for Koopman analysis"}

        # Delay embedding (2D)
        X = np.vstack([x[:-1], x[1:]]).T

        # SVD
        U, S, Vt = np.linalg.svd(X, full_matrices=False)

        return {
            "singular_values": S.tolist(),
            "left_vectors": U.tolist(),
            "right_vectors": Vt.tolist()
        }