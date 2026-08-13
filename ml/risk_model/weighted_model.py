import random

# Weights for the v1 Risk Scoring Model
WEIGHTS = {
    "accident_density": 0.25,
    "congestion_level": 0.20,
    "violation_rate": 0.15,
    "weather_severity": 0.10,
    "event_proximity": 0.10,
    "obstruction_flag": 0.10,
    "time_of_day_pattern": 0.10
}

def compute_risk_score(junction_id, current_factors):
    """
    Computes the weighted risk score (0-100) and feature contributions.
    current_factors should be a dict of raw values (0-1) for each factor.
    """
    total_score = 0
    contributions = []

    for factor, weight in WEIGHTS.items():
        raw_val = current_factors.get(factor, 0.0)
        # Ensure raw_val is bounded 0-1
        raw_val = max(0.0, min(1.0, raw_val))
        contribution = raw_val * weight
        total_score += contribution
        
        contributions.append({
            "factor_name": factor,
            "raw_value": raw_val,
            "weight": weight,
            "contribution": contribution
        })

    # Scale to 0-100
    final_score = round(total_score * 100, 2)
    
    # Generate simple natural language explanation based on top 2 factors
    sorted_factors = sorted(contributions, key=lambda x: x["contribution"], reverse=True)
    top_factor = sorted_factors[0]
    second_factor = sorted_factors[1]
    
    nl_explanation = f"Risk driven primarily by {top_factor['factor_name'].replace('_', ' ')} and {second_factor['factor_name'].replace('_', ' ')}."

    return {
        "junction_id": junction_id,
        "score": final_score,
        "factors": contributions,
        "nl_explanation": nl_explanation
    }

def simulate_factors():
    """Helper to generate random factor values for testing."""
    return {
        "accident_density": random.uniform(0, 1),
        "congestion_level": random.uniform(0, 1),
        "violation_rate": random.uniform(0, 1),
        "weather_severity": random.choice([0.0, 0.5, 1.0]),
        "event_proximity": random.choice([0.0, 1.0]),
        "obstruction_flag": random.choice([0.0, 1.0]),
        "time_of_day_pattern": random.uniform(0.3, 0.9)
    }
