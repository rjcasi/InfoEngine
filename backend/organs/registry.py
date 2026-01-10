from .laplace_organ import LaplaceOrgan
from organs.cybersecurity.bloodhound_red_organ import BloodHoundRedOrgan
from organs.cybersecurity.bloodhound_blue_organ import BloodHoundBlueOrgan
from organs.cybersecurity.cyber_origin_organ import CyberOriginOrgan
from organs.cybersecurity.cors_organ import CORSOrgan
from organs.cybersecurity.xss_organ import XSSOrgan


# Optional: class registry (if you use dynamic creation)
ORGAN_CLASSES = {
    "laplace": LaplaceOrgan,
    # add others here if you want dynamic instantiation
}


# Actual instantiated organ registry (this is what your API uses)
registry = {}

registry["laplace"] = LaplaceOrgan()
registry["bloodhound_red"] = BloodHoundRedOrgan()
registry["bloodhound_blue"] = BloodHoundBlueOrgan()
registry["cyber_origin"] = CyberOriginOrgan()
registry["cors"] = CORSOrgan()
registry["xss"] = XSSOrgan()