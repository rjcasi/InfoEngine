# backend/organs/attention_tensor.py
import numpy as np

def compute_attention_tensor(V, K, Na, Ca, events):
    V = np.array(V)
    K = np.array(K)
    Na = np.array(Na)
    Ca = np.array(Ca)

    # Spike-frequency modulation
    freq = np.abs(np.diff(V))
    freq = np.pad(freq, (0,1))

    # Ion-channel gating influence
    gating = 0.4*K + 0.4*Na + 0.2*Ca

    # Density field (local neighborhood energy)
    window = 5
    density = np.convolve(np.abs(V), np.ones(window)/window, mode="same")

    # Causal influence (event pulses)
    causal_field = np.zeros_like(V)
    for e in events:
        if e < len(causal_field):
            causal_field[e] = 1.0

    # Final attention tensor
    attention = (
        0.5*freq +
        0.3*gating +
        0.2*density +
        0.4*causal_field
    )

    # Normalize
    attention = attention / (np.max(attention) + 1e-6)

    return {
        "attention": attention.tolist(),
        "freq": freq.tolist(),
        "gating": gating.tolist(),
        "density": density.tolist(),
        "causal_field": causal_field.tolist()
    }