import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GroundTruth } from '../../contract/types';
import { theme } from '../theme';
import { caps } from '../../capabilities';

interface ArduinoPanelProps {
  groundTruth?: GroundTruth | null;
  procedureId?: string;
}

export function ArduinoPanel({ groundTruth, procedureId }: ArduinoPanelProps) {
  // If capability is turned off or not available, hide the panel completely (F.4 rule)
  if (!caps.arduino || !groundTruth || !groundTruth.available) {
    return null;
  }

  const isAndGate = procedureId?.includes('AND');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Ionicons name="hardware-chip" size={16} color={theme.color.pass} />
          <Text style={styles.title}>Electrical Ground Truth</Text>
        </View>
        <View style={styles.liveTag}>
          <View style={styles.dot} />
          <Text style={styles.liveText}>USB OTG</Text>
        </View>
      </View>

      {groundTruth.continuity !== undefined && (
        <View style={styles.row}>
          <Text style={styles.label}>Loop Continuity:</Text>
          <Text style={[styles.status, { color: groundTruth.continuity ? theme.color.pass : theme.color.fail }]}>
            {groundTruth.continuity ? 'VERIFIED ✓' : 'OPEN CIRCUIT ✕'}
          </Text>
        </View>
      )}

      {groundTruth.ledOn !== undefined && (
        <View style={styles.row}>
          <Text style={styles.label}>Current Sensing:</Text>
          <Text style={[styles.status, { color: groundTruth.ledOn ? theme.color.pass : theme.color.fail }]}>
            {groundTruth.ledOn ? 'CURRENT FLOWING (LED ON)' : 'NO CURRENT'}
          </Text>
        </View>
      )}

      {/* 7408 AND Gate Truth Table Display (The Showcase) */}
      {isAndGate && groundTruth.truthTable && groundTruth.truthTable.length > 0 && (
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>7408 TTL Truth Table Verification:</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.th}>A</Text>
            <Text style={styles.th}>B</Text>
            <Text style={styles.th}>Y (Read)</Text>
            <Text style={styles.th}>Expected</Text>
            <Text style={styles.th}>Status</Text>
          </View>
          {groundTruth.truthTable.map((row, idx) => {
            const matches = row.out === row.expected;
            return (
              <View
                key={idx}
                style={[
                  styles.tableRow,
                  !matches && styles.tableRowError,
                ]}
              >
                <Text style={styles.td}>{row.a}</Text>
                <Text style={styles.td}>{row.b}</Text>
                <Text style={[styles.td, !matches && { color: theme.color.fail, fontWeight: '800' }]}>
                  {row.out}
                </Text>
                <Text style={styles.td}>{row.expected}</Text>
                <Text style={[styles.tdStatus, { color: matches ? theme.color.pass : theme.color.fail }]}>
                  {matches ? '✓ PASS' : '✕ FAIL'}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    padding: theme.space.sm,
    marginHorizontal: theme.space.md,
    marginBottom: theme.space.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: theme.color.text,
    fontSize: 12,
    fontWeight: '700',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: theme.radius.pill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.color.pass,
  },
  liveText: {
    color: theme.color.textDim,
    fontSize: 9,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    color: theme.color.textDim,
    fontSize: 11,
  },
  status: {
    fontSize: 11,
    fontWeight: '700',
  },
  tableContainer: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 4,
  },
  tableTitle: {
    color: theme.color.text,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  th: {
    flex: 1,
    color: theme.color.textDim,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  tableRowError: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 2,
  },
  td: {
    flex: 1,
    color: theme.color.text,
    fontSize: 10,
    textAlign: 'center',
  },
  tdStatus: {
    flex: 1,
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },
});
