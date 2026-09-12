// SkillForge Firmware P-B: 7408 AND Gate Truth-Table Verification
// Part 13.4 of SkillForge Master Plan

const int A = 2;
const int B = 3;
const int Y = 4;

void setup() {
  Serial.begin(9600);
  pinMode(A, OUTPUT);
  pinMode(B, OUTPUT);
  pinMode(Y, INPUT);
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    
    if (cmd == "PING") {
      Serial.println("{\"ok\":true,\"fw\":\"pb-1\"}");
    } else if (cmd == "TRUTH") {
      Serial.print("{\"truthTable\":[");
      for (int i = 0; i < 4; i++) {
        int a = (i >> 1) & 1;
        int b = i & 1;
        digitalWrite(A, a);
        digitalWrite(B, b);
        delay(20);
        int y = digitalRead(Y);
        int exp = a && b;
        
        Serial.print("{\"a\":");
        Serial.print(a);
        Serial.print(",\"b\":");
        Serial.print(b);
        Serial.print(",\"out\":");
        Serial.print(y);
        Serial.print(",\"expected\":");
        Serial.print(exp);
        Serial.print("}");
        
        if (i < 3) Serial.print(",");
      }
      Serial.println("]}");
    }
  }
}
