import io
import json
import unittest
from fastapi.testclient import TestClient
from dashboard.main import app

class TestSkillForgeDashboard(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_check(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("status"), "ok")
        self.assertEqual(data.get("service"), "skillforge-dashboard")
        self.assertEqual(data.get("version"), "1.0.0")

    def test_index_html_serving(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("SkillForge", response.text)
        self.assertIn("Mentor & Teacher Analytics Dashboard", response.text)

    def test_get_latest_session(self):
        response = self.client.get("/api/session/latest")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("sessionId", data)
        self.assertIn("events", data)
        self.assertIn("skillProfile", data)

    def test_upload_valid_session_multipart(self):
        valid_payload = {
            "sessionId": "test_session_python_1",
            "procedureId": "led_basic_v1",
            "exportedAt": "2026-09-12T10:00:00Z",
            "durationMs": 62000,
            "eventCount": 3,
            "events": [
                {"type": "SESSION_START", "timestamp": 1726117200000, "payload": {}},
                {"type": "TEST_REQUESTED", "timestamp": 1726117205000, "payload": {}},
                {"type": "PASS", "timestamp": 1726117215000, "payload": {"confidence": 0.95}}
            ],
            "skillProfile": {
                "autonomyIndex": 0.91,
                "safetyScore": 1.0,
                "troubleshootingPatience": 0.95
            },
            "hardwareTelemetry": {
                "verifiedGroundTruth": True,
                "lastVoltageMv": 710
            }
        }
        file_bytes = io.BytesIO(json.dumps(valid_payload).encode("utf-8"))
        files = {"file": ("SkillForge_Session_test.json", file_bytes, "application/json")}
        
        response = self.client.post("/api/upload", files=files)
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertEqual(result.get("status"), "ok")
        self.assertEqual(result.get("sessionId"), "test_session_python_1")
        self.assertEqual(result.get("eventCount"), 3)
        self.assertEqual(result.get("autonomyIndex"), 0.91)

        # Verify latest endpoint reflects the uploaded session
        latest_res = self.client.get("/api/session/latest")
        self.assertEqual(latest_res.json().get("sessionId"), "test_session_python_1")

    def test_upload_valid_session_json_body(self):
        valid_payload = {
            "sessionId": "test_session_json_body",
            "procedureId": "led_basic_v1",
            "events": [
                {"type": "SESSION_START", "timestamp": 1726117200000}
            ],
            "skillProfile": {"autonomyIndex": 0.85}
        }
        response = self.client.post("/api/upload", json=valid_payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("sessionId"), "test_session_json_body")

    def test_upload_empty_file(self):
        empty_bytes = io.BytesIO(b"")
        files = {"file": ("empty.json", empty_bytes, "application/json")}
        response = self.client.post("/api/upload", files=files)
        self.assertEqual(response.status_code, 400)
        self.assertIn("Empty file", response.json().get("message", ""))

    def test_upload_missing_required_keys(self):
        invalid_payload = {"someRandomKey": "no_session_or_events"}
        response = self.client.post("/api/upload", json=invalid_payload)
        self.assertEqual(response.status_code, 422)
        self.assertIn("Invalid session schema", response.json().get("message", ""))

if __name__ == "__main__":
    unittest.main()
