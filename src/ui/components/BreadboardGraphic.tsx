import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import calibration from '../overlay/boardCalibration.json';

interface BreadboardGraphicProps {
  width: number;
  height: number;
}

export function BreadboardGraphic({ width, height }: BreadboardGraphicProps) {
  const scaleX = width / calibration.boardWidth;
  const scaleY = height / calibration.boardHeight;
  const scale = Math.min(scaleX, scaleY);

  const boardW = calibration.boardWidth * scale;
  const boardH = calibration.boardHeight * scale;

  const cols = [1, 5, 10, 15, 20, 25, 30];
  const rowsTop = ['A', 'B', 'C', 'D', 'E'];
  const rowsBottom = ['F', 'G', 'H', 'I', 'J'];

  return (
    <View style={[styles.container, { width: boardW, height: boardH }]}>
      {/* Outer breadboard shell */}
      <View style={styles.boardBody}>
        {/* Top power rails (+ red, - blue) */}
        <View style={styles.railRow}>
          <View style={[styles.railLine, { backgroundColor: '#EF4444' }]} />
          <Text style={[styles.railLabel, { color: '#EF4444' }]}>+</Text>
          <View style={styles.railHoles}>
            {Array.from({ length: 15 }).map((_, i) => (
              <View key={`tp-${i}`} style={styles.hole} />
            ))}
          </View>
        </View>

        <View style={styles.railRow}>
          <View style={[styles.railLine, { backgroundColor: '#3B82F6' }]} />
          <Text style={[styles.railLabel, { color: '#3B82F6' }]}>-</Text>
          <View style={styles.railHoles}>
            {Array.from({ length: 15 }).map((_, i) => (
              <View key={`tn-${i}`} style={styles.hole} />
            ))}
          </View>
        </View>

        {/* Upper Terminal Section (A-E) */}
        <View style={styles.terminalSection}>
          <View style={styles.sectionHeader}>
            {cols.map((c) => (
              <Text key={`col-top-${c}`} style={styles.colNumber}>
                {c}
              </Text>
            ))}
          </View>

          <View style={styles.holeGrid}>
            {rowsTop.map((r) => (
              <View key={`row-${r}`} style={styles.gridRow}>
                <Text style={styles.rowLetter}>{r}</Text>
                <View style={styles.holesContainer}>
                  {Array.from({ length: 30 }).map((_, col) => (
                    <View
                      key={`h-${r}-${col + 1}`}
                      style={[
                        styles.hole,
                        (r === 'E' && col + 1 === 5) && styles.occupiedHole,
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.rowLetter}>{r}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Center Divider Trough */}
        <View style={styles.trough}>
          <View style={styles.troughLine} />
          <Text style={styles.troughText}>SKILLFORGE LAB BREADBOARD</Text>
          <View style={styles.troughLine} />
        </View>

        {/* Lower Terminal Section (F-J) */}
        <View style={styles.terminalSection}>
          <View style={styles.holeGrid}>
            {rowsBottom.map((r) => (
              <View key={`row-${r}`} style={styles.gridRow}>
                <Text style={styles.rowLetter}>{r}</Text>
                <View style={styles.holesContainer}>
                  {Array.from({ length: 30 }).map((_, col) => (
                    <View key={`h-${r}-${col + 1}`} style={styles.hole} />
                  ))}
                </View>
                <Text style={styles.rowLetter}>{r}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            {cols.map((c) => (
              <Text key={`col-bot-${c}`} style={styles.colNumber}>
                {c}
              </Text>
            ))}
          </View>
        </View>

        {/* Bottom power rails */}
        <View style={styles.railRow}>
          <View style={[styles.railLine, { backgroundColor: '#3B82F6' }]} />
          <Text style={[styles.railLabel, { color: '#3B82F6' }]}>-</Text>
          <View style={styles.railHoles}>
            {Array.from({ length: 15 }).map((_, i) => (
              <View key={`bn-${i}`} style={styles.hole} />
            ))}
          </View>
        </View>

        <View style={styles.railRow}>
          <View style={[styles.railLine, { backgroundColor: '#EF4444' }]} />
          <Text style={[styles.railLabel, { color: '#EF4444' }]}>+</Text>
          <View style={styles.railHoles}>
            {Array.from({ length: 15 }).map((_, i) => (
              <View key={`bp-${i}`} style={styles.hole} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardBody: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    padding: 8,
    justifyContent: 'space-between',
    elevation: 3,
  },
  railRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
    gap: 4,
  },
  railLine: {
    width: 14,
    height: 3,
    borderRadius: 1,
  },
  railLabel: {
    fontSize: 10,
    fontWeight: '800',
    width: 10,
  },
  railHoles: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  terminalSection: {
    marginVertical: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    marginBottom: 2,
  },
  colNumber: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4B5563',
  },
  holeGrid: {
    gap: 2,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLetter: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4B5563',
    width: 10,
    textAlign: 'center',
  },
  holesContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  hole: {
    width: 5,
    height: 5,
    backgroundColor: '#1F2937',
    borderRadius: 1,
  },
  occupiedHole: {
    backgroundColor: '#EF4444',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  trough: {
    height: 12,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  troughLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#9CA3AF',
  },
  troughText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 1,
  },
});
