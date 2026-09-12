// SkillForge Learn Sim #4: SOS Morse Code Signal
// Matches Wokwi design: https://wokwi.com/projects/474980135254444033
// Pin 7, resistor, red LED, SOS rhythm (... --- ...)
// Compiled offline (Part 7) to sim4_morse.hex and executed on-device inside avr8js.

const int LED_PIN = 7;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void dot() {
  digitalWrite(LED_PIN, HIGH);
  delay(200);
  digitalWrite(LED_PIN, LOW);
  delay(200);
}

void dash() {
  digitalWrite(LED_PIN, HIGH);
  delay(600);
  digitalWrite(LED_PIN, LOW);
  delay(200);
}

void loop() {
  // S = ...
  dot();
  dot();
  dot();
  delay(400); // Gap between letters

  // O = ---
  dash();
  dash();
  dash();
  delay(400); // Gap between letters

  // S = ...
  dot();
  dot();
  dot();
  delay(2000); // 2-second pause before repeating
}
