# backend/organs/memory.py
import numpy as np

def consolidate_memory(V, K, Na, Ca, attention):
    V = np.array(V)
    K = np.array(K)
    Na = np.array(Na)
    Ca = np.array(Ca)
    attention = np.array(attention)

    # Salience = attention-weighted energy
    salience = np.mean(np.abs(V) * attention)

    # Channel signature
    channel_sig = np.array([
        np.mean(K),
        np.mean(Na),
        np.mean(Ca)
    ])

    # Temporal signature (simple autocorrelation)
    autocorr = np.correlate(V - np.mean(V), V - np.mean(V), mode="full")
    temporal_sig = autocorr[len(autocorr)//2 : len(autocorr)//2 + 20]

    # Memory vector = compressed concatenation
    memory_vec = np.concatenate([
        [salience],
        channel_sig,
        temporal_sig[:5]
    ])

    # Normalize
    memory_vec = memory_vec / (np.max(np.abs(memory_vec)) + 1e-6)

    # Recall key = top 3 peaks in attention
    recall_key = np.argsort(attention)[-3:].tolist()

    return {
        "salience": float(salience),
        "channel_signature": channel_sig.tolist(),
        "temporal_signature": temporal_sig.tolist(),
        "memory_vector": memory_vec.tolist(),
        "recall_key": recall_key
    }