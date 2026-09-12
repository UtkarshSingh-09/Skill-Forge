// SkillForge Firmware P-A: LED Continuity & Electrical Verification
// Part 13.3 of SkillForge Master Plan

const int SENSE = A0;
const int DRIVE = 7;

void setup() {
  Serial.begin(9600);
  pinMode(DRIVE, OUTPUT);
  pinMode(SENSE, INPUT);
  digitalWrite(DRIVE, LOW);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim(); // Strip \r and whitespace
    
    if (cmd == "PING") {
      Serial.println("{\"ok\":true,\"fw\":\"pa-1\"}");
    } else if (cmd == "TEST") {
      // Pulse drive to test continuity
      digitalWrite(DRIVE, HIGH);
      delay(50);
      int v = analogRead(SENSE);
      digitalWrite(DRIVE, LOW);
      
      Serial.print("{\"ledOn\":");
      Serial.print(v > 300 ? "true" : "false");
      Serial.print(",\"raw\":");
      Serial.print(v);
      Serial.println("}");
    } else if (cmd == "ON") {
      // Manual debug command to keep LED on continuously
      digitalWrite(DRIVE, HIGH);
      Serial.println("{\"state\":\"ON\"}");
    } else if (cmd == "OFF") {
      digitalWrite(DRIVE, LOW);
      Serial.println("{\"state\":\"OFF\"}");
    }
  }
}
