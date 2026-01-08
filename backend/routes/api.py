from flask import Blueprint, jsonify
from organs.causal_set import generate_causal_set


api_blueprint = Blueprint("api", __name__)

@api_blueprint.route("/hello")
def hello():
    return jsonify({"message": "Hello from InfoEngine Flask backend!"})


@app.route("/api/causal-set", methods=["GET"])
def api_causal_set():
    data = generate_causal_set()
    return jsonify(data)