export const status = { open: 'open', closed: 'closed' } as const;
export type statusType = typeof status[keyof typeof status];

export const getRandomNumber = (from: number, to: number) => {
  if (from > to) throw 'From cant be smaller than to';
  return Math.floor(Math.random() * (to - from + 1) + from);
};
