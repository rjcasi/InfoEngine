# backend/organs/ion_channels.py
import numpy as np

def simulate_ion_channels(T=100, dt=0.1):
    time = np.arange(0, T, dt)

    K = np.clip(np.random.normal(0.5, 0.1, len(time)), 0, 1)
    Na = np.clip(np.random.normal(0.5, 0.1, len(time)), 0, 1)
    Ca = np.clip(np.random.normal(0.2, 0.05, len(time)), 0, 1)

    V = (
        -65
        + 40 * Na
        - 20 * K
        + 10 * Ca
        + np.random.normal(0, 1, len(time))
    )

    return {
        "time": time.tolist(),
        "K": K.tolist(),
        "Na": Na.tolist(),
        "Ca": Ca.tolist(),
        "V": V.tolist(),
    }