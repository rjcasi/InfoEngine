import numpy as np
from flask import Blueprint, request, jsonify

eigen_bp = Blueprint("eigen", __name__)

@eigen_bp.route("/eigen", methods=["POST"])
def compute_eigen():
    data = request.get_json()
    matrix = np.array(data["matrix"], dtype=float)

    vals, vecs = np.linalg.eig(matrix)

    return jsonify({
        "eigenvalues": vals.tolist(),
        "eigenvectors": vecs.tolist()
    })