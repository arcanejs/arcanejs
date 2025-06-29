import 'styled-components';
import type { Theme } from '@arcanejs/toolkit-frontend/styling';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
