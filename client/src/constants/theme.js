/**
 * Crypto Compass Design System Tokens
 * Source of truth mapped to the Phase 1 visual reference.
 */

export const THEME_COLORS = {
  // Brand Accents
  primary: {
    name: 'Primary',
    hex: '#00F59B',
    description: 'Core brand neon green for active states, primary CTAs, and success accents',
  },
  secondary: {
    name: 'Secondary',
    hex: '#8A2BE2',
    description: 'Royal purple for secondary accents, advanced tier tags, and XP meters',
  },
  cyan: {
    name: 'Cyan',
    hex: '#00D4FF',
    description: 'Futuristic cyan for informational indicators, subtle glows, and tech highlights',
  },
  accent: {
    name: 'Accent',
    hex: '#3882F6',
    description: 'Vibrant electric blue for badges, links, and secondary indicators',
  },
  success: {
    name: 'Success',
    hex: '#22C55E',
    description: 'Confirmed state, profit indicators, and positive metrics',
  },
  warning: {
    name: 'Warning',
    hex: '#F59E0B',
    description: 'Risk cautions, cautionary trade coach notices, and alerts',
  },
  error: {
    name: 'Error',
    hex: '#EF4444',
    description: 'Critical validation errors, loss metrics, and danger actions',
  },
  background: {
    name: 'Background',
    hex: '#050505',
    description: 'Near-black deepest space canvas background',
  },
  surface: {
    name: 'Surface',
    hex: '#101014',
    description: 'Dark translucent glass card panels and elevation surfaces',
  },
  border: {
    name: 'Border',
    hex: '#FFFFFF1A',
    description: 'Subtle translucent white border for thin precision edges',
  },
};

export const TYPOGRAPHY_TOKENS = [
  { level: 'Display', sample: 'Your Journey Starts Here', size: 'text-4xl md:text-5xl font-extrabold', tracking: 'tracking-tight' },
  { level: 'H1', sample: 'Learn. Practice. Improve.', size: 'text-2xl md:text-3xl font-bold', tracking: 'tracking-tight' },
  { level: 'H2', sample: 'Trade Smarter', size: 'text-xl md:text-2xl font-semibold', tracking: 'tracking-normal' },
  { level: 'H3', sample: 'Build Better Habits', size: 'text-lg md:text-xl font-medium', tracking: 'tracking-normal' },
  { level: 'Body', sample: 'Crypto education for everyone.', size: 'text-sm md:text-base font-normal', tracking: 'leading-relaxed' },
  { level: 'Small', sample: 'Real market data. Virtual money.', size: 'text-xs md:text-sm font-normal', tracking: 'tracking-wide' },
  { level: 'Caption', sample: 'No real money involved.', size: 'text-[11px] font-mono', tracking: 'tracking-wider uppercase' },
];

export const TRANSITION_TOKENS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
  slow: '400ms cubic-bezier(0.16, 1, 0.3, 1)',
};
