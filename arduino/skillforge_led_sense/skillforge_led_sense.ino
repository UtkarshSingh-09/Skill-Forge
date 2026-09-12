// SkillForge Emergency Pivot Firmware: Arduino Powered LED with Sense
// File: arduino/skillforge_led_sense/skillforge_led_sense.ino

const int DRIVE_PIN = 7; // Powers the 1k Resistor -> LED from D7
const int SENSE_PIN = 8; // Senses voltage after LED cathode (optional digital read)

void setup() {
  Serial.begin(9600);
  pinMode(DRIVE_PIN, OUTPUT);
  pinMode(SENSE_PIN, INPUT);
  digitalWrite(DRIVE_PIN, LOW);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();

    if (cmd == "PING") {
      Serial.println("PONG");
    } else if (cmd == "TEST") {
      // Pulse the LED and check continuity
      digitalWrite(DRIVE_PIN, HIGH);
      delay(60);
      int val = analogRead(A0); // Read analog sense if available
      int digitalVal = digitalRead(SENSE_PIN);
      digitalWrite(DRIVE_PIN, LOW);

      if (val > 200 || digitalVal == HIGH) {
        Serial.println("LED:ON");
      } else {
        Serial.println("LED:OFF");
      }
    } else if (cmd == "SET:HIGH" || cmd == "ON") {
      digitalWrite(DRIVE_PIN, HIGH);
      Serial.println("OK");
    } else if (cmd == "SET:LOW" || cmd == "OFF") {
      digitalWrite(DRIVE_PIN, LOW);
      Serial.println("OK");
    }
  }
}
