import random
from datetime import datetime, timedelta

INCIDENT_TYPES = ["accident", "waterlogging", "vip_movement", "festival_crowd", "obstruction"]

def generate_incidents(junction_ids, count=5):
    """
    Generates a list of simulated incidents at random junctions.
    """
    incidents = []
    for _ in range(count):
        incidents.append({
            "junction_id": random.choice(junction_ids),
            "type": random.choice(INCIDENT_TYPES),
            "severity": random.randint(1, 5),
            "reported_at": datetime.utcnow() - timedelta(minutes=random.randint(0, 120)),
            "simulated": True
        })
    return incidents

def inject_incident(junction_id, incident_type, severity):
    """
    Simulates a live operator incident injection.
    """
    return {
        "junction_id": junction_id,
        "type": incident_type,
        "severity": severity,
        "reported_at": datetime.utcnow(),
        "simulated": True
    }
