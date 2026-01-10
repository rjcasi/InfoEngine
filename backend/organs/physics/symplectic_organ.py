import numpy as np

class SymplecticOrgan:
    """
    Symplectic Organ
    - Integrates Hamiltonian dynamics using a symplectic integrator.
    """

    def __init__(self, dt=0.01, steps=1000):
        self.dt = dt
        self.steps = steps

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

    def _dH_dx(self, name, x, p, params=None):
        if params is None:
            params = {}
        k = params.get("k", 1.0)
        if name == "free":
            return np.zeros_like(x)
        return k * x

    def _dH_dp(self, name, x, p, params=None):
        if params is None:
            params = {}
        m = params.get("m", 1.0)
        return p / m

    def _integrate(self, x0, p0, H_name, params):
        dt = self.dt
        steps = self.steps

        x = np.zeros(steps + 1)
        p = np.zeros(steps + 1)
        t = np.linspace(0, steps * dt, steps + 1)

        x[0] = x0
        p[0] = p0

        for n in range(steps):
            dH_dx_n = self._dH_dx(H_name, x[n], p[n], params)
            p_half = p[n] - 0.5 * dt * dH_dx_n

            dH_dp_half = self._dH_dp(H_name, x[n], p_half, params)
            x[n + 1] = x[n] + dt * dH_dp_half

            dH_dx_next = self._dH_dx(H_name, x[n + 1], p_half, params)
            p[n + 1] = p_half - 0.5 * dt * dH_dx_next

        return t, x, p

    def analyze(self, x0, p0, H_name="harmonic", params=None):
        t, x, p = self._integrate(x0, p0, H_name, params)
        H_vals = self._hamiltonian(H_name, x, p, params)

        return {
            "time": t.tolist(),
            "x": x.tolist(),
            "p": p.tolist(),
            "hamiltonian": H_name,
            "energy_values": H_vals.tolist(),
            "energy_mean": float(np.mean(H_vals)),
            "energy_std": float(np.std(H_vals)),
        }