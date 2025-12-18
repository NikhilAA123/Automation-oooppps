# main.py
# Backend for VectorShift Pipeline Builder
# Provides an endpoint to parse pipelines and check if they form a DAG

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model for pipeline data
class PipelineRequest(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineRequest):
    """
    Parses the pipeline and returns:
    - num_nodes: Number of nodes in the pipeline
    - num_edges: Number of edges (connections) in the pipeline
    - is_dag: Whether the pipeline forms a Directed Acyclic Graph
    """
    nodes = pipeline.nodes
    edges = pipeline.edges
    
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    # Check if the graph is a DAG using Kahn's algorithm (topological sort)
    is_dag = check_dag(nodes, edges)
    
    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag
    }

def check_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    """
    Checks if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG).
    Uses Kahn's algorithm for topological sorting.
    """
    if not nodes:
        return True  # Empty graph is a DAG
    
    # Build adjacency list and in-degree count
    node_ids = {node["id"] for node in nodes}
    in_degree = {node_id: 0 for node_id in node_ids}
    adjacency = {node_id: [] for node_id in node_ids}
    
    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")
        
        if source in node_ids and target in node_ids:
            adjacency[source].append(target)
            in_degree[target] += 1
    
    # Find all nodes with in-degree 0 (starting points)
    queue = [node_id for node_id, degree in in_degree.items() if degree == 0]
    visited_count = 0
    
    while queue:
        current = queue.pop(0)
        visited_count += 1
        
        for neighbor in adjacency[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we visited all nodes, it's a DAG (no cycles)
    return visited_count == len(node_ids)
