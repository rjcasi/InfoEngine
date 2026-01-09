import numpy as np

class FreeEnergyOrgan:
    """
    Variational Free Energy Organ
    Implements a simplified Friston-style free energy functional:
        F = E_q[ log q(s) - log p(s, o) ]
    where q(s) is an approximate posterior and p(s, o) is the generative model.
    """

    def __init__(self, sample_rate=1.0):
        self.sample_rate = sample_rate

    def analyze(self, signal: np.ndarray):
        x = np.array(signal, dtype=float)

        # Normalize signal
        x_norm = (x - np.mean(x)) / (np.std(x) + 1e-8)

        # Approximate posterior q(s) ~ N(mu, sigma)
        mu = np.mean(x_norm)
        sigma = np.std(x_norm) + 1e-8

        # Entropy of q(s)
        entropy_q = 0.5 * np.log(2 * np.pi * np.e * sigma**2)

        # Simple generative model p(s, o)
        # Assume p(s, o) ~ exp(-|x|) for demonstration
        log_p = -np.abs(x_norm)
        expected_log_p = np.mean(log_p)

        # Free energy functional
        free_energy = entropy_q - expected_log_p

        return {
            "mu": float(mu),
            "sigma": float(sigma),
            "entropy_q": float(entropy_q),
            "expected_log_p": float(expected_log_p),
            "free_energy": float(free_energy)
        }