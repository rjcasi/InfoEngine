import numpy as np

class ActionOrgan:
    """
    Action Organ
    - Computes action S and phase S/ħ along a trajectory.
    """

    def __init__(self, hbar=1.0):
        self.hbar = hbar

    def _hamiltonian(self, name, x, p, params=None):
        if params is None:
            params = {}
        m = params.get("m", 1.0)
        k = params.get("k", 1.0)

        if name == "harmonic":
            return 0.5 * p**2 / m + 0.5 * k * x**2
        if name == "free":
            return 0.5 * p**2 / m

        return 0.5 * p**2 / m + 0.5 * k * x**2

    def compute_action_hamiltonian(self, t, x, p, H_name="harmonic", params=None):
        t = np.array(t)
        x = np.array(x)
        p = np.array(p)
        dt = np.diff(t)

        dx = np.diff(x)
        H_vals = self._hamiltonian(H_name, x[:-1], p[:-1], params)

        S_segments = p[:-1] * dx - H_vals * dt
        S = np.cumsum(S_segments)
        phase = S / self.hbar

        return {
            "time_mid": t[1:].tolist(),
            "action_segments": S_segments.tolist(),
            "action_cumulative": S.tolist(),
            "phase": phase.tolist(),
        }