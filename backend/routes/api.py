from backend.organs.causal.engine import get_causal_state, update_causal_graph

@router.get("/organs/causal")
def causal_state():
    return get_causal_state()

@router.post("/organs/causal/update")
def causal_update(event: dict):
    return update_causal_graph(event)