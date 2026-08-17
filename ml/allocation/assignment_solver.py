import numpy as np
from scipy.optimize import linear_sum_assignment
import math

def haversine(lat1, lon1, lat2, lon2):
    """Calculate the great circle distance between two points in km."""
    R = 6371  # Radius of earth in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat1)) \
        * math.cos(math.radians(lat2)) * math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    d = R * c
    return d

def optimize_allocation(officers, junctions, risk_scores):
    """
    Optimizes officer allocation to junctions.
    Cost = -(risk_score) + travel_time_penalty.
    We convert this to a minimization problem by defining the cost matrix.
    
    officers: list of dicts [{'id': 'o1', 'lat': 21.1, 'lng': 79.1}, ...]
    junctions: list of dicts [{'id': 'j1', 'lat': 21.15, 'lng': 79.08}, ...]
    risk_scores: dict mapping junction_id -> score (0-100)
    """
    if not officers or not junctions:
        return []
        
    num_officers = len(officers)
    num_junctions = len(junctions)
    
    cost_matrix = np.zeros((num_officers, num_junctions))
    
    for i, officer in enumerate(officers):
        for j, junction in enumerate(junctions):
            distance_km = haversine(
                officer['lat'], officer['lng'], 
                junction['lat'], junction['lng']
            )
            # Travel time penalty: ~2 mins per km in city traffic
            travel_time_penalty = distance_km * 2 
            
            risk_score = risk_scores.get(junction['id'], 0)
            
            # We want to maximize risk coverage and minimize distance.
            # scipy's linear_sum_assignment minimizes the total cost.
            # So cost = - (risk_score * weight) + travel_time_penalty
            # Normalizing both to comparable ranges. Let's say risk score is 0-100.
            # Max penalty is ~20 mins. Risk weight is higher to prioritize risk.
            
            cost = - (risk_score * 10) + travel_time_penalty
            cost_matrix[i, j] = cost

    # Solve the assignment problem
    row_ind, col_ind = linear_sum_assignment(cost_matrix)
    
    assignments = []
    for idx, officer_idx in enumerate(row_ind):
        junction_idx = col_ind[idx]
        officer = officers[officer_idx]
        junction = junctions[junction_idx]
        
        distance_km = haversine(
            officer['lat'], officer['lng'], 
            junction['lat'], junction['lng']
        )
        eta_min = round(distance_km * 2)
        
        assignments.append({
            "officer_id": officer['id'],
            "officer_name": officer.get('name', f"Officer {officer['id']}"),
            "junction_id": junction['id'],
            "junction_name": junction.get('name', f"Junction {junction['id']}"),
            "eta_min": eta_min,
            "reason": f"Optimal coverage: Risk {risk_scores.get(junction['id'], 0)}%, ETA {eta_min} min."
        })
        
    return assignments
