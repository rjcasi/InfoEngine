from flask import Flask
from backend.flask_routes.power_spectrum import power_spectrum_bp

flask_app = Flask(__name__)
flask_app.register_blueprint(power_spectrum_bp)

@flask_app.route("/")
def home():
    return "Flask root is alive — InfoEngine hybrid backend running."