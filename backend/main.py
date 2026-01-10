# main.py
# -----------------------------------------------------------------------------
# Commit: Scalable FastAPI backend for automated pipeline validation.
# Purpose: 
# - Serves as the computational engine for the VectorShift Pipeline Builder.
# - Provides a high-performance REST API for graph parsing and validation.
# - Implements Kahn's Algorithm (Topological Sort) to detect cycles and ensure DAG integrity.
# - Handles Cross-Origin Resource Sharing (CORS) for seamless frontend integration.
# -----------------------------------------------------------------------------

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI(
    title="VectorShift Pipeline Analysis API",
    description="Backend service for validating workflow graph structures",
    version="1.0.0"
)

# -----------------------------------------------------------------------------
# Security & Middleware
# - Configured to allow communication with the React development server (Port 3000)
# -----------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Data Models (Pydantic)
# - Defines the expected structure of incoming pipeline JSON data
# -----------------------------------------------------------------------------
class PipelineRequest(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

# -----------------------------------------------------------------------------
# API Endpoints
# -----------------------------------------------------------------------------

@app.get('/')
def read_root():
    """Health check endpoint to verify backend status."""
    return {'Status': 'Online', 'Service': 'VectorShift Assignment'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineRequest):
    """
    Analyzes the incoming pipeline structure.
    
    Processing Steps:
    1. Extracts nodes and edges from the payload.
    2. Calculates basic structural metrics (counts).
    3. Executes a topological sort to verify the graph is a Directed Acyclic Graph (DAG).
    
    Returns:
        JSON containing node count, edge count, and DAG status.
    """
    nodes = pipeline.nodes
    edges = pipeline.edges
    
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    # Check if the graph is a DAG using Kahn's algorithm
    is_dag = check_dag(nodes, edges)
    
    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag
    }

# -----------------------------------------------------------------------------
# Core Algorithm Logic
# -----------------------------------------------------------------------------

def check_dag(nodes: List[Dict], edges: List[Dict]) -> bool:
    """
    Implements Kahn's Algorithm for Topological Sorting.
    
    This is used to detect if the graph contains any cycles. 
    A graph is a DAG (Directed Acyclic Graph) if and only if 
    it can be completely processed via a topological sort.
    
    Complexity: O(V + E) where V = nodes and E = edges.
    """
    if not nodes:
        return True  # An empty graph is trivially a DAG
    
    # Phase 1: Initialize adjacency list and in-degree counts
    node_ids = {node["id"] for node in nodes}
    in_degree = {node_id: 0 for node_id in node_ids}
    adjacency = {node_id: [] for node_id in node_ids}
    
    # Phase 2: Populate graph structure from edges
    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")
        
        # Ensure we only process edges between nodes that actually exist in the payload
        if source in node_ids and target in node_ids:
            adjacency[source].append(target)
            in_degree[target] += 1
    
    # Phase 3: Find nodes with zero in-degree (entry points)
    queue = [node_id for node_id, degree in in_degree.items() if degree == 0]
    visited_count = 0
    
    # Phase 4: Main Loop - Process the graph
    while queue:
        current = queue.pop(0)
        visited_count += 1
        
        # For each neighbor, reduce its in-degree as the current node is "removed"
        for neighbor in adjacency[current]:
            in_degree[neighbor] -= 1
            # If a neighbor's in-degree becomes 0, it is ready for processing
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Result: If every node was visited, no cycles exist.
    return visited_count == len(node_ids)

