import {
  createGlobalStyle,
  css,
  RuleSet,
  ThemeProvider,
} from 'styled-components';
import { usePreferredColorScheme } from './util';

export const GlobalStyle: ReturnType<typeof createGlobalStyle> =
  createGlobalStyle`
body {
  &.touch-mode * {
    cursor: none !important;
  }
}
`;

export const DARK_THEME = {
  pageBg: '#333',
  colorGreen: '#98c379',
  colorRed: '#e06c75',
  colorAmber: '#d19a66',
  bgDark1: '#252524',
  bg: '#2a2a2b',
  bgLight1: '#353638',
  borderDark: '#151516',
  borderLight: '#1c1d1d',
  borderLighter: '#252524',
  borderLighterer: '#6b6b67',
  hint: '#4286f4',
  hintRGB: '66, 134, 244',
  hintDark1: '#2a77f3',
  textNormal: '#F3F3F5',
  textActive: '#ffffff',
  textMuted: '#777777',
  shadows: {
    boxShadowInset: 'inset 0px 0px 8px 0px rgba(0, 0, 0, 0.3)',
    textShadow: '0 -1px rgba(0, 0, 0, 0.7)',
    textShadowActive: '0 -1px rgba(0, 0, 0, 0.4)',
  },
  gradients: {
    button: 'linear-gradient(to bottom, #4f5053, #343436)',
    buttonHover: 'linear-gradient(to bottom, #5e6064, #393a3b)',
    buttonActive: 'linear-gradient(to bottom, #242525, #37383a)',
    buttonPressedHover: 'linear-gradient(to bottom, #282929, #414243)',
    hintPressed: 'linear-gradient(to bottom,#2a77f3,#4286f4)',
  },
  sizingPx: {
    spacing: 15,
    unitHeight: 40,
  },
};

export type Theme = typeof DARK_THEME;

export const LIGHT_THEME: Theme = {
  pageBg: '#f8f9fa',
  colorGreen: '#22863a',
  colorRed: '#d73a49',
  colorAmber: '#b08800',
  bgDark1: '#e9ecef',
  bg: '#ffffff',
  bgLight1: '#f5f5f5',
  borderDark: '#c7c7c7',
  borderLight: '#d7d7d7',
  borderLighter: '#eaecef',
  borderLighterer: '#f6f8fa',
  hint: '#4286f4',
  hintRGB: '0, 92, 197',
  hintDark1: '#2a77f3',
  textNormal: '#24292e',
  textActive: '#202020',
  textMuted: '#6a737d',
  shadows: {
    boxShadowInset: 'inset 0px 0px 8px 0px rgba(0, 0, 0, 0.05)',
    textShadow: '0 1px rgba(255, 255, 255, 0.7)',
    textShadowActive: '0 1px rgba(255, 255, 255, 0.4)',
  },
  gradients: {
    button: 'linear-gradient(to bottom, #e1e4e8, #d1d5da)',
    buttonHover: 'linear-gradient(to bottom, #d1d5da, #c1c6cc)',
    buttonActive: 'linear-gradient(to bottom, #b1b6bc, #d2d6da)',
    buttonPressedHover: 'linear-gradient(to bottom, #a1a6ac, #91969c)',
    hintPressed: 'linear-gradient(to bottom, #438bff, #85b3ff)',
  },
  sizingPx: DARK_THEME.sizingPx,
};

export const BaseStyle: ReturnType<typeof createGlobalStyle> =
  createGlobalStyle`
* {
  box-sizing: border-box;
}

body {
  background: ${(p) => p.theme.pageBg};
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-family: sans-serif;
}
`;

export const buttonStateNormal: RuleSet<object> = css`
  color: ${(p) => p.theme.textNormal};
  background: ${(p) => p.theme.gradients.button};
  text-shadow: ${(p) => p.theme.shadows.textShadow};
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 1px 0 0 rgba(0, 0, 0, 0.25);
`;

export const buttonStateNormalHover: RuleSet<object> = css`
  color: ${(p) => p.theme.textNormal};
  outline-color: rgba(243, 243, 245, 0.3);
  background: ${(p) => p.theme.gradients.buttonHover};
  text-shadow: ${(p) => p.theme.shadows.textShadow};
`;

export const buttonStateNormalActive: RuleSet<object> = css`
  color: ${(p) => p.theme.textNormal};
  outline-color: rgba(255, 255, 255, 0.3);
  background: ${(p) => p.theme.gradients.buttonActive};
  text-shadow: ${(p) => p.theme.shadows.textShadowActive};
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.2),
    0 1px 0 0 rgba(255, 255, 255, 0.15);
  transition-duration: 50ms;
`;

const buttonStatePressed: RuleSet<object> = css`
  ${buttonStateNormalActive}
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 1px 0 0 rgba(255,255,255,0.15);
`;

const buttonStatePressedHover: RuleSet<object> = css`
  ${buttonStateNormalActive}
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.1), 0 1px 0 0 rgba(255,255,255,0.15);
  background: ${(p) => p.theme.gradients.buttonPressedHover};
`;

const buttonStatePressedActive: RuleSet<object> = buttonStateNormalActive;

const buttonStateDisabled: RuleSet<object> = css`
  ${buttonStateNormal}

  cursor: default;
  background: ${(p) => p.theme.bg} !important;
  color: rgba(${(p) => p.theme.textNormal}, 0.4);
`;

const button: RuleSet<object> = css`
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 200ms;
  border-radius: 3px;
  border: 1px solid ${(p) => p.theme.borderDark};
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  outline-color: transparent;
  ${buttonStateNormal}

  &:hover {
    ${buttonStateNormalHover}
  }

  &:active {
    ${buttonStateNormalActive}
  }
`;

export const buttonPressed: RuleSet<object> = css`
  ${buttonStatePressed}

  &:hover {
    ${buttonStatePressedHover}
  }

  &:active {
    ${buttonStatePressedActive}
  }
`;

export const buttonDisabled: RuleSet<object> = css`
  ${buttonStateDisabled}

  &:hover, &:active {
    ${buttonStateDisabled}
  }
`;

export const rectButton: RuleSet<object> = button;

export const touchIndicatorNormal: RuleSet<object> = css`
  position: absolute;
  top: -6px;
  right: -6px;
  left: -6px;
  bottom: -6px;
  border-radius: 6px;
  border: 2px solid rgba(0, 0, 0, 0);
  background-color: none;
  transition: border-color 300ms;
`;

export const touchIndicatorTouching: RuleSet<object> = css`
  border-color: ${(p) => p.theme.hint};
  background-color: rgba(${(p) => p.theme.hintRGB}, 0.2);
  transition: border-color 0s;
`;

export const PreferredThemeProvider: React.FC<{
  dark: Theme;
  light: Theme;
  children: React.ReactNode;
}> = ({ dark, light, children }) => {
  const theme = usePreferredColorScheme();

  return (
    <ThemeProvider theme={theme === 'dark' ? dark : light}>
      {children}
    </ThemeProvider>
  );
};
