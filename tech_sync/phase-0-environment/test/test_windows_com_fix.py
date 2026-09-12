"""
Phase 0 — Master Plan §1.6: dashboard/arduino_bridge.py find_port() Windows COM fix.

Run from repo root: python3 -m pytest tech_sync/phase-0-environment/test/test_windows_com_fix.py -v
(or: python3 -m unittest tech_sync.phase-0-environment.test.test_windows_com_fix -v)
"""
import sys
import unittest
from unittest.mock import patch, MagicMock

sys.path.insert(0, ".")
from dashboard.arduino_bridge import ArduinoBridge


class FakePortInfo:
    def __init__(self, device):
        self.device = device


class TestWindowsComPortFix(unittest.TestCase):
    def setUp(self):
        self.bridge = ArduinoBridge()

    @patch("sys.platform", "win32")
    @patch("serial.tools.list_ports.comports")
    def test_finds_lowest_com_port_on_windows(self, mock_comports):
        mock_comports.return_value = [FakePortInfo("COM5"), FakePortInfo("COM3")]
        port = self.bridge.find_port()
        self.assertEqual(port, "COM3")

    @patch("sys.platform", "win32")
    @patch("serial.tools.list_ports.comports")
    def test_returns_none_when_no_windows_ports(self, mock_comports):
        mock_comports.return_value = []
        self.assertIsNone(self.bridge.find_port())

    @patch("sys.platform", "darwin")
    @patch("glob.glob")
    def test_macos_path_unaffected_by_windows_fix(self, mock_glob):
        mock_glob.side_effect = lambda pattern: (
            ["/dev/cu.usbmodem1234"] if pattern == "/dev/cu.usbmodem*" else []
        )
        self.assertEqual(self.bridge.find_port(), "/dev/cu.usbmodem1234")


if __name__ == "__main__":
    unittest.main()
