/**
 * Minimal Intel HEX parser for avr8js.
 * Loads an Intel HEX ASCII string into an 8-bit program memory buffer.
 */
export function loadHex(hex: string, target: Uint8Array): void {
  const lines = hex.split('\n');
  for (let line of lines) {
    line = line.trim();
    if (line.startsWith(':')) {
      const bytes = parseInt(line.substring(1, 3), 16);
      const addr = parseInt(line.substring(3, 7), 16);
      const recordType = parseInt(line.substring(7, 9), 16);

      if (recordType === 0) {
        // Data Record
        const data = line.substring(9, 9 + bytes * 2);
        for (let i = 0; i < bytes; i++) {
          target[addr + i] = parseInt(data.substring(i * 2, i * 2 + 2), 16);
        }
      } else if (recordType === 1) {
        // End of File Record
        break;
      }
    }
  }
}
