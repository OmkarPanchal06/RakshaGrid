import sys
import os
import random

# Add parent dir to path to import app and ml modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.db.session import engine, Base, SessionLocal
from backend.app.models.domain import Junction, RiskScore, ScoreFactor, Officer
from ml.data_generator.junction_seed import get_junctions
from ml.risk_model.weighted_model import compute_risk_score, simulate_factors

def seed_database():
    print("Creating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    print("Seeding Junctions...")
    junction_data = get_junctions()
    db_junctions = []
    
    for j_data in junction_data:
        junction = Junction(
            name=j_data["name"],
            zone=j_data["zone"],
            lat=j_data["lat"],
            lng=j_data["lng"],
            road_class=j_data["road_class"]
        )
        db.add(junction)
        db_junctions.append(junction)
    
    db.commit()

    print("Seeding initial Risk Scores...")
    for junction in db_junctions:
        factors = simulate_factors()
        score_result = compute_risk_score(junction.id, factors)
        
        risk_score = RiskScore(
            junction_id=junction.id,
            score=score_result["score"],
            nl_explanation=score_result["nl_explanation"]
        )
        db.add(risk_score)
        db.commit() # commit to get risk_score.id

        for factor in score_result["factors"]:
            score_factor = ScoreFactor(
                risk_score_id=risk_score.id,
                factor_name=factor["factor_name"],
                raw_value=factor["raw_value"],
                weight=factor["weight"],
                contribution=factor["contribution"]
            )
            db.add(score_factor)
            
    print("Seeding synthetic Officers...")
    zones = list(set([j.zone for j in db_junctions]))
    for i in range(15):
        officer = Officer(
            name=f"Officer {i+1}",
            zone=random.choice(zones),
            current_lat=21.14 + random.uniform(-0.05, 0.05),
            current_lng=79.08 + random.uniform(-0.05, 0.05),
            shift="Day",
            available=True
        )
        db.add(officer)

    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
