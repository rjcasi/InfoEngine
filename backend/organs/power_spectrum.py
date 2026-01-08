import numpy as np
from flask import Blueprint, request, jsonify

power_spectrum_bp = Blueprint("power_spectrum", __name__)

@power_spectrum_bp.route("/power-spectrum", methods=["POST"])
def compute_power_spectrum():
    data = request.get_json()

    # Expect an array of membrane potentials over time
    potentials = np.array(data["potentials"], dtype=float)

    # Optional: sampling rate in Hz (default 1.0 if not provided)
    dt = float(data.get("dt", 1.0))  # time step
    fs = 1.0 / dt                    # sampling frequency

    # Compute FFT
    fft_vals = np.fft.rfft(potentials)
    freqs = np.fft.rfftfreq(len(potentials), d=dt)

    # Power spectrum (magnitude squared)
    power = np.abs(fft_vals) ** 2

    # Convert to plain Python lists for JSON
    return jsonify({
        "frequencies": freqs.tolist(),
        "power": power.tolist()
    })