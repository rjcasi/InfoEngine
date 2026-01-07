from flask import Flask
from flask_cors import CORS
from routes.api import api_blueprint

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(api_blueprint, url_prefix="/api")

@app.route("/")
def home():
    return {"status": "InfoEngine backend running"}

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)