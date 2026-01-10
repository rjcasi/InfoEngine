# backend/core/physics_core.py

from backend.organs.physics.symplectic_organ import SymplecticOrgan
from backend.organs.physics.action_organ import ActionOrgan

# ---------------------------------------------------------
# PoissonOrgan is not implemented yet — comment it out
# ---------------------------------------------------------
# from backend.organs.physics.poisson_organ import PoissonOrgan


class PhysicsCore:
    """
    Unified Physics Core
    - Runs symplectic Hamiltonian flow
    - Computes action and phase accumulation
    - (PoissonOrgan will be added later)
    """

    def __init__(self, dt=0.01, steps=1000, hbar=1.0):
        self.symplectic = SymplecticOrgan(dt=dt, steps=steps)
        self.action = ActionOrgan(hbar=hbar)

        # ---------------------------------------------------------
        # PoissonOrgan disabled for now
        # ---------------------------------------------------------
        # self.poisson = PoissonOrgan()

    def evolve(self, x0, p0, H_name="harmonic", params=None):
        """
        Integrate Hamiltonian flow and compute action diagnostics.
        """
        symp = self.symplectic.analyze(
            x0=x0,
            p0=p0,
            H_name=H_name,
            params=params
        )

        act = self.action.compute_action_hamiltonian(
            t=symp["time"],
            x=symp["x"],
            p=symp["p"],
            H_name=H_name,
            params=params
        )

        # ---------------------------------------------------------
        # PoissonOrgan disabled — return only symplectic + action
        # ---------------------------------------------------------
        return {
            "symplectic": symp,
            "action": act,
            # "poisson": self.poisson.analyze(...),
        }