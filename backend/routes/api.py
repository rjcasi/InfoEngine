from flask import Blueprint, jsonify
from organs.causal_set import generate_causal_set
from organs.hash import compute_hash
from flask import request, jsonify



api_blueprint = Blueprint("api", __name__)

@api_blueprint.route("/hello")
def hello():
    return jsonify({"message": "Hello from InfoEngine Flask backend!"})


@app.route("/api/causal-set", methods=["GET"])
def api_causal_set():
    data = generate_causal_set()
    return jsonify(data)

@app.route("/api/hash", methods=["POST"])
def api_hash():
    payload = request.json
    data = payload.get("data", "")
    algorithm = payload.get("algorithm", "sha256")

    result = compute_hash(data, algorithm)
    return jsonify(result)