export * from './touch';

// TODO: move this to a new core-frontend library
export const calculateClass = (
  ...args: (string | undefined | null | false)[]
): string => args.filter((a) => !!a).join(' ');
