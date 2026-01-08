# backend/organs/causal_set.py
import numpy as np

def build_causal_set(V, threshold=0.5):
    V = np.array(V)
    events = np.where(V > threshold)[0].tolist()

    causal_links = []
    for i in range(len(events) - 1):
        causal_links.append([events[i], events[i+1]])

    return {
        "events": events,
        "causal_links": causal_links
    }