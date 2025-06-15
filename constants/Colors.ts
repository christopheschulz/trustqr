/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    danger: '#E53935',
    // Couleurs de sécurité
    security: {
      safe: '#4CAF50',      // Vert pour sûr
      suspect: '#FF9800',   // Orange pour suspect  
      dangerous: '#F44336', // Rouge pour dangereux
    },
    // Couleurs système
    shadow: '#000',
    white: '#fff',
    error: '#F44336',
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.5)',
    tintWithOpacity: tintColorLight + '10', // Tint avec 10% d'opacité
    button: {
      primary: {
        background: tintColorLight,
        text: '#fff',
        border: 'transparent',
      },
      secondary: {
        background: '#f0f8fc',
        text: '#0a7ea4',
        border: '#d1e9f2',
      },
      danger: {
        background: '#E53935',
        text: '#fff',
        border: 'transparent',
      },
      action: {
        background: '#FF6B35',
        text: '#fff',
        border: 'transparent',
      },
    },
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    danger: '#E53935',
    // Couleurs de sécurité
    security: {
      safe: '#4CAF50',      // Vert pour sûr
      suspect: '#FF9800',   // Orange pour suspect
      dangerous: '#F44336', // Rouge pour dangereux
    },
    // Couleurs système
    shadow: '#000',
    white: '#fff',
    error: '#F44336',
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.5)',
    tintWithOpacity: tintColorDark + '10', // Tint avec 10% d'opacité
    button: {
      primary: {
        background: tintColorDark,
        text: '#151718',
        border: 'transparent',
      },
      secondary: {
        background: '#2a2f33',
        text: '#ffffff',
        border: '#404448',
      },
      danger: {
        background: '#E53935',
        text: '#fff',
        border: 'transparent',
      },
      action: {
        background: '#FF6B35',
        text: '#fff',
        border: 'transparent',
      },
    },
  },
};
