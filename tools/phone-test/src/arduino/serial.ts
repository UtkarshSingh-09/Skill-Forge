import { GroundTruth } from '../contract/types';
import { parseGroundTruthResponse } from './protocol';

export interface UsbDevice {
  deviceId: string | number;
  deviceName?: string;
}

export interface UsbPort {
  write: (data: string) => Promise<void>;
  read: () => Promise<string>;
  close: () => Promise<void>;
}

export interface UsbSerialModule {
  list: () => Promise<UsbDevice[]>;
  tryRequestPermission: (deviceId: string | number) => Promise<boolean>;
  open: (deviceId: string | number, options: { baudRate: number }) => Promise<UsbPort>;
}

// Timeout duration in milliseconds to protect UI latency budget
const ARDUINO_TIMEOUT_MS = 1500;

export async function readGroundTruth(
  cmd: 'TEST' | 'TRUTH',
  customUsbManager?: UsbSerialModule
): Promise<GroundTruth> {
  try {
    const UsbModule: UsbSerialModule | undefined =
      customUsbManager ?? (global as unknown as { UsbSerialManager?: UsbSerialModule }).UsbSerialManager;

    if (!UsbModule) {
      return { available: false };
    }

    const devices = await UsbModule.list();
    if (!devices || devices.length === 0) {
      return { available: false };
    }

    const deviceId = devices[0].deviceId;
    await UsbModule.tryRequestPermission(deviceId);
    const port = await UsbModule.open(deviceId, { baudRate: 9600 });

    let timer: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error('ARDUINO_READ_TIMEOUT')), ARDUINO_TIMEOUT_MS);
    });

    const executeTransaction = async (): Promise<string> => {
      await port.write(cmd + '\n');
      return await port.read();
    };

    try {
      const rawResponse = await Promise.race([executeTransaction(), timeoutPromise]);
      if (timer) clearTimeout(timer);
      await port.close();
      return parseGroundTruthResponse(cmd, rawResponse);
    } catch (err) {
      if (timer) clearTimeout(timer);
      try { await port.close(); } catch {}
      return { available: false };
    }
  } catch {
    // Unbreakable Law (D21): Degrade silently. The app never crashes.
    return { available: false };
  }
}
