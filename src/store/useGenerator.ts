import { create } from 'zustand';

export type Config = {
  length: number;
  lower: boolean;
  upper: boolean;
  number: boolean;
  symbol: boolean;
  customSymbols?: string;
  excludeAmbiguous: boolean;
  excludeSimilar: boolean;
};

type Preset = { id: string; name: string; config: Config };

type SavedPassword = {
  id: string;
  value: string;
  entropy: number;
  label: string;
  createdAt: number;
};

type State = {
  config: Config;
  password: string;
  strength: { score: number; label: string; entropy: number } | null;
  presets: Preset[];
  savedPasswords: SavedPassword[];
  setConfig: (partial: Partial<Config>) => void;
  setPassword: (pwd: string, strength: State['strength']) => void;
  addPreset: (preset: Omit<Preset, 'id'>) => void;
  deletePreset: (id: string) => void;
  renamePreset: (id: string, name: string) => void;
  applyPreset: (id: string) => void;
  savePassword: (entry: Omit<SavedPassword, 'id' | 'createdAt'>) => void;
  deleteSaved: (id: string) => void;
  clearSaved: () => void;
};

const PRESET_KEY = 'pwdgen:v1';
const SAVED_KEY = 'pwdgen:saved:v1';

const loadPresets = (): Preset[] => {
  try {
    const raw = localStorage.getItem(PRESET_KEY);
    return raw ? (JSON.parse(raw) as Preset[]) : [];
  } catch {
    return [];
  }
};

const loadSaved = (): SavedPassword[] => {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as SavedPassword[]) : [];
  } catch {
    return [];
  }
};

const savePresets = (presets: Preset[]) => {
  try {
    localStorage.setItem(PRESET_KEY, JSON.stringify(presets));
  } catch {}
};

const saveSaved = (items: SavedPassword[]) => {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(items));
  } catch {}
};

export const useGenerator = create<State>((set, get) => ({
  config: {
    length: 16,
    lower: true,
    upper: true,
    number: true,
    symbol: true,
    customSymbols: '',
    excludeAmbiguous: false,
    excludeSimilar: false,
  },
  password: '',
  strength: null,
  presets: loadPresets(),
  savedPasswords: loadSaved(),

  setConfig: (partial) => set((s) => ({ config: { ...s.config, ...partial } })),
  setPassword: (pwd, strength) => set(() => ({ password: pwd, strength })),

  addPreset: ({ name, config }) =>
    set((s) => {
      const next = [...s.presets, { id: crypto.randomUUID(), name, config }];
      savePresets(next);
      return { presets: next };
    }),
  deletePreset: (id) =>
    set((s) => {
      const next = s.presets.filter((p) => p.id !== id);
      savePresets(next);
      return { presets: next };
    }),
  renamePreset: (id, name) =>
    set((s) => {
      const next = s.presets.map((p) => (p.id === id ? { ...p, name } : p));
      savePresets(next);
      return { presets: next };
    }),
  applyPreset: (id) => {
    const preset = get().presets.find((p) => p.id === id);
    if (preset) set({ config: preset.config });
  },

  savePassword: ({ value, entropy, label }) =>
    set((s) => {
      const next = [
        { id: crypto.randomUUID(), value, entropy, label, createdAt: Date.now() },
        ...s.savedPasswords,
      ].slice(0, 50); // keep last 50
      saveSaved(next);
      return { savedPasswords: next };
    }),
  deleteSaved: (id) =>
    set((s) => {
      const next = s.savedPasswords.filter((p) => p.id !== id);
      saveSaved(next);
      return { savedPasswords: next };
    }),
  clearSaved: () => {
    saveSaved([]);
    set({ savedPasswords: [] });
  },
}));