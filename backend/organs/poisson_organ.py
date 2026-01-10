# backend/organs/poisson_organ.py

from typing import Dict, Any, List
import numpy as np

class PoissonOrgan:
    """
    Poisson Organ
    -------------
    Generates transverse dynamics using the canonical Poisson bracket.
    This organ acts as the symplectic engine of the Physics Core.

    Core operations:
    - compute_bracket(f, g, q, p)
    - hamiltonian_flow(H, q, p)
    """

    def __init__(self):
        self.name = "PoissonOrgan"
        self.version = "1.0.0"

    # ---------------------------------------------------------
    # Proof of life
    # ---------------------------------------------------------
    def ping(self) -> Dict[str, Any]:
        return {
            "organ": self.name,
            "version": self.version,
            "status": "alive",
            "message": "Poisson structure initialized"
        }

    # ---------------------------------------------------------
    # Canonical Poisson bracket
    # ---------------------------------------------------------
    def compute_bracket(
        self,
        f_grad: Dict[str, List[float]],
        g_grad: Dict[str, List[float]]
    ) -> float:
        """
        Computes {f, g} = Σ_i (df/dq_i * dg/dp_i - df/dp_i * dg/dq_i)

        Inputs:
            f_grad: {"q": [...], "p": [...]}
            g_grad: {"q": [...], "p": [...]}

        Returns:
            float: Poisson bracket value
        """

        dq_f = np.array(f_grad["q"])
        dp_f = np.array(f_grad["p"])
        dq_g = np.array(g_grad["q"])
        dp_g = np.array(g_grad["p"])

        return float(np.dot(dq_f, dp_g) - np.dot(dp_f, dq_g))

    # ---------------------------------------------------------
    # Hamiltonian vector field
    # ---------------------------------------------------------
    def hamiltonian_flow(
        self,
        H_grad: Dict[str, List[float]]
    ) -> Dict[str, List[float]]:
        """
        Computes the Hamiltonian flow:
            dq/dt = ∂H/∂p
            dp/dt = -∂H/∂q
        """

        dq_dt = np.array(H_grad["p"]).tolist()
        dp_dt = (-np.array(H_grad["q"])).tolist()

        return {
            "dq_dt": dq_dt,
            "dp_dt": dp_dt
        }

    # ---------------------------------------------------------
    # Main cockpit endpoint
    # ---------------------------------------------------------
    def analyze(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Unified cockpit endpoint.

        Expected payload:
        {
            "mode": "bracket" or "flow",
            "f_grad": {"q": [...], "p": [...]},
            "g_grad": {"q": [...], "p": [...]},
            "H_grad": {"q": [...], "p": [...]}
        }
        """

        mode = payload.get("mode", "ping")

        if mode == "ping":
            return self.ping()

        if mode == "bracket":
            f_grad = payload["f_grad"]
            g_grad = payload["g_grad"]
            value = self.compute_bracket(f_grad, g_grad)
            return {
                "mode": "bracket",
                "poisson_bracket": value
            }

        if mode == "flow":
            H_grad = payload["H_grad"]
            flow = self.hamiltonian_flow(H_grad)
            return {
                "mode": "flow",
                "flow": flow
            }

        return {
            "error": f"Unknown mode '{mode}'"
        }