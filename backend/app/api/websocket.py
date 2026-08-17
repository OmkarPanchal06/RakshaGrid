from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json
import asyncio
from datetime import datetime

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast_risk_update(self, junction_id: str, score: float, nl_explanation: str):
        message = {
            "event": "risk_update",
            "junction_id": junction_id,
            "score": score,
            "nl_explanation": nl_explanation,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                pass

manager = ConnectionManager()

@router.websocket("/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # For this demo, the client just listens.
            # We keep the connection alive by waiting for data if the client pings.
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
