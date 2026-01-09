# backend/organs/phase_space.py
import numpy as np

def compute_phase_space(V, dt=0.1):
    V = np.array(V)
    dV = np.diff(V) / dt
    V_mid = V[:-1]

    return {
        "V": V_mid.tolist(),
        "dV": dV.tolist()
    }