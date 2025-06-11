export const engagementMetricsMapper = {
  'Time on site': {
    description: 'The average amount of time visitors spend on the website.',
    suffix: ' seconds',
    shouldRound: true,
  },
  'Page per visit': {
    description: 'The average number of pages viewed during a session.',
    suffix: ' pages',
    shouldRound: false,
  },
  'Bounce rate': {
    description:
      'How many visitors left the website without interacting further or navigating to another page.',
    suffix: '%',
    shouldRound: true,
  },
} as const;

export const PIE_COLORS = ['#007aff', '#65afff', '#98cafe', '#cde4ff', '#f0f9ff'];
export const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
