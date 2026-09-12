// SkillForge Learn Sim #2: Alternate Blink (2 LEDs, 1 shared resistor)
// Matches Wokwi design: https://wokwi.com/projects/474979924374246401
// Pin 7 (Red LED), Pin 8 (Green LED), shared ground-rail resistor, 1000ms delay.
// Compiled offline (Part 7) to sim2_alternate_blink.hex and executed on-device inside avr8js.

const int LED1_PIN = 7;
const int LED2_PIN = 8;

void setup() {
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);

  digitalWrite(LED1_PIN, LOW);
  digitalWrite(LED2_PIN, LOW);
}

void loop() {
  // Red LED ON, Green LED OFF
  digitalWrite(LED1_PIN, HIGH);
  digitalWrite(LED2_PIN, LOW);
  delay(1000);

  // Red LED OFF, Green LED ON
  digitalWrite(LED1_PIN, LOW);
  digitalWrite(LED2_PIN, HIGH);
  delay(1000);
}
