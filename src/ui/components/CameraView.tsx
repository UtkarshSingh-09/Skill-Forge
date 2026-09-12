import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, LayoutChangeEvent } from 'react-native';
import { usePathname } from 'expo-router';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { BreadboardGraphic } from './BreadboardGraphic';
import { theme } from '../theme';
import { useVisionFrameProcessor } from '../../perception/frameProcessor';
import { loadModels } from '../../perception/modelRegistry';
import { useStore } from '../../session/store';

// Safely attempt to import react-native-vision-camera if available in standalone binary
let VisionCameraComponent: any = null;
let useCameraDeviceHook: any = null;

try {
  const RNC = require('react-native-vision-camera');
  VisionCameraComponent = RNC.Camera;
  useCameraDeviceHook = RNC.useCameraDevice;
} catch {
  VisionCameraComponent = null;
}

interface CameraViewProps {
  isActive?: boolean;
  frameProcessor?: any;
  onLayout?: (e: LayoutChangeEvent) => void;
  fixtureMode?: boolean;
  showModeToggle?: boolean;
  /** When true, mounts the ML frame processor + loads the TFLite models (Analyse page). */
  enableDetection?: boolean;
}

export function CameraView({
  isActive = true,
  onLayout,
  fixtureMode: initialFixtureMode = false,
  showModeToggle = false,
  enableDetection = false,
}: CameraViewProps) {
  const pathname = usePathname();

  // ML wiring (Master Plan §4.1). Hooks are called unconditionally; the
  // frame processor is only attached to the camera when enableDetection is on.
  const visionFrameProcessor = useVisionFrameProcessor();
  const setSensorState = useStore((s) => s.actions.setSensorState);
  const device = useCameraDeviceHook ? useCameraDeviceHook('back') : null;

  React.useEffect(() => {
    if (!enableDetection) return;
    // Kick off model load once (idempotent; flips caps.mlDetector on success).
    void loadModels();
    setSensorState('camera', true);
    return () => setSensorState('camera', false);
  }, [enableDetection, setSensorState]);
  const isCameraScreen =
    pathname.includes('coach') ||
    pathname.includes('analyse') ||
    pathname.includes('workbench') ||
    pathname.includes('learn');
  const isFocused = isCameraScreen || pathname === '/';
  const [permission, requestPermission] = useCameraPermissions();
  const [showVirtualBoard, setShowVirtualBoard] = useState<boolean>(initialFixtureMode);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 360,
    height: 300,
  });

  React.useEffect(() => {
    setShowVirtualBoard(initialFixtureMode);
  }, [initialFixtureMode]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDimensions({ width, height });
    if (onLayout) onLayout(e);
  };

  // If user explicitly toggled virtual board:
  if (showVirtualBoard) {
    return (
      <View style={styles.container} onLayout={handleLayout}>
        <View style={styles.fixtureWrapper}>
          <BreadboardGraphic
            width={Math.max(280, dimensions.width - 32)}
            height={Math.max(200, dimensions.height - 80)}
          />
        </View>

        {/* Mode Switcher Pill */}
        <Pressable
          style={styles.modeTogglePill}
          onPress={() => setShowVirtualBoard(false)}
        >
          <Ionicons name="camera-outline" size={14} color="#38BDF8" />
          <Text style={styles.modeToggleText}>SWITCH TO LIVE CAMERA</Text>
        </Pressable>
      </View>
    );
  }

  // If camera permission is not yet granted:
  if (!permission?.granted) {
    return (
      <View style={styles.container} onLayout={handleLayout}>
        <View style={styles.permissionCard}>
          <Ionicons name="videocam-outline" size={36} color={theme.color.accent} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionDesc}>
            Enable the camera to track your physical breadboard and overlay real-time AR circuit guidance.
          </Text>
          <Pressable
            style={styles.permissionBtn}
            onPress={requestPermission}
          >
            <Text style={styles.permissionBtnText}>Enable Live Camera</Text>
          </Pressable>

          <Pressable
            style={styles.switchVirtualLink}
            onPress={() => setShowVirtualBoard(true)}
          >
            <Text style={styles.switchVirtualLinkText}>Or use Virtual Breadboard</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Live Camera Render
  return (
    <View style={styles.container} onLayout={handleLayout}>
      {VisionCameraComponent && device ? (
        <VisionCameraComponent
          style={StyleSheet.absoluteFill}
          isActive={isActive && isFocused}
          device={device}
          frameProcessor={enableDetection ? visionFrameProcessor : undefined}
        />
      ) : (
        <ExpoCameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          active={isActive && isFocused}
        />
      )}

      {/* Mode Switcher Pill */}
      {showModeToggle && (
        <Pressable
          style={styles.modeTogglePill}
          onPress={() => setShowVirtualBoard(true)}
        >
          <View style={styles.liveDot} />
          <Text style={styles.modeToggleText}>LIVE CAMERA (Tap for Virtual)</Text>
        </Pressable>
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
  modeTogglePill: {
    position: 'absolute',
    bottom: theme.space.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 17, 22, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: '#374151',
    gap: 6,
    zIndex: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.color.pass,
  },
  modeToggleText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  permissionCard: {
    alignItems: 'center',
    padding: theme.space.lg,
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    marginHorizontal: theme.space.lg,
    borderWidth: 1,
    borderColor: '#2D3748',
    gap: theme.space.xs,
  },
  permissionTitle: {
    color: theme.color.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: theme.space.xs,
  },
  permissionDesc: {
    color: theme.color.textDim,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginVertical: theme.space.xs,
  },
  permissionBtn: {
    backgroundColor: theme.color.accent,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.sm,
    borderRadius: theme.radius.sm,
    marginTop: theme.space.xs,
  },
  permissionBtnText: {
    color: theme.color.bg,
    fontSize: 13,
    fontWeight: '700',
  },
  switchVirtualLink: {
    marginTop: theme.space.sm,
    padding: 4,
  },
  switchVirtualLinkText: {
    color: theme.color.textDim,
    fontSize: 11,
    textDecorationLine: 'underline',
  },
});
