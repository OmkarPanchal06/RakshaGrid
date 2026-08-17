import time
import requests
import json
import sys

API_BASE = "http://localhost:8000/api"

def print_step(msg):
    print(f"\n[DEMO STEP] {msg}")
    print("-" * 50)

def run_demo():
    print("🚀 Starting RakshaGrid Live Pitch Demo Scenario...")
    
    # 1. Fetch Junctions to find a target
    try:
        res = requests.get(f"{API_BASE}/junctions")
        res.raise_for_status()
        junctions = res.json()
    except Exception as e:
        print(f"Failed to connect to backend: {e}")
        print("Make sure docker-compose is running!")
        sys.exit(1)
        
    if not junctions:
        print("No junctions found. Please run seed_db.py first.")
        sys.exit(1)
        
    # Pick "Sitabuldi Square" or first available
    target_junction = next((j for j in junctions if "Sitabuldi" in j["name"]), junctions[0])
    target_id = target_junction["id"]
    target_name = target_junction["name"]
    
    print_step("Phase 1: Baseline Dashboard (Wait 5s)")
    print("Presenter: 'Here is the baseline risk heatmap for Nagpur. Notice the current scores.'")
    time.sleep(5)
    
    print_step(f"Phase 2: Injecting Major Incident at {target_name} (Accident + VIP Movement)")
    print("Presenter: 'Let's simulate a major accident during a VIP movement.'")
    
    # Inject Accident
    requests.post(f"{API_BASE}/incidents", json={
        "junction_id": target_id,
        "type": "accident",
        "severity": 5
    })
    
    time.sleep(2) # brief pause
    
    # Inject VIP Movement
    requests.post(f"{API_BASE}/incidents", json={
        "junction_id": target_id,
        "type": "vip_movement",
        "severity": 4
    })
    
    print("-> Incidents Injected. Watch the dashboard re-render and WebSocket push updates!")
    
    print_step("Phase 3: Optimizer Running (Wait 8s)")
    print("Presenter: 'The system instantly recalculates the risk score and re-runs the Hungarian allocation algorithm.'")
    time.sleep(8)
    
    print_step("Phase 4: Operator Review & Override")
    print("Presenter: 'The AI recommends deploying a unit to Sitabuldi. I am reviewing the explanation.'")
    
    # Fetch Recommendations to get officer ID
    try:
        rec_res = requests.get(f"{API_BASE}/deployment/recommended")
        recommendations = rec_res.json()
        target_rec = next((r for r in recommendations if r["junction_id"] == target_id), None)
        
        if target_rec:
            officer_id = target_rec["officer_id"]
            print(f"-> Found recommendation: Assign {target_rec['officer_name']} to {target_name}.")
            time.sleep(4)
            
            print("Presenter: 'I agree with the AI. Accepting deployment.'")
            requests.post(f"{API_BASE}/deployment/{target_id}/override", json={
                "action": "accept",
                "officer_id": officer_id,
                "reason": "Critical VIP route accident confirmed via radio."
            })
            print("-> Deployment Accepted! Audit Log Updated.")
        else:
            print("-> No specific recommendation found for target. Optimizer might have prioritized elsewhere.")
    except Exception as e:
        print(f"Optimization fetch failed: {e}")
        
    print_step("Phase 5: Conclusion")
    print("Presenter: 'We achieved this 40% coverage improvement using existing ICCC infra. Thank you.'")
    print("\n✅ Demo Scenario Complete!")

if __name__ == "__main__":
    run_demo()
