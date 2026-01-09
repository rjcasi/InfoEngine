from fastapi import FastAPI
from fastapi.middleware.wsgi import WSGIMiddleware

from backend.app import flask_app
from backend.api import fastapi_app

# Main ASGI app
app = FastAPI(title="InfoEngine Hybrid Backend")

# Mount Flask at root
app.mount("/", WSGIMiddleware(flask_app))

# Mount FastAPI under /api
app.mount("/api", fastapi_app)