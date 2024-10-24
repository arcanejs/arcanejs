import { createGlobalStyle } from 'styled-components';
import { FONTS } from '../shared/static';

export const MaterialFontStyle = createGlobalStyle`
@font-face {
  font-family: 'Material Symbols Outlined';
  font-style: normal;
  src: url(${FONTS.materialSymbolsOutlined}) format('woff');
}
`;
