// SkillForge Learn Sim #3: Two-LED Binary Count (2 LEDs, 2 resistors)
// Pin assignment (not yet confirmed by the team — Master Plan Part 10 open
// item): D12 = bit0, D13 = bit1. Counts 0..3 in binary, one step per 700ms.
const int BIT0_PIN = 12;
const int BIT1_PIN = 13;
int count = 0;

void setup() {
  pinMode(BIT0_PIN, OUTPUT);
  pinMode(BIT1_PIN, OUTPUT);
}

void loop() {
  digitalWrite(BIT0_PIN, count & 0x1 ? HIGH : LOW);
  digitalWrite(BIT1_PIN, count & 0x2 ? HIGH : LOW);
  delay(700);
  count = (count + 1) % 4;
}
