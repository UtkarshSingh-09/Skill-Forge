import { LearningNode, LearningGraph } from '../contract/types';
import { PRE_SEEDED_LEARNING_GRAPH, updateLearningGraph as updateGraphEngine } from '../engine/learningGraph';

export interface SkillIndicator {
  key: 'construction' | 'placement' | 'polarity' | 'safety' | 'troubleshooting';
  label: string;
  value: number; // 0..100
  color: string;
}

export interface RecentSession {
  id: string;
  procedureTitle: string;
  timestamp: number;
  durationSeconds: number;
  errorsCount: number;
  passed: boolean;
}

export interface SkillProfile {
  studentName: string;
  sessionsCompleted: number;
  indicators: SkillIndicator[];
  recentSessions: RecentSession[];
  learningGraph?: LearningGraph;
}

// In-memory active learning graph state initialized from pre-seeded baseline
let activeLearningGraph: LearningGraph = { ...PRE_SEEDED_LEARNING_GRAPH };

/**
 * Pre-seeded profile so the screen is demo-ready on stage (F9).
 * Session-derived skill indicators (never called "scores").
 */
export const initialSkillProfile: SkillProfile = {
  studentName: 'Devraj (Student)',
  sessionsCompleted: 4,
  indicators: [
    {
      key: 'construction',
      label: 'Circuit Construction',
      value: 86,
      color: '#38BDF8', // accent
    },
    {
      key: 'placement',
      label: 'Component Placement',
      value: 78,
      color: '#22C55E', // pass
    },
    {
      key: 'polarity',
      label: 'Polarity Orientation',
      value: 92,
      color: '#A855F7', // purple
    },
    {
      key: 'safety',
      label: 'Safety Awareness',
      value: 95,
      color: '#F97316', // safety
    },
    {
      key: 'troubleshooting',
      label: 'Troubleshooting & Fixes',
      value: 74,
      color: '#F59E0B', // amber
    },
  ],
  recentSessions: [
    {
      id: 'sess-001',
      procedureTitle: 'Light an LED',
      timestamp: Date.now() - 1000 * 60 * 42,
      durationSeconds: 140,
      errorsCount: 1,
      passed: true,
    },
    {
      id: 'sess-002',
      procedureTitle: 'Light an LED',
      timestamp: Date.now() - 1000 * 60 * 120,
      durationSeconds: 195,
      errorsCount: 2,
      passed: true,
    },
    {
      id: 'sess-003',
      procedureTitle: '7408 AND Gate Circuit',
      timestamp: Date.now() - 1000 * 60 * 60 * 5,
      durationSeconds: 310,
      errorsCount: 3,
      passed: true,
    },
  ],
  learningGraph: activeLearningGraph,
};

/**
 * Pushes a new completed session attempt into the student's learning graph
 * and recalculates overall mastery.
 */
export function updateLearningGraph(node: LearningNode): LearningGraph {
  activeLearningGraph = updateGraphEngine(activeLearningGraph, node);
  initialSkillProfile.learningGraph = activeLearningGraph;
  initialSkillProfile.sessionsCompleted = activeLearningGraph.nodes.length;
  return activeLearningGraph;
}

/**
 * Retrieves the complete array of learning progression nodes.
 */
export function getLearningHistory(): LearningNode[] {
  return activeLearningGraph.nodes;
}

/**
 * Retrieves the current student learning graph.
 */
export function getLearningGraph(): LearningGraph {
  return activeLearningGraph;
}

/**
 * Retrieves overall student mastery percentage (0-100).
 */
export function getOverallMasteryPct(): number {
  return activeLearningGraph.overallMasteryPct;
}
