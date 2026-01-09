from flask import Blueprint, request, jsonify

nand_bp = Blueprint("nand", __name__)

def nand(a: int, b: int) -> int:
    # NAND truth table:
    # a b | NAND
    # 0 0 | 1
    # 0 1 | 1
    # 1 0 | 1
    # 1 1 | 0
    return 0 if (a == 1 and b == 1) else 1

@nand_bp.route("/nand", methods=["POST"])
def compute_nand():
    data = request.get_json()
    a = int(data["a"])
    b = int(data["b"])
    return jsonify({"result": nand(a, b)})