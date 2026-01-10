from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np

# ---------------------------------------------------------
# Import organs from new folder structure
# ---------------------------------------------------------

# Physics organs
from backend.organs.physics.power_spectrum_organ import PowerSpectrumOrgan
from backend.organs.physics.laplace_organ import LaplaceOrgan
from backend.organs.physics.koopman_organ import KoopmanOrgan
from backend.organs.physics.zeta_gamma_organ import ZetaGammaOrgan
from backend.organs.physics.free_energy import FreeEnergyOrgan

# Computation organs
from backend.organs.computation.hash import HashOrgan
from backend.organs.computation.causal_set import CausalSetOrgan

# Mind organs
from backend.organs.mind.self_reference_organ import SelfReferenceOrgan
from backend.organs.mind.consciousness_organ import ConsciousnessOrgan

router = APIRouter()

# ---------------------------------------------------------
# Shared payload model
# ---------------------------------------------------------

class SignalPayload(BaseModel):
    signal: list[float]
    sample_rate: float = 1.0


# ---------------------------------------------------------
# Power Spectrum Organ
# ---------------------------------------------------------

@router.post("/power_spectrum/analyze")
def analyze_power_spectrum(payload: SignalPayload):
    organ = PowerSpectrumOrgan(sample_rate=payload.sample_rate)
    return organ.analyze(np.array(payload.signal))


# ---------------------------------------------------------
# Hash Organ
# ---------------------------------------------------------

@router.post("/hash/analyze")
def analyze_hash(payload: SignalPayload):
    organ = HashOrgan()
    return organ.analyze(np.array(payload.signal))


# ---------------------------------------------------------
# Causal Set Organ
# ---------------------------------------------------------

@router.post("/causal_set/analyze")
def analyze_causal_set(payload: SignalPayload):
    organ = CausalSetOrgan()
    return organ.analyze(np.array(payload.signal))


# ---------------------------------------------------------
# Zeta-Gamma Organ
# ---------------------------------------------------------

@router.post("/zeta_gamma/analyze")
def analyze_zeta_gamma(payload: SignalPayload):
    organ = ZetaGammaOrgan()
    return organ.analyze(np.array(payload.signal))


# ---------------------------------------------------------
# Koopman Organ
# ---------------------------------------------------------

@router.post("/koopman/analyze")
def analyze_koopman(payload: SignalPayload):
    organ = KoopmanOrgan()
    return organ.analyze(np.array(payload.signal))


# ---------------------------------------------------------
# Self-Reference Organ
# ---------------------------------------------------------

@router.post("/self_reference/analyze")
def analyze_self_reference(payload: SignalPayload):
    organ = SelfReferenceOrgan()
    return organ.analyze(np.array(payload.signal))


# ---------------------------------------------------------
# Free Energy Organ
# ---------------------------------------------------------

@router.post("/free_energy/analyze")
def analyze_free_energy(payload: SignalPayload):
    organ = FreeEnergyOrgan()
    return organ.analyze(np.array(payload.signal))


# ---------------------------------------------------------
# Consciousness Organ
# ---------------------------------------------------------

@router.post("/consciousness/analyze")
def analyze_consciousness(payload: SignalPayload):
    organ = ConsciousnessOrgan()
    return organ.analyze(np.array(payload.signal))


# ---------------------------------------------------------
# Laplace Organ (with method switching)
# ---------------------------------------------------------

class LaplacePayload(BaseModel):
    signal: list[float]
    sample_rate: float = 1.0
    method: str = "prony"   # "prony", "matrix_pencil", "burg", "continuous_time"
    order: int = 10

@router.post("/laplace/analyze")
def analyze_laplace(payload: LaplacePayload):
    organ = LaplaceOrgan(
        sample_rate=payload.sample_rate,
        method=payload.method,
        order=payload.order
    )
    return organ.analyze(np.array(payload.signal))