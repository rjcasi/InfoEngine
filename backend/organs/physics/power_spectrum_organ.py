import numpy as np

class PowerSpectrumOrgan:
    def __init__(self, sample_rate=1.0):
        self.sample_rate = sample_rate

    def analyze(self, signal: np.ndarray):
        dt = 1.0 / self.sample_rate

        fft_vals = np.fft.rfft(signal)
        freqs = np.fft.rfftfreq(len(signal), d=dt)
        power = np.abs(fft_vals) ** 2

        return {
            "frequencies": freqs.tolist(),
            "power": power.tolist()
        }