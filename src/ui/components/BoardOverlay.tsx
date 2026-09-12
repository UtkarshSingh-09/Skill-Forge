import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Cell } from '../../contract/types';
import { getHighlightRects, CellRect } from '../overlay/boardCalibration';
import { theme } from '../theme';

// Safely attempt to import Skia
let Canvas: any = null;
let RoundedRect: any = null;
let Paint: any = null;

try {
  const SkiaModule = require('@shopify/react-native-skia');
  Canvas = SkiaModule.Canvas;
  RoundedRect = SkiaModule.RoundedRect;
  Paint = SkiaModule.Paint;
} catch {
  Canvas = null;
}

interface BoardOverlayProps {
  highlightCells: Cell[];
  color?: string | null;
  width: number;
  height: number;
  visible?: boolean;
}

export function BoardOverlay({
  highlightCells,
  color,
  width,
  height,
  visible = true,
}: BoardOverlayProps) {
  if (!visible || !color || !highlightCells || highlightCells.length === 0) {
    return null;
  }

  // Calculate pixel coordinates using static homography calibration
  const rects: CellRect[] = getHighlightRects(highlightCells, width, height);

  if (rects.length === 0) {
    return null;
  }

  // If Skia is available in the environment, render high-performance Skia Canvas
  const canUseSkia = Canvas !== null && RoundedRect !== null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {canUseSkia ? (
        <Canvas style={StyleSheet.absoluteFill}>
          {rects.map((r) => (
            <RoundedRect
              key={`skia-${r.cell}-${r.x}`}
              x={r.x}
              y={r.y}
              width={r.width}
              height={r.height}
              r={4}
              color={color}
              style="stroke"
              strokeWidth={3}
            />
          ))}
        </Canvas>
      ) : (
        /* Graceful fallback for environments where Skia binary is not linked (Expo Go) */
        <View style={StyleSheet.absoluteFill}>
          {rects.map((r) => (
            <View
              key={`box-${r.cell}-${r.x}`}
              style={[
                styles.highlightBox,
                {
                  left: r.x,
                  top: r.y,
                  width: r.width,
                  height: r.height,
                  borderColor: color,
                  backgroundColor: `${color}20`,
                },
              ]}
            >
              <View style={[styles.cellLabelBadge, { backgroundColor: color }]}>
                <Text style={styles.cellLabelText}>{r.cell}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  highlightBox: {
    position: 'absolute',
    borderWidth: 2.5,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cellLabelBadge: {
    position: 'absolute',
    top: -14,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    alignSelf: 'center',
  },
  cellLabelText: {
    color: '#0E1116',
    fontSize: 9,
    fontWeight: '800',
  },
});
