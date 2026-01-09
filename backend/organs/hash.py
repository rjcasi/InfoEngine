import hashlib

def compute_hash(data: str, algorithm: str = "sha256"):
    """
    Compute a hash digest for the given string using the chosen algorithm.
    """

    if algorithm not in hashlib.algorithms_available:
        return {
            "error": f"Unsupported algorithm: {algorithm}",
            "available": sorted(list(hashlib.algorithms_available))
        }

    encoded = data.encode("utf-8")
    h = hashlib.new(algorithm)
    h.update(encoded)

    return {
        "algorithm": algorithm,
        "input_length": len(data),
        "digest_hex": h.hexdigest(),
        "digest_bytes": list(h.digest())
    }