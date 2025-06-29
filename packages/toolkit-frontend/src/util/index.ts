import { useEffect, useState } from 'react';

export * from './touch';

// TODO: move this to a new core-frontend library
export const calculateClass = (
  ...args: (string | undefined | null | false)[]
): string => args.filter((a) => !!a).join(' ');

export const usePreferredColorScheme = (): 'dark' | 'light' => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setTheme(mediaQuery.matches ? 'dark' : 'light');

      const handleChange = (event: MediaQueryListEvent) => {
        setTheme(event.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);

  return theme;
};
