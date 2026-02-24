import { DefaultTheme, Theme } from '@react-navigation/native';

import { palette } from './palette';

export const darkTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.accent,
    background: palette.background,
    card: palette.surface,
    text: palette.textPrimary,
    border: palette.surfaceMuted,
    notification: palette.danger
  }
};
