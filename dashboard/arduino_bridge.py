import glob
import json
import logging
import threading
import time
from typing import Optional, Dict, Any

logger = logging.getLogger("arduino_bridge")

class ArduinoBridge:
    def __init__(self, baudrate: int = 9600):
        self.baudrate = baudrate
        self.port: Optional[str] = None
        self._serial = None
        self._lock = threading.Lock()
        self._last_test_result: Dict[str, Any] = {"ledOn": False, "raw": 0}

    def find_port(self) -> Optional[str]:
        # Check standard macOS and Linux Arduino serial devices
        patterns = [
            "/dev/cu.usbmodem*",
            "/dev/tty.usbmodem*",
            "/dev/ttyACM*",
            "/dev/ttyUSB*",
        ]
        for pattern in patterns:
            matches = glob.glob(pattern)
            if matches:
                return sorted(matches)[0]
        return None

    def connect(self) -> bool:
        try:
            import serial
        except ImportError:
            logger.warning("pyserial not installed")
            return False

        with self._lock:
            if self._serial and self._serial.is_open:
                return True

            port = self.find_port()
            if not port:
                return False

            try:
                self._serial = serial.Serial(port, self.baudrate, timeout=1)
                self.port = port
                # Wait for Arduino bootloader reset
                time.sleep(1.8)
                # Flush initial boot junk
                self._serial.reset_input_buffer()
                logger.info(f"Connected to Arduino on {port}")
                return True
            except Exception as e:
                logger.warning(f"Failed to open port {port}: {e}")
                self._serial = None
                self.port = None
                return False

    def close(self):
        with self._lock:
            if self._serial and self._serial.is_open:
                try:
                    self._serial.close()
                except Exception:
                    pass
            self._serial = None
            self.port = None

    def is_connected(self) -> bool:
        if self._serial and self._serial.is_open:
            return True
        return self.connect()

    def test_circuit(self) -> Dict[str, Any]:
        """Send TEST command to Arduino and parse dynamic voltage/continuity measurement."""
        if not self.is_connected():
            return {
                "connected": False,
                "ledOn": False,
                "raw": 0,
                "error": "Arduino not connected"
            }

        with self._lock:
            try:
                self._serial.reset_input_buffer()
                self._serial.write(b"TEST\n")
                line = self._serial.readline().decode("utf-8", errors="ignore").strip()
                if not line:
                    # Retry once
                    self._serial.write(b"TEST\n")
                    line = self._serial.readline().decode("utf-8", errors="ignore").strip()

                led_on = False
                raw = 0
                if line.startswith("{"):
                    try:
                        data = json.loads(line)
                        led_on = bool(data.get("ledOn", False))
                        raw = int(data.get("raw", 0))
                    except Exception:
                        pass
                elif "LED:ON" in line or "ON" in line:
                    led_on = True
                    raw = 700
                elif "LED:OFF" in line or "OFF" in line:
                    led_on = False
                    raw = 0

                self._last_test_result = {
                    "connected": True,
                    "port": self.port,
                    "ledOn": led_on,
                    "raw": raw,
                    "timestamp": int(time.time() * 1000),
                    "raw_reply": line
                }
                return self._last_test_result
            except Exception as e:
                logger.warning(f"Serial communication error: {e}")
                self.close()
                return {
                    "connected": False,
                    "ledOn": False,
                    "raw": 0,
                    "error": str(e)
                }

    def send_command(self, cmd: str) -> Dict[str, Any]:
        """Send custom command e.g. ON, OFF, PING."""
        if not self.is_connected():
            return {"connected": False, "error": "Arduino not connected"}

        with self._lock:
            try:
                self._serial.reset_input_buffer()
                self._serial.write((cmd.strip() + "\n").encode("utf-8"))
                line = self._serial.readline().decode("utf-8", errors="ignore").strip()
                return {
                    "connected": True,
                    "command": cmd,
                    "reply": line
                }
            except Exception as e:
                self.close()
                return {"connected": False, "error": str(e)}

# Singleton instance
arduino_bridge = ArduinoBridge()
