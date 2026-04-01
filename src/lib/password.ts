const AMBIGUOUS = /[O0Il1]/g;
const SIMILAR = /[{}\[\]\(\)\/\\'"`~,;:.<>\|]/g;

export type ClassFlags = {
  lower: boolean;
  upper: boolean;
  number: boolean;
  symbol: boolean;
  customSymbols?: string;
  excludeAmbiguous?: boolean;
  excludeSimilar?: boolean;
};

function uniq(str: string) {
  return Array.from(new Set(str.split(''))).join('');
}

export function buildPool(flags: ClassFlags) {
  const sets = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    number: '0123456789',
    symbol: flags.customSymbols?.trim()
      ? flags.customSymbols
      : '!@#$%^&*()-_=+[]{};:,.<>/?',
  };

  let pool = '';
  (['lower', 'upper', 'number', 'symbol'] as const).forEach((k) => {
    if ((flags as any)[k]) pool += sets[k];
  });

  if (flags.excludeAmbiguous) pool = pool.replace(AMBIGUOUS, '');
  if (flags.excludeSimilar) pool = pool.replace(SIMILAR, '');

  return uniq(pool);
}

export function generatePassword(length: number, flags: ClassFlags): string {
  const pool = buildPool(flags);
  if (!pool) throw new Error('No character classes selected');
  let out = '';
  crypto.getRandomValues(new Uint32Array(length)).forEach((n) => {
    out += pool[n % pool.length];
  });
  return out;
}

export function entropyBits(length: number, poolSize: number) {
  return Math.round(length * Math.log2(poolSize));
}

export function strengthLabel(entropy: number) {
  if (entropy < 40) return { score: 0, label: 'Weak' };
  if (entropy < 60) return { score: 1, label: 'Average' };
  if (entropy < 80) return { score: 2, label: 'Strong' };
  return { score: 3, label: 'Excellent' };
}