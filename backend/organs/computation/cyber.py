# backend/organs/cyber.py
import random
import string

def generate_fuzz(seed=None, length=8):
    random.seed(seed)
    chars = string.ascii_letters + string.digits + "!@#$%^&*()"
    return "".join(random.choice(chars) for _ in range(length))

def defend(input_str):
    score = 0

    if any(c in "!@#$%^&*()" for c in input_str):
        score += 1

    if any(c.isdigit() for c in input_str):
        score += 1

    if any(c.isupper() for c in input_str):
        score += 1

    if len(input_str) > 10:
        score += 1

    return score

def cyber_round(seed=None):
    fuzz = generate_fuzz(seed)
    defense_score = defend(fuzz)

    next_seed = defense_score * 17

    return {
        "fuzz": fuzz,
        "defense_score": defense_score,
        "next_seed": next_seed
    }