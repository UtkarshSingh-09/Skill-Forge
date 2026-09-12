import { EvaluationResult, Verdict, FailReason } from '../contract/types';
import { theme } from './theme';

export interface VerdictViewConfig {
  color: string;
  icon: string;
  text: string;
  overlayColor: string | null;
  speak: string | null;
  hapticPattern: 'light_double' | 'strong_single' | 'long_buzz' | null;
}

export type VerdictInput = Partial<EvaluationResult> & {
  result?: Verdict;
  reason?: FailReason;
};

export function mapVerdict(res: VerdictInput | null | undefined): VerdictViewConfig {
  if (!res || !res.result) {
    return {
      color: theme.color.surface,
      icon: 'information-circle-outline',
      text: 'Ready — tap TEST when placed',
      overlayColor: null,
      speak: null,
      hapticPattern: null,
    };
  }

  switch (res.result) {
    case 'CHECKING':
      return {
        color: theme.color.checking,
        icon: 'sync-outline',
        text: 'Checking…',
        overlayColor: null,
        speak: null,
        hapticPattern: null,
      };

    case 'PASS':
      return {
        color: theme.color.pass,
        icon: 'checkmark-circle',
        text: res.hint || 'Correct — next step',
        overlayColor: theme.color.pass,
        speak: 'Correct.',
        hapticPattern: 'light_double',
      };

    case 'FAIL': {
      if (res.reason === 'safety_violation') {
        const msg = res.safetyViolations?.[0] || res.hint || 'Safety hazard detected!';
        return {
          color: theme.color.safety,
          icon: 'warning',
          text: msg,
          overlayColor: theme.color.safety,
          speak: msg,
          hapticPattern: 'long_buzz',
        };
      }
      if (res.reason === 'missing') {
        const text = res.hint || 'Missing — add the component';
        return {
          color: theme.color.fail,
          icon: 'close-circle',
          text,
          overlayColor: theme.color.fail,
          speak: text,
          hapticPattern: 'strong_single',
        };
      }
      if (res.reason === 'wrong_position') {
        const text = res.hint || 'Wrong hole — adjust position';
        return {
          color: theme.color.fail,
          icon: 'close-circle',
          text,
          overlayColor: theme.color.fail,
          speak: text,
          hapticPattern: 'strong_single',
        };
      }
      if (res.reason === 'reversed') {
        const text = res.hint || 'Flip it — tagged leg up';
        return {
          color: theme.color.fail,
          icon: 'reload-circle-outline',
          text,
          overlayColor: theme.color.fail,
          speak: text,
          hapticPattern: 'strong_single',
        };
      }
      const text = res.hint || 'Incorrect placement';
      return {
        color: theme.color.fail,
        icon: 'close-circle',
        text,
        overlayColor: theme.color.fail,
        speak: text,
        hapticPattern: 'strong_single',
      };
    }

    case 'UNCERTAIN': {
      if (res.reason === 'board_not_found') {
        return {
          color: theme.color.uncertain,
          icon: 'eye-outline',
          text: res.hint || 'Align the board in view',
          overlayColor: null,
          speak: "I can't see the board.",
          hapticPattern: null,
        };
      }
      if (res.reason === 'occluded') {
        return {
          color: theme.color.uncertain,
          icon: 'hand-left-outline',
          text: res.hint || 'Move your hands, then TEST',
          overlayColor: null,
          speak: 'Move your hands away.',
          hapticPattern: null,
        };
      }
      if (res.reason === 'unstable') {
        return {
          color: theme.color.uncertain,
          icon: 'pulse-outline',
          text: res.hint || 'Hold steady',
          overlayColor: null,
          speak: 'Hold the phone steady.',
          hapticPattern: null,
        };
      }
      return {
        color: theme.color.uncertain,
        icon: 'alert-circle-outline',
        text: res.hint || 'Uncertain — please check view',
        overlayColor: null,
        speak: 'Please adjust phone angle and re-test.',
        hapticPattern: null,
      };
    }
  }
}
