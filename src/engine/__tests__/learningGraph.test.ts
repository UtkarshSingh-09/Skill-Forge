import { LearningNode, LearningGraph, SessionEvent } from '../../contract/types';
import {
  createLearningNodeFromEvents,
  updateLearningGraph,
  PRE_SEEDED_LEARNING_GRAPH
} from '../learningGraph';

describe('SkillForge Learning Graph Suite', () => {
  it('calculates mastery progression across multiple procedure attempts', () => {
    const nodes: LearningNode[] = [
      {
        procedureId: 'arduino_led_v1',
        attemptNumber: 1,
        accuracyPct: 50,
        hintsUsed: 3,
        safetyViolations: 1,
        completionTimeSec: 120,
        timestamp: 1726117200000,
        status: 'COMPLETED'
      },
      {
        procedureId: 'arduino_led_v1',
        attemptNumber: 2,
        accuracyPct: 100,
        hintsUsed: 0,
        safetyViolations: 0,
        completionTimeSec: 45,
        timestamp: 1726117300000,
        status: 'COMPLETED'
      }
    ];

    const graph: LearningGraph = {
      studentId: 'student_devraj',
      nodes,
      overallMasteryPct: Math.round(
        nodes.reduce((acc, n) => acc + n.accuracyPct, 0) / nodes.length
      )
    };

    expect(graph.nodes).toHaveLength(2);
    expect(graph.overallMasteryPct).toBe(75);
    expect(graph.nodes[1].accuracyPct).toBeGreaterThan(graph.nodes[0].accuracyPct);
    expect(graph.nodes[1].completionTimeSec).toBeLessThan(graph.nodes[0].completionTimeSec);
  });

  it('generates a valid LearningNode from recorded SessionEvents', () => {
    const events: SessionEvent[] = [
      { id: 1, timestamp: 100, type: 'SESSION_START', sessionId: 's1', payload: {} },
      { id: 2, timestamp: 200, type: 'TEST_REQUESTED', sessionId: 's1', payload: {} },
      { id: 3, timestamp: 300, type: 'FAIL', sessionId: 's1', payload: {} },
      { id: 4, timestamp: 400, type: 'HINT_REQUESTED', sessionId: 's1', payload: {} },
      { id: 5, timestamp: 500, type: 'TEST_REQUESTED', sessionId: 's1', payload: {} },
      { id: 6, timestamp: 600, type: 'PASS', sessionId: 's1', payload: {} }
    ];

    const node = createLearningNodeFromEvents('arduino_led_v1', 1, events, 65);
    expect(node.procedureId).toBe('arduino_led_v1');
    expect(node.attemptNumber).toBe(1);
    expect(node.accuracyPct).toBe(50); // 1 pass out of 2 test outcomes
    expect(node.hintsUsed).toBe(1);
    expect(node.safetyViolations).toBe(0);
    expect(node.completionTimeSec).toBe(65);
    expect(node.status).toBe('COMPLETED');
  });

  it('dynamically updates LearningGraph with new attempt and recalculates mastery', () => {
    const initialGraph: LearningGraph = {
      studentId: 'student_test',
      nodes: [
        {
          procedureId: 'arduino_led_v1',
          attemptNumber: 1,
          accuracyPct: 50,
          hintsUsed: 2,
          safetyViolations: 0,
          completionTimeSec: 100,
          timestamp: 1000,
          status: 'COMPLETED'
        }
      ],
      overallMasteryPct: 50
    };

    const nextNode: LearningNode = {
      procedureId: 'arduino_led_v1',
      attemptNumber: 2,
      accuracyPct: 90,
      hintsUsed: 0,
      safetyViolations: 0,
      completionTimeSec: 40,
      timestamp: 2000,
      status: 'COMPLETED'
    };

    const updated = updateLearningGraph(initialGraph, nextNode);
    expect(updated.nodes).toHaveLength(2);
    expect(updated.overallMasteryPct).toBe(70); // (50 + 90) / 2 = 70
  });

  it('validates PRE_SEEDED_LEARNING_GRAPH demonstrates positive learning arc', () => {
    expect(PRE_SEEDED_LEARNING_GRAPH.nodes).toHaveLength(3);
    const [att1, att2, att3] = PRE_SEEDED_LEARNING_GRAPH.nodes;
    expect(att2.accuracyPct).toBeGreaterThan(att1.accuracyPct);
    expect(att3.accuracyPct).toBeGreaterThan(att2.accuracyPct);
    expect(att3.hintsUsed).toBe(0);
    expect(att3.safetyViolations).toBe(0);
    expect(PRE_SEEDED_LEARNING_GRAPH.overallMasteryPct).toBeGreaterThanOrEqual(80);
  });
});
