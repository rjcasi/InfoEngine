import hashlib
import numpy as np

class HashOrgan:
    """
    Hash Organ
    Computes multiple cryptographic and non-cryptographic hashes
    of the input signal. Useful for entropy, identity, and
    computational fingerprinting.
    """

    def __init__(self):
        pass

    def analyze(self, signal: np.ndarray):
        x = np.array(signal, dtype=float)

        # Convert to bytes
        byte_data = x.tobytes()

        # Cryptographic hashes
        sha256 = hashlib.sha256(byte_data).hexdigest()
        sha1 = hashlib.sha1(byte_data).hexdigest()
        md5 = hashlib.md5(byte_data).hexdigest()

        # Non-cryptographic: simple rolling hash
        rolling = 0
        for v in x:
            rolling = (rolling * 1315423911) ^ int(v * 1000000)

        return {
            "sha256": sha256,
            "sha1": sha1,
            "md5": md5,
            "rolling_hash": int(rolling)
        }