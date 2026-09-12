export const theme = {
  color: {
    bg:        '#0A0C10',
    surface:   '#141720',
    text:      '#F8FAFC',
    textDim:   '#94A3B8',
    pass:      '#10B981',
    fail:      '#F43F5E',
    uncertain: '#F59E0B',
    checking:  '#3B82F6',
    safety:    '#F97316',
    accent:    '#3B82F6',
    border:    'rgba(255, 255, 255, 0.08)',
  },
  radius: { sm: 8, md: 14, lg: 20, pill: 999 },
  space:  { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  font:   { h1: 24, h2: 20, body: 15, label: 12 },
  hit:    { testButton: 54 },
} as const;
