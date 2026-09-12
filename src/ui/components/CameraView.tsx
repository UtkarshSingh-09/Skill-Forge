import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, LayoutChangeEvent } from 'react-native';
import { usePathname } from 'expo-router';
import { BreadboardGraphic } from './BreadboardGraphic';
import { theme } from '../theme';

// Safely attempt to import react-native-vision-camera
let VisionCameraComponent: any = null;
let requestCameraPermissionFn: (() => Promise<string>) | null = null;
let useCameraDeviceHook: any = null;

try {
  const RNC = require('react-native-vision-camera');
  VisionCameraComponent = RNC.Camera;
  requestCameraPermissionFn = RNC.Camera?.requestCameraPermission;
  useCameraDeviceHook = RNC.useCameraDevice;
} catch {
  // Graceful fallback for Expo Go / simulator / mock mode
  VisionCameraComponent = null;
}

interface CameraViewProps {
  isActive?: boolean;
  frameProcessor?: any;
  onLayout?: (e: LayoutChangeEvent) => void;
  fixtureMode?: boolean;
}

export function CameraView({
  isActive = true,
  onLayout,
  fixtureMode = true,
}: CameraViewProps) {
  const pathname = usePathname();
  const isFocused = pathname === '/coach' || pathname.includes('coach');
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 360,
    height: 300,
  });

  // Request camera permission on mount if native camera is available
  useEffect(() => {
    let isMounted = true;
    const checkPermission = async () => {
      if (requestCameraPermissionFn) {
        try {
          const status = await requestCameraPermissionFn();
          if (isMounted) {
            setHasPermission(status === 'granted');
          }
        } catch {
          if (isMounted) setHasPermission(false);
        }
      }
    };
    checkPermission();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDimensions({ width, height });
    if (onLayout) onLayout(e);
  };

  // If in fixture mode, or native camera not available or permission denied:
  // Render the calibrated static breadboard graphic
  const shouldRenderStatic = fixtureMode || !VisionCameraComponent || !hasPermission;

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {shouldRenderStatic ? (
        <View style={styles.fixtureWrapper}>
          <BreadboardGraphic
            width={Math.max(280, dimensions.width - 32)}
            height={Math.max(200, dimensions.height - 80)}
          />
          <View style={styles.fixtureBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.fixtureBadgeText}>FIXTURE PREVIEW (CALIBRATED)</Text>
          </View>
        </View>
      ) : (
        <View style={styles.nativeCameraWrapper}>
          {/* Native Vision Camera */}
          {VisionCameraComponent && (
            <VisionCameraComponent
              style={StyleSheet.absoluteFill}
              isActive={isActive && isFocused}
              device={useCameraDeviceHook ? useCameraDeviceHook('back') : undefined}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0A0D12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixtureWrapper: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.space.md,
  },
  fixtureBadge: {
    position: 'absolute',
    bottom: theme.space.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 17, 22, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: '#374151',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.color.pass,
  },
  fixtureBadgeText: {
    color: theme.color.textDim,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  nativeCameraWrapper: {
    ...StyleSheet.absoluteFill,
  },
});
