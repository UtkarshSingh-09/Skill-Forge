// SkillForge Learn Sim #1: LED Blink
// Matches the Wokwi design: https://wokwi.com/projects/474980281986955265
// Pin 7, 1kΩ resistor, red LED, 1000ms delay (1 second on, 1 second off).
// Compiled offline (Part 7) to sim1_led_blink.hex and executed on-device
// inside avr8js (never on real hardware for this simulator — it's the
// Learn page's virtual rig).
const int LED_PIN = 7;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}
