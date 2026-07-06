import colors from './colors';
import spacing from './spacing';
import shadows from './shadows';
import typography from './typography';
import radius from './radius';

export const theme = {
  colors,
  spacing,
  shadows,
  typography,
  radius,
} as const;

export default theme;
export * from './colors';
export * from './spacing';
export * from './shadows';
export * from './typography';
export * from './radius';
