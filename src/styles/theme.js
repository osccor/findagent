// Design tokens lifted from the Figma "Matcha Mäklare" file (node 6316-4576).
// Keep names aligned with the Figma variable names so designers and devs share a vocabulary.

const theme = {
  colors: {
    // Brand
    primary: '#8046FF', // Primary Purple / Primary Default
    primaryDark: '#5b2fd1',
    primaryTint: '#f1ebff',

    // Monochrome scale (Figma "Grey" tokens)
    grey90: '#161616', // headings on light
    grey70: '#262626', // card name / strong body
    grey60: '#535353', // secondary text (agency)
    grey40: '#949494',
    grey20: '#E2E2E2', // card border
    grey10: '#F2F2F2', // hairlines
    surfaceMuted: '#F7F7F7', // KPI tile background
    white: '#FFFFFF',

    // Accent
    coral: '#FF7269', // "På G" / "Flest sålda" badge
    coralTint: '#fff0ef',
    gold: '#f5a623', // ratings
    success: '#1f9d6b',

    // Page
    pageBg: '#f6f4ff',
    text: '#262626',
    textMuted: 'rgba(0,0,0,0.7)',
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '16px',
    pill: '100px',
  },
  shadow: {
    card: '0px 5px 10px rgba(0,0,0,0.04)',
    nav: '0px 4px 2px rgba(0,0,0,0.05)',
    raised: '0px 12px 32px rgba(80,40,160,0.12)',
  },
  font: {
    // DM Sans is loaded via next/font in _app.js and exposed as a CSS variable.
    family: 'var(--font-dm-sans), -apple-system, Segoe UI, Roboto, sans-serif',
  },
  layout: {
    maxWidth: '1024px',
    contentPad: '24px',
  },
  breakpoints: {
    sm: '600px',
    md: '900px',
    lg: '1100px',
  },
};

export default theme;
