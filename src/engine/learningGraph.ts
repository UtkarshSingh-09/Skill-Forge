import { LearningNode, LearningGraph, SessionEvent } from '../contract/types';

export function createLearningNodeFromEvents(
  procedureId: string,
  attemptNumber: number,
  events: SessionEvent[],
  completionTimeSec: number
): LearningNode {
  const passes = events.filter(e => e.type === 'PASS').length;
  const fails = events.filter(e => e.type === 'FAIL').length;
  const total = passes + fails;
  const accuracyPct = total > 0 ? Math.round((passes / total) * 100) : 100;
  const hintsUsed = events.filter(e => e.type === 'HINT_REQUESTED').length;
  const safetyViolations = events.filter(e => e.type === 'SAFETY_WARNING').length;

  return {
    procedureId,
    attemptNumber,
    accuracyPct,
    hintsUsed,
    safetyViolations,
    completionTimeSec,
    timestamp: Date.now(),
    status: 'COMPLETED'
  };
}

export function updateLearningGraph(
  graph: LearningGraph,
  newNode: LearningNode
): LearningGraph {
  const updatedNodes = [...graph.nodes, newNode];
  const overallMasteryPct = Math.round(
    updatedNodes.reduce((sum, n) => sum + n.accuracyPct, 0) / updatedNodes.length
  );
  return {
    ...graph,
    nodes: updatedNodes,
    overallMasteryPct
  };
}

export const PRE_SEEDED_LEARNING_GRAPH: LearningGraph = {
  studentId: 'student_iqoo_demo',
  nodes: [
    {
      procedureId: 'arduino_led_v1',
      attemptNumber: 1,
      accuracyPct: 60,
      hintsUsed: 3,
      safetyViolations: 1,
      completionTimeSec: 135,
      timestamp: 1726115000000,
      status: 'COMPLETED'
    },
    {
      procedureId: 'arduino_led_v1',
      attemptNumber: 2,
      accuracyPct: 85,
      hintsUsed: 1,
      safetyViolations: 0,
      completionTimeSec: 72,
      timestamp: 1726116200000,
      status: 'COMPLETED'
    },
    {
      procedureId: 'arduino_led_v1',
      attemptNumber: 3,
      accuracyPct: 100,
      hintsUsed: 0,
      safetyViolations: 0,
      completionTimeSec: 38,
      timestamp: 1726117400000,
      status: 'COMPLETED'
    }
  ],
  overallMasteryPct: 82
};
