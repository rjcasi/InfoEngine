import numpy as np
from numpy.linalg import lstsq, svd, pinv


class LaplaceOrgan:
    """
    Estimate poles, damping, and stability from time-domain signals using
    various pole estimation methods (Prony, Matrix Pencil, Burg/AR, continuous-time).
    """

    def __init__(self, sample_rate: float = 1.0, method: str = "prony", order: int = 10):
        """
        :param sample_rate: Sampling rate of the input signal.
        :param method: Pole estimation method. One of:
                       "prony", "matrix_pencil", "burg", "continuous_time".
        :param order: Model order (used by some methods).
        """
        self.sample_rate = sample_rate
        self.method = method
        self.order = order

    def analyze(self, signal: np.ndarray) -> dict:
        signal = np.asarray(signal)

        if signal.ndim != 1 or signal.size < 4:
            return {
                "poles": [],
                "dominant_pole": 0.0,
                "damping_ratio": 0.0,
                "growth_rate": 0.0,
                "stability_class": "undefined",
                "notes": "Signal too short or invalid for Laplace analysis",
            }

        # Choose pole estimation method
        if self.method == "prony":
            poles = self._prony_poles(signal, order=self.order, sample_rate=self.sample_rate)
            method_name = "Prony"
        elif self.method == "matrix_pencil":
            poles = self._matrix_pencil_poles(signal, sample_rate=self.sample_rate)
            method_name = "Matrix Pencil"
        elif self.method == "burg":
            poles = self._burg_ar_poles(signal, order=self.order, sample_rate=self.sample_rate)
            method_name = "Burg AR"
        elif self.method == "continuous_time":
            poles = self._continuous_time_poles(signal, order=self.order, sample_rate=self.sample_rate)
            method_name = "Continuous-Time LS"
        else:
            # Fallback: simple FFT proxy
            poles = self._fft_proxy_poles(signal, sample_rate=self.sample_rate)
            method_name = "FFT proxy"

        poles = np.asarray(poles, dtype=np.complex128)

        if poles.size == 0:
            return {
                "poles": [],
                "dominant_pole": 0.0,
                "damping_ratio": 0.0,
                "growth_rate": 0.0,
                "stability_class": "undefined",
                "notes": f"No poles estimated with method={self.method}",
            }

        # Dominant pole: largest magnitude
        dominant = poles[np.argmax(np.abs(poles))]

        # Damping ratio from dominant pole
        damping = self._compute_damping(dominant)

        # Growth rate = real part
        growth = float(np.real(dominant))

        # Stability class from real part
        stability = self._classify(dominant)

        return {
            "poles": poles.tolist(),
            "dominant_pole": complex(dominant),
            "damping_ratio": float(damping),
            "growth_rate": growth,
            "stability_class": stability,
            "notes": f"{method_name} method, dominant pole={dominant:.3f}, stability={stability}",
        }

    # ------------------------------------------------------------------
    # Advanced pole estimation methods
    # ------------------------------------------------------------------

    def _prony_poles(self, signal: np.ndarray, order: int, sample_rate: float):
        """
        Prony's method: fit an IIR model to the signal and extract poles.
        """
        signal = np.asarray(signal)
        N = signal.size

        if N <= order + 1:
            return np.array([], dtype=np.complex128)

        # Build Toeplitz-like regression matrix
        Y = signal[order:]
        H = np.column_stack([signal[order - k - 1:N - k - 1] for k in range(order)])

        a, _, _, _ = lstsq(H, Y, rcond=None)

        # AR polynomial: z^order + a1 z^(order-1) + ... + a_order
        poly = np.concatenate(([1.0], -a))

        # Discrete-time poles
        z_poles = np.roots(poly)

        # Discrete → continuous
        dt = 1.0 / sample_rate
        p_poles = np.log(z_poles) / dt

        return p_poles

    def _matrix_pencil_poles(self, signal: np.ndarray, sample_rate: float):
        """
        Matrix Pencil method for damped exponential decomposition.
        """
        signal = np.asarray(signal)
        N = signal.size

        if N < 6:
            return np.array([], dtype=np.complex128)

        # Pencil parameter
        L = N // 2

        # Build Hankel matrices
        # Y0: columns are signal[i:i+L]
        # Y1: shifted by one
        Y0 = np.column_stack([signal[i:i + L] for i in range(N - L)])
        Y1 = np.column_stack([signal[i + 1:i + L + 1] for i in range(N - L)])

        # SVD
        U, S, Vh = svd(Y0, full_matrices=False)

        # Rank selection: keep dominant singular values
        tol = 1e-6 * S[0] if S.size > 0 else 0.0
        r = int(np.sum(S > tol))
        if r == 0:
            return np.array([], dtype=np.complex128)

        Ur = U[:, :r]
        Sr = np.diag(S[:r])
        Vr = Vh[:r, :]

        # Solve: A ≈ Ur^T Y1 Vr^T Sr^{-1}
        A = Ur.T @ Y1 @ Vr.T @ pinv(Sr)

        eigvals = np.linalg.eigvals(A)

        # Discrete → continuous poles
        dt = 1.0 / sample_rate
        poles = np.log(eigvals) / dt

        return poles

    def _burg_ar_poles(self, signal: np.ndarray, order: int, sample_rate: float):
        """
        Burg's method for AR model. Poles are roots of AR polynomial.
        """
        signal = np.asarray(signal)
        N = signal.size

        if N <= order + 1:
            return np.array([], dtype=np.complex128)

        # Initialize forward and backward errors
        ef = signal[1:].astype(np.complex128).copy()
        eb = signal[:-1].astype(np.complex128).copy()

        # AR coefficients
        a = np.zeros(order + 1, dtype=np.complex128)
        a[0] = 1.0

        E = np.sum(signal ** 2) / N + 1e-12

        for k in range(1, order + 1):
            num = -2.0 * np.dot(eb.conj(), ef)
            den = np.dot(ef.conj(), ef) + np.dot(eb.conj(), eb) + 1e-12
            gamma = num / den

            a_prev = a.copy()
            for i in range(1, k):
                a[i] = a_prev[i] + gamma * np.conj(a_prev[k - i])
            a[k] = gamma

            ef_new = ef[1:] + gamma * eb[1:]
            eb_new = eb[:-1] + np.conj(gamma) * ef[:-1]
            ef, eb = ef_new, eb_new

            E *= (1 - np.abs(gamma) ** 2 + 1e-12)

            if ef.size < 2 or eb.size < 2:
                break

        # AR polynomial roots → discrete poles
        z_poles = np.roots(a)

        dt = 1.0 / sample_rate
        p_poles = np.log(z_poles) / dt

        return p_poles

    def _continuous_time_poles(self, signal: np.ndarray, order: int, sample_rate: float):
        """
        Simple continuous-time system identification via polynomial model.

        Fits an approximate ODE:
            x'(t) = a1 x + a2 x^2 + ... + a_order x^order
        and then interprets the linearized dynamics via a companion matrix.
        """
        signal = np.asarray(signal)
        N = signal.size

        if N <= order + 2:
            return np.array([], dtype=np.complex128)

        dt = 1.0 / sample_rate
        dx = np.gradient(signal, dt)

        # Regression matrix: [x, x^2, ..., x^order]
        X = np.column_stack([signal ** k for k in range(1, order + 1)])

        a, _, _, _ = lstsq(X, dx, rcond=None)

        # Build companion matrix for continuous-time system
        A = np.zeros((order, order), dtype=np.complex128)
        if order > 1:
            A[:-1, 1:] = np.eye(order - 1, dtype=np.complex128)
        A[-1, :] = -a[::-1]

        poles = np.linalg.eigvals(A)

        return poles

    def _fft_proxy_poles(self, signal: np.ndarray, sample_rate: float):
        """
        Very rough proxy: treat FFT frequencies as purely imaginary poles.
        Used only as a fallback.
        """
        signal = np.asarray(signal)
        N = signal.size

        fft_vals = np.fft.fft(signal)
        freqs = np.fft.fftfreq(N, d=1.0 / sample_rate)

        # Keep frequencies with significant magnitude
        mag = np.abs(fft_vals)
        if mag.max() == 0:
            return np.array([], dtype=np.complex128)

        mask = mag > 0.1 * mag.max()
        omega = 2 * np.pi * freqs[mask]

        poles = 1j * omega

        return poles

    # ------------------------------------------------------------------
    # Derived metrics
    # ------------------------------------------------------------------

    def _compute_damping(self, pole: complex) -> float:
        sigma = float(np.real(pole))
        omega = float(np.imag(pole))
        denom = np.sqrt(sigma ** 2 + omega ** 2) + 1e-12
        # Standard definition: zeta = -sigma / sqrt(sigma^2 + omega^2)
        return -sigma / denom

    def _classify(self, pole: complex) -> str:
        sigma = float(np.real(pole))
        eps = 1e-9
        if sigma < -eps:
            return "stable"
        if abs(sigma) <= eps:
            return "marginal"
        return "unstable"