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
              r={6}
              color={color}
              style="stroke"
              strokeWidth={4}
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
            />
          ))}
        </View>
      )}

      {/* Render the Badges on top ALWAYS so they are extremely visible */}
      <View style={StyleSheet.absoluteFill}>
        {rects.map((r) => (
          <View
            key={`badge-container-${r.cell}-${r.x}`}
            style={{
              position: 'absolute',
              left: r.x + r.width / 2 - 100, // Center using a 200px wide container
              top: r.y - 28, // Position above the bounding box
              width: 200,
              alignItems: 'center',
            }}
          >
            <View style={[styles.cellLabelBadge, { backgroundColor: color }]}>
              <Text style={styles.cellLabelText}>{r.cell}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  highlightBox: {
    position: 'absolute',
    borderWidth: 4,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  cellLabelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.2)', // Ensure edge contrast
  },
  cellLabelText: {
    color: '#000000', // Black text is generally higher contrast on vivid highlight colors
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
