from flask import Flask, jsonify, request
from flask_cors import CORS
from organs.eigen import eigen_bp
from organs.nand import nand_bp
from organs.power_spectrum import power_spectrum_bp


import numpy as np

# ---------------------------------------------------------
# Flask App Initialization
# ---------------------------------------------------------

app = Flask(__name__)
CORS(app)  # allow React frontend to call Flask backend
app.register_blueprint(eigen_bp)
app.register_blueprint(nand_bp)
app.register_blueprint(power_spectrum_bp)

# ---------------------------------------------------------
# Health / Connectivity Check
# ---------------------------------------------------------

@app.get("/ping")
def ping():
    return jsonify({"message": "Causal Engine Online"})


# ---------------------------------------------------------
# Flow Map Organ — Eigenvalues / Eigenvectors
# ---------------------------------------------------------

@app.post("/flow/eigen")
def flow_eigen():
    data = request.get_json()
    matrix = data.get("matrix")

    if matrix is None:
        return jsonify({"error": "Matrix missing"}), 400

    A = np.array(matrix)
    vals, vecs = np.linalg.eig(A)

    return jsonify({
        "eigenvalues": vals.tolist(),
        "eigenvectors": vecs.tolist()
    })


# ---------------------------------------------------------
# Root Route (optional)
# ---------------------------------------------------------

@app.get("/")
def root():
    return jsonify({"status": "InfoEngine Flask backend running"})


# ---------------------------------------------------------
# Main Entry Point
# ---------------------------------------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)