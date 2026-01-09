# backend/organs/causal_set.py
import networkx as nx

def generate_causal_set(n=10):
    G = nx.DiGraph()
    for i in range(n):
        G.add_node(i)

    # simple partial-order generator
    for i in range(n):
        for j in range(i+1, n):
            G.add_edge(i, j)

    return {
        "nodes": list(G.nodes()),
        "edges": list(G.edges())
    }S