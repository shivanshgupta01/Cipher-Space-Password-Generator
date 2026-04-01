import { useEffect, useMemo, useState } from 'react';
import { useGenerator } from './store/useGenerator';
import { buildPool, entropyBits, generatePassword, strengthLabel } from './lib/password';

// Sleek, high-contrast strength colors
const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500']; 
type Toast = { id: number; message: string };

export default function App() {
  const {
    config, setConfig, password, strength, setPassword,
    savedPasswords, savePassword, deleteSaved, clearSaved,
  } = useGenerator();

  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<'generate' | 'saved'>('generate');
  
  // Custom Dialog State
  const [dialog, setDialog] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);

  const pool = useMemo(() => buildPool(config), [config]);
  const poolSize = pool.length;

  const pushToast = (message: string, ttl = 2000) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  };

  const onGenerate = () => {
    if (!poolSize) return;
    const pwd = generatePassword(config.length, config);
    const entropy = entropyBits(config.length, poolSize);
    const label = strengthLabel(entropy);
    setPassword(pwd, { ...label, entropy });
    setCopied(false);
    pushToast('Password generated successfully');
  };

  const onCopy = async (val?: string) => {
    const text = val ?? password;
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    pushToast('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if a dialog is open
      if (dialog) {
        if (e.key === 'Escape') setDialog(null);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        onCopy();
      }
      if (e.key === 'Enter') onGenerate();
      if (e.key === 'Escape') {
        setPassword('', null);
        pushToast('Buffer cleared');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [password, poolSize, dialog]);

  const bars = strength ? strength.score + 1 : 0;

  const clearCustomSymbols = () => setConfig({ customSymbols: '' });
  const toggleClass = (key: keyof typeof config) =>
    setConfig({ [key]: !(config as any)[key] } as any);

  const saveCurrentPassword = () => {
    if (!password || !strength) {
      pushToast('Generate a password first');
      return;
    }
    savePassword({ value: password, entropy: strength.entropy, label: strength.label });
    pushToast('Saved to Vault');
    setView('saved');
  };

  return (
    <div className="app-shell pb-24">
      
      {/* Precision Toasts */}
      <div className="fixed bottom-6 right-6 space-y-3 z-50 flex flex-col items-end" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="surface flex items-center gap-3 px-4 py-3 text-sm font-medium text-white shadow-2xl animate-fade-in-up">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            {t.message}
          </div>
        ))}
      </div>

      {/* Custom Pro Dialog Modal */}
      {dialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="surface w-full max-w-sm p-6 shadow-2xl border border-white/10 scale-100 transition-transform">
            <h3 className="text-lg font-semibold text-white mb-2">{dialog.title}</h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">{dialog.message}</p>
            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setDialog(null)}
                className="btn-secondary px-5 py-2 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dialog.onConfirm();
                  setDialog(null);
                }}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_14px_rgba(244,63,94,0.4)] transition-all active:scale-95"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 space-y-8">
        
        {/* Pro Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">CipherSpace</h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide">PASSWORD GENERATOR</p>
            </div>
          </div>

          {/* iOS Style Segmented Control */}
          <div className="flex p-1 rounded-lg bg-white/5 border border-white/5">
            {[
              { key: 'generate', label: 'Generator' },
              { key: 'saved', label: 'Vault' },
            ].map((tab) => (
               <button
                 key={tab.key}
                 onClick={() => setView(tab.key as any)}
                 className={`px-6 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                   view === tab.key
                     ? 'bg-white/10 text-white shadow-sm'
                     : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                 }`}
               >
                 {tab.label}
               </button>
            ))}
          </div>
        </header>

        {view === 'generate' ? (
          <div className="space-y-6">
            
            {/* HERO: The Output is now prominently at the top */}
            <div className="surface p-6 md:p-8 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden group">
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => setShowPassword((s) => !s)} className="btn-secondary rounded-md px-3 py-1.5 text-xs font-medium">
                  {showPassword ? 'Hide' : 'Reveal'}
                </button>
                <button onClick={() => onCopy()} disabled={!password} className="btn-secondary rounded-md px-3 py-1.5 text-xs font-medium disabled:opacity-50">
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="text-center w-full mt-4">
                <div 
                  className={`font-mono text-3xl md:text-5xl tracking-tight break-all transition-all duration-300 ${password ? 'text-white' : 'text-gray-600'}`}
                  style={{ textShadow: password ? '0 0 20px rgba(255,255,255,0.2)' : 'none' }}
                >
                  {password ? (showPassword ? password : '•'.repeat(password.length)) : 'Generate...'}
                </div>
              </div>

              {/* Pro Strength Bar */}
              <div className="w-full max-w-md mx-auto mt-8 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-gray-500 uppercase tracking-widest">Strength</span>
                  <span className={strength ? 'text-white' : 'text-gray-600'}>{strength?.label ?? 'None'}</span>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                        i < bars ? strengthColors[bars - 1] : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button disabled={poolSize === 0} onClick={onGenerate} className="flex-1 btn-pro rounded-xl py-4 text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
                Generate Password
              </button>
              <button onClick={saveCurrentPassword} disabled={!password} className="sm:w-1/3 btn-secondary rounded-xl py-4 text-sm font-semibold flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                Save to Vault
              </button>
            </div>

            {/* Settings Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Length & Metrics */}
              <div className="surface p-6 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Parameters</h3>
                  <div className="flex gap-4 text-xs font-medium">
                    <span className="text-gray-500">Entropy: <span className="text-indigo-400">{strength?.entropy ?? 0}</span></span>
                    <span className="text-gray-500">Pool: <span className="text-indigo-400">{poolSize}</span></span>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Length</span>
                    <input
                      type="number" min={4} max={64}
                      value={config.length}
                      onChange={(e) => setConfig({ length: Math.max(4, Math.min(64, Number(e.target.value))) })}
                      className="surface-sunken w-16 px-2 py-1 text-center text-sm font-mono text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                  <input
                    type="range" min={4} max={64} value={config.length}
                    onChange={(e) => setConfig({ length: Number(e.target.value) })}
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 font-medium">
                    <span>MIN 4</span><span>MAX 64</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Custom String</span>
                    {config.customSymbols && (
                      <button onClick={clearCustomSymbols} className="text-[10px] text-rose-500 hover:text-rose-400 uppercase font-bold">Clear</button>
                    )}
                  </div>
                  <textarea
                    value={config.customSymbols}
                    onChange={(e) => setConfig({ customSymbols: e.target.value })}
                    placeholder="e.g. !@#$%"
                    rows={1}
                    className="surface-sunken w-full px-3 py-2.5 text-sm font-mono text-white focus:border-indigo-500 outline-none resize-none transition-colors"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="surface p-6 space-y-6">
                <h3 className="text-sm font-semibold text-white mb-2">Character Sets</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {([['lower', 'a-z'], ['upper', 'A-Z'], ['number', '0-9'], ['symbol', '!@#']] as const).map(([key, label]) => (
                    <button
                      key={key} onClick={() => toggleClass(key)}
                      className={`flex flex-col items-start p-3 rounded-lg border transition-all ${
                        (config as any)[key] ? 'bg-indigo-500/10 border-indigo-500/30 text-white' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-xs font-semibold uppercase">{key}</span>
                      <span className={`text-lg font-mono mt-1 ${ (config as any)[key] ? 'text-indigo-400' : 'text-gray-600'}`}>{label}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <button onClick={() => setConfig({ excludeAmbiguous: !config.excludeAmbiguous })} className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-transparent">
                    <span className="text-sm text-gray-300">Exclude Ambiguous <span className="text-gray-600 ml-1 font-mono text-xs">(0,O,l,1)</span></span>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${config.excludeAmbiguous ? 'bg-indigo-500' : 'bg-gray-700'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${config.excludeAmbiguous ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </button>

                  <button onClick={() => setConfig({ excludeSimilar: !config.excludeSimilar })} className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-transparent">
                    <span className="text-sm text-gray-300">Exclude Similar <span className="text-gray-600 ml-1 font-mono text-xs">{"{}[]()"}</span></span>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${config.excludeSimilar ? 'bg-indigo-500' : 'bg-gray-700'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${config.excludeSimilar ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </button>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Vault View */
          <div className="surface p-6 md:p-8 min-h-[400px]">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <div>
                <h2 className="text-lg font-semibold text-white">Secure Vault</h2>
                <p className="text-xs text-gray-500 mt-1">Passwords are stored locally in your browser.</p>
              </div>
              {savedPasswords.length > 0 && (
                <button 
                  onClick={() => {
                    setDialog({
                      title: 'Purge Vault',
                      message: 'Are you sure you want to delete ALL saved passwords? This action cannot be undone.',
                      onConfirm: () => {
                        clearSaved();
                        pushToast('Vault purged successfully');
                      }
                    });
                  }} 
                  className="btn-secondary px-3 py-1.5 rounded-md text-xs font-semibold text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30"
                >
                  Purge Vault
                </button>
              )}
            </div>

            {savedPasswords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <p className="text-sm font-medium text-gray-400">Vault is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedPasswords.map((item) => (
                  <div key={item.id} className="surface-sunken p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-indigo-500/30 transition-colors">
                    <div className="space-y-1.5">
                      <div className="font-mono text-base text-white tracking-tight break-all">
                        {item.value}
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        <span className="text-indigo-400">{item.label}</span>
                        <span>•</span>
                        <span>{item.entropy} bits</span>
                        <span>•</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex w-full sm:w-auto gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onCopy(item.value)} className="flex-1 sm:flex-none btn-secondary px-3 py-1.5 rounded-md text-xs font-medium">Copy</button>
                      <button 
                        onClick={() => {
                          setDialog({
                            title: 'Delete Password',
                            message: 'Are you sure you want to permanently delete this password?',
                            onConfirm: () => {
                              deleteSaved(item.id);
                              pushToast('Password deleted');
                            }
                          });
                        }} 
                        className="flex-1 sm:flex-none btn-secondary px-3 py-1.5 rounded-md text-xs font-medium text-rose-400 hover:border-rose-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pro Footer */}
        <div className="text-center pt-8 flex items-center justify-center gap-4 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1.5"><kbd className="font-sans px-1.5 py-0.5 rounded border border-white/10 bg-white/5">Enter</kbd> Generate</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span className="flex items-center gap-1.5"><kbd className="font-sans px-1.5 py-0.5 rounded border border-white/10 bg-white/5">Ctrl + C</kbd> Copy</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span className="flex items-center gap-1.5"><kbd className="font-sans px-1.5 py-0.5 rounded border border-white/10 bg-white/5">Esc</kbd> Clear</span>
        </div>

      </div>
    </div>
  );
}