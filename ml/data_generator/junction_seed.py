# Simulated Junction Data for Nagpur City
# These coordinates represent major junctions in Nagpur for the hackathon demo.

NAGPUR_JUNCTIONS = [
    {"name": "Sitabuldi Square", "zone": "Central", "lat": 21.1458, "lng": 79.0882, "road_class": "arterial"},
    {"name": "Variety Square", "zone": "Central", "lat": 21.1422, "lng": 79.0815, "road_class": "arterial"},
    {"name": "RBI Square", "zone": "Civil Lines", "lat": 21.1555, "lng": 79.0769, "road_class": "arterial"},
    {"name": "Zero Mile Stone", "zone": "Central", "lat": 21.1498, "lng": 79.0806, "road_class": "collector"},
    {"name": "Sadar Bazar Square", "zone": "Sadar", "lat": 21.1610, "lng": 79.0833, "road_class": "collector"},
    {"name": "Law College Square", "zone": "Dharampeth", "lat": 21.1444, "lng": 79.0560, "road_class": "collector"},
    {"name": "Dharampeth Square", "zone": "Dharampeth", "lat": 21.1412, "lng": 79.0620, "road_class": "local"},
    {"name": "Mate Square", "zone": "South West", "lat": 21.1235, "lng": 79.0498, "road_class": "collector"},
    {"name": "Deekshabhoomi Square", "zone": "South West", "lat": 21.1270, "lng": 79.0655, "road_class": "collector"},
    {"name": "Chatrapati Square", "zone": "South", "lat": 21.1085, "lng": 79.0700, "road_class": "arterial"},
    {"name": "Manish Nagar Railway Crossing", "zone": "South", "lat": 21.0965, "lng": 79.0792, "road_class": "local"},
    {"name": "Airport T-Point", "zone": "South", "lat": 21.0820, "lng": 79.0570, "road_class": "arterial"},
    {"name": "Medical Square", "zone": "South East", "lat": 21.1285, "lng": 79.0988, "road_class": "arterial"},
    {"name": "Krida Square", "zone": "South East", "lat": 21.1230, "lng": 79.1020, "road_class": "local"},
    {"name": "Telephone Exchange Square", "zone": "East", "lat": 21.1450, "lng": 79.1230, "road_class": "collector"},
    {"name": "Gita Mandir Square", "zone": "Central", "lat": 21.1390, "lng": 79.0910, "road_class": "collector"},
    {"name": "Indora Square", "zone": "North", "lat": 21.1850, "lng": 79.0880, "road_class": "arterial"},
    {"name": "Automotive Square", "zone": "North", "lat": 21.2050, "lng": 79.1050, "road_class": "arterial"},
    {"name": "Mankapur Sports Complex Sq", "zone": "North West", "lat": 21.1780, "lng": 79.0620, "road_class": "collector"},
    {"name": "Wadi Naka", "zone": "West", "lat": 21.1510, "lng": 79.0080, "road_class": "arterial"}
]

def get_junctions():
    return NAGPUR_JUNCTIONS
