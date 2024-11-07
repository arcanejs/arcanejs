export { Icon } from './icon';

export const TRANSPARENCY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
  <rect width="10px" height="10px" fill="#333" />
  <rect width="5px" height="5px" fill="#ddd" y="5"/>
  <rect width="5px" height="5px" fill="#ddd" x="5"/>
</svg>
`;

export const TRANSPARENCY_SVG_URI = `data:image/svg+xml,${encodeURIComponent(TRANSPARENCY_SVG)}`;
