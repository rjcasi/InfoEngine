from flask import Flask, jsonify, request
from flask_cors import CORS

# ---------------------------------------------------------
# Flask App Initialization
# ---------------------------------------------------------

app = Flask(__name__)
CORS(app)  # allow React frontend to call Flask backend


# ---------------------------------------------------------
# Health / Connectivity Check
# ---------------------------------------------------------

@app.get("/ping")
def ping():
    return jsonify({"message": "Causal Engine Online"})


# ---------------------------------------------------------
# Example: Flow Map Endpoint (placeholder)
# ---------------------------------------------------------

@app.post("/flow/eigen")
def flow_eigen():
    """
    Accepts a matrix from the frontend and returns eigenvalues.
    This is just a placeholder — you will replace it with your
    real Flow Map module later.
    """
    data = request.get_json()
    matrix = data.get("matrix")

    if matrix is None:
        return jsonify({"error": "Matrix missing"}), 400

    # Example computation (replace with your math engine)
    import numpy as np
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