import numpy as np

class ConsciousnessOrgan:
    """
    Consciousness Organ
    Computes multi-scale integration, prediction error,
    and global workspace ignition from a 1D signal.
    """

    def __init__(self, window=32):
        self.window = window

    def analyze(self, signal: np.ndarray):
        x = np.array(signal, dtype=float)

        if len(x) < 4:
            return {"error": "Signal too short for consciousness analysis"}

        # Normalize
        x_norm = (x - np.mean(x)) / (np.std(x) + 1e-8)

        # --- 1. Prediction error (Friston-style)
        shifted = np.roll(x_norm, 1)
        prediction_error = float(np.mean((x_norm - shifted)**2))

        # --- 2. Multi-scale integration (Tononi-style Φ approximation)
        half = len(x_norm) // 2
        left = x_norm[:half]
        right = x_norm[half:]

        phi = float(abs(np.cov(left, right)[0, 1]))

        # --- 3. Global workspace ignition
        # A simple model: ignition = variance of the moving average
        if len(x_norm) >= self.window:
            kernel = np.ones(self.window) / self.window
            moving_avg = np.convolve(x_norm, kernel, mode='valid')
            ignition = float(np.var(moving_avg))
        else:
            ignition = float(np.var(x_norm))

        # --- 4. Coherence (synchrony)
        fft_vals = np.fft.rfft(x_norm)
        coherence = float(np.mean(np.abs(fft_vals)))

        return {
            "prediction_error": prediction_error,
            "phi_integration": phi,
            "global_workspace_ignition": ignition,
            "coherence": coherence
        }