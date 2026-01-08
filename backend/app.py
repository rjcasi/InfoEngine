from flask import Flask, request, jsonify
from flask_cors import CORS

# === Import all organs ===
from organs.eigen import compute_eigen
from organs.nand import nand
from organs.spike_neuron import simulate_spike_neuron
from organs.power_spectrum import compute_power_spectrum
from organs.ion_channels import simulate_ion_channels
from organs.phase_space import compute_phase_space
from organs.causal_set import build_causal_set
from organs.attention_tensor import compute_attention_tensor

app = Flask(__name__)
CORS(app)


# ---------------------------------------------------------
# Backend heartbeat
# ---------------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "OK"})


# ---------------------------------------------------------
# Eigen Organ
# ---------------------------------------------------------
@app.route("/eigen", methods=["POST"])
def eigen_route():
    data = request.get_json()
    matrix = data.get("matrix")
    result = compute_eigen(matrix)
    return jsonify(result)


# ---------------------------------------------------------
# NAND Organ
# ---------------------------------------------------------
@app.route("/nand", methods=["POST"])
def nand_route():
    data = request.get_json()
    a = data.get("a")
    b = data.get("b")
    result = nand(a, b)
    return jsonify(result)


# ---------------------------------------------------------
# Spike Neuron Organ
# ---------------------------------------------------------
@app.route("/spike", methods=["POST"])
def spike_route():
    data = request.get_json()
    inputs = data.get("inputs")
    result = simulate_spike_neuron(inputs)
    return jsonify(result)


# ---------------------------------------------------------
# Power Spectrum Organ
# ---------------------------------------------------------
@app.route("/power-spectrum", methods=["POST"])
def power_spectrum_route():
    data = request.get_json()
    potentials = data.get("potentials")
    dt = data.get("dt", 1.0)
    result = compute_power_spectrum(potentials, dt)
    return jsonify(result)


# ---------------------------------------------------------
# Ion Channel Organ
# ---------------------------------------------------------
@app.route("/ion-channels", methods=["GET"])
def ion_channels_route():
    result = simulate_ion_channels()
    return jsonify(result)


# ---------------------------------------------------------
# Phase-Space Organ
# ---------------------------------------------------------
@app.route("/phase-space", methods=["POST"])
def phase_space_route():
    data = request.get_json()
    V = data.get("V")
    dt = data.get("dt", 0.1)
    result = compute_phase_space(V, dt)
    return jsonify(result)


# ---------------------------------------------------------
# Causal Set Organ
# ---------------------------------------------------------
@app.route("/causal-set", methods=["POST"])
def causal_set_route():
    data = request.get_json()
    V = data.get("V")
    threshold = data.get("threshold", 0.5)
    result = build_causal_set(V, threshold)
    return jsonify(result)


# ---------------------------------------------------------
# Attention Tensor Organ
# ---------------------------------------------------------
@app.route("/attention-tensor", methods=["POST"])
def attention_tensor_route():
    data = request.get_json()

    V = data["V"]
    K = data["K"]
    Na = data["Na"]
    Ca = data["Ca"]
    events = data["events"]

    result = compute_attention_tensor(V, K, Na, Ca, events)
    return jsonify(result)


# ---------------------------------------------------------
# Run server
# ---------------------------------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)