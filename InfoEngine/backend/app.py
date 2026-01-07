from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

from routes.api import api_blueprint
app.register_blueprint(api_blueprint, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")