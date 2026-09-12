import pkg from '../../../package.json';
import appJson from '../../../app.json';

describe('Phase 0 — Environment & Build Setup', () => {
  test('all 5 new Lane B packages (Master Plan §1.2) are declared', () => {
    const required = [
      'react-native-fast-tflite',
      'react-native-webview',
      'avr8js',
      '@wokwi/elements',
      'llama.rn',
    ];
    for (const name of required) {
      expect(pkg.dependencies).toHaveProperty([name]);
      expect(typeof (pkg.dependencies as Record<string, string>)[name]).toBe('string');
    }
  });

  test('new-arch is enabled for Android (required by vision-camera/tflite/webview native modules)', () => {
    const buildProps = appJson.expo.plugins.find(
      (p: any) => Array.isArray(p) && p[0] === 'expo-build-properties'
    ) as any;
    expect(buildProps).toBeTruthy();
    expect(buildProps[1].android.newArchEnabled).toBe(true);
  });

  test('CAMERA and RECORD_AUDIO permissions are present (needed for detector.ts + STT)', () => {
    expect(appJson.expo.android.permissions).toEqual(
      expect.arrayContaining(['CAMERA', 'RECORD_AUDIO'])
    );
  });

  test('jest test runner is now declared at root (was previously undeclared/broken)', () => {
    expect(pkg.devDependencies).toHaveProperty('jest');
    expect(pkg.devDependencies).toHaveProperty('ts-jest');
    expect(pkg.scripts.test).toBe('jest');
  });
});
