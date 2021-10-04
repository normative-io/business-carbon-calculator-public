/** The available svg icons in @normative/theme. */
export const ICONS = [
  'actions',
  'arrow-right-up',
  'arrow-right',
  'avatar',
  'bullits',
  'calculator',
  'calendar',
  'capital',
  'car',
  'chat',
  'check-mark-circle',
  'check-mark',
  'chevron',
  'cogwheel',
  'compliance',
  'cop26',
  'customers',
  'documents',
  'download',
  'edit',
  'eye-2',
  'eye',
  'factory',
  'home',
  'info',
  'lightning-bolt',
  'lock',
  'log-out',
  'n',
  'nature',
  'news',
  'oil-can',
  'pie-chart',
  'plane',
  'plus',
  'position',
  'progress',
  'question',
  'recycling',
  'refrigeration',
  'reports',
  'scope-1-2-3',
  'search',
  'smoke',
  'sorting',
  'stories',
  'sustainability',
  'table-1',
  'table-2',
  'talent',
  'time',
  'train',
  'transactions',
  'upload',
  'wind-turbine',
] as const;

export const LOGOS = ['sme-climate-hub', 'google-org-mono'] as const;

export type Icon = typeof ICONS[number] | typeof LOGOS[number];