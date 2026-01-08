# backend/organs/spike_neuron.py
import numpy as np

def simulate_spike_neuron(inputs):
    V = -65
    potentials = []
    spikes = []

    for I in inputs:
        V += I * 10 - 1
        if V > -50:
            spikes.append(1)
            V = -65
        else:
            spikes.append(0)
        potentials.append(V)

    return {"potentials": potentials, "spikes": spikes}