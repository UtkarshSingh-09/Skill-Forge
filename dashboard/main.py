import json
import os
from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse

app = FastAPI(title="SkillForge Teacher Dashboard", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

DEFAULT_LEARNING_GRAPH = {
    "studentId": "student_iqoo_demo",
    "nodes": [
        {
            "procedureId": "arduino_led_v1",
            "attemptNumber": 1,
            "accuracyPct": 60,
            "hintsUsed": 3,
            "safetyViolations": 1,
            "completionTimeSec": 135,
            "timestamp": 1726115000000,
            "status": "COMPLETED"
        },
        {
            "procedureId": "arduino_led_v1",
            "attemptNumber": 2,
            "accuracyPct": 85,
            "hintsUsed": 1,
            "safetyViolations": 0,
            "completionTimeSec": 72,
            "timestamp": 1726116200000,
            "status": "COMPLETED"
        },
        {
            "procedureId": "arduino_led_v1",
            "attemptNumber": 3,
            "accuracyPct": 100,
            "hintsUsed": 0,
            "safetyViolations": 0,
            "completionTimeSec": 38,
            "timestamp": 1726117400000,
            "status": "COMPLETED"
        }
    ],
    "overallMasteryPct": 82
}

latest_session = {
    "sessionId": "demo_baseline_iqoo",
    "procedureId": "arduino_led_v1",
    "exportedAt": "2026-09-12T08:00:00Z",
    "durationMs": 45000,
    "eventCount": 4,
    "events": [
        {"type": "SESSION_START", "timestamp": 1726117200000, "payload": {}},
        {"type": "TEST_REQUESTED", "timestamp": 1726117205000, "payload": {}},
        {"type": "STATE_CHANGE", "timestamp": 1726117210000, "payload": {"confidence": 0.92}},
        {"type": "PASS", "timestamp": 1726117215000, "payload": {"confidence": 0.94}}
    ],
    "skillProfile": {
        "studentId": "student_iqoo_demo",
        "studentName": "Devraj (Student)",
        "sessionsCompleted": 4,
        "autonomyIndex": 0.88,
        "safetyScore": 0.96,
        "troubleshootingPatience": 0.92,
        "conceptMastery": {
            "breadboardNavigation": 0.98,
            "resistorColorCodes": 0.92,
            "ledPolarity": 0.95,
            "powerIntegrity": 0.96
        }
    },
    "learningGraph": DEFAULT_LEARNING_GRAPH,
    "hardwareTelemetry": {
        "verifiedGroundTruth": True,
        "lastVoltageMv": 680
    }
}

@app.get("/", response_class=HTMLResponse)
def index():
    html_path = os.path.join(CURRENT_DIR, "index.html")
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>SkillForge Dashboard</h1><p>index.html not found.</p>"

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "skillforge-dashboard", "version": "1.0.0"}

@app.post("/api/upload")
async def upload_session(request: Request, file: UploadFile = File(None)):
    global latest_session
    try:
        data = None
        if file is not None:
            contents = await file.read()
            if not contents:
                return JSONResponse({"status": "error", "message": "Empty file"}, status_code=400)
            data = json.loads(contents.decode("utf-8"))
        else:
            try:
                data = await request.json()
            except Exception:
                return JSONResponse({"status": "error", "message": "No file or valid JSON body provided"}, status_code=400)

        if not isinstance(data, dict):
            return JSONResponse({"status": "error", "message": "Payload must be a JSON object"}, status_code=422)

        # Validate required schema keys
        if "sessionId" not in data or "events" not in data or not isinstance(data.get("events"), list):
            return JSONResponse({"status": "error", "message": "Invalid session schema: missing sessionId or events array"}, status_code=422)

        # Ensure learningGraph is populated if not provided
        if "learningGraph" not in data:
            data["learningGraph"] = latest_session.get("learningGraph", DEFAULT_LEARNING_GRAPH)

        latest_session = data
        return JSONResponse({
            "status": "ok",
            "sessionId": data.get("sessionId"),
            "eventCount": len(data.get("events", [])),
            "autonomyIndex": data.get("skillProfile", {}).get("autonomyIndex"),
            "overallMasteryPct": data.get("learningGraph", {}).get("overallMasteryPct", 82)
        })
    except json.JSONDecodeError as e:
        return JSONResponse({"status": "error", "message": f"Malformed JSON: {str(e)}"}, status_code=400)
    except Exception as e:
        return JSONResponse({"status": "error", "message": str(e)}, status_code=400)

@app.get("/api/session/latest")
def get_latest():
    return latest_session

@app.get("/api/learning-graph")
def get_default_learning_graph():
    return latest_session.get("learningGraph", DEFAULT_LEARNING_GRAPH)

@app.get("/api/learning-graph/{student_id}")
def get_learning_graph(student_id: str):
    graph = latest_session.get("learningGraph", DEFAULT_LEARNING_GRAPH)
    if graph.get("studentId") == student_id:
        return graph
    return {
        "studentId": student_id,
        "nodes": graph.get("nodes", DEFAULT_LEARNING_GRAPH["nodes"]),
        "overallMasteryPct": graph.get("overallMasteryPct", DEFAULT_LEARNING_GRAPH["overallMasteryPct"])
    }

# --- Dynamic Hardware Bridge Endpoints ---
try:
    from dashboard.arduino_bridge import arduino_bridge
except ImportError:
    try:
        from arduino_bridge import arduino_bridge
    except ImportError:
        arduino_bridge = None

@app.get("/api/hardware/status")
def get_hardware_status():
    if not arduino_bridge:
        return {"connected": False, "error": "Hardware bridge unavailable"}
    connected = arduino_bridge.is_connected()
    return {
        "connected": connected,
        "port": arduino_bridge.port,
        "device": "Arduino Uno (SkillForge Sense)" if connected else None,
        "lastTest": arduino_bridge._last_test_result
    }

@app.post("/api/hardware/test")
async def post_hardware_test(request: Request):
    if not arduino_bridge:
        return {"connected": False, "ledOn": False, "raw": 0, "error": "Hardware bridge unavailable"}
    
    # Optional payload
    try:
        body = await request.json()
    except Exception:
        body = {}

    result = arduino_bridge.test_circuit()
    
    # Enrich with procedure validation verdict
    is_passed = result.get("ledOn", False)
    verdict = "PASS" if is_passed else "FAIL"
    feedback = (
        "Physical circuit closed and verified! Current flowing through resistor and LED to GND."
        if is_passed
        else "Physical circuit open or reversed. Check resistor bridging E10-E14 and ensure LED anode is in E14, cathode in E18."
    )
    
    return {
        **result,
        "verdict": verdict,
        "feedback": feedback,
        "requestedStep": body.get("stepIndex", 0)
    }

@app.post("/api/hardware/command")
async def post_hardware_command(request: Request):
    if not arduino_bridge:
        return {"connected": False, "error": "Hardware bridge unavailable"}
    body = await request.json()
    cmd = body.get("command", "PING")
    return arduino_bridge.send_command(cmd)

