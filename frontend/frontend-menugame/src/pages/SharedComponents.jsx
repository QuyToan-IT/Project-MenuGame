import React from 'react';

export function StatCard({ icon: Icon, label, value, accent }) {

  if (!Icon) return null;

  return (
    <div className="flex items-center gap-4 bg-game-card border border-white/[0.06] rounded-xl p-4">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ 
          background: `${accent}18`, 
          border: `1px solid ${accent}33` 
        }}
      >
        <Icon size={18} style={{ color: accent }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
        <p className="text-xs text-game-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const inputCls = (error) => {
  return `w-full bg-white/[0.05] border ${
    error ? 'border-red-500/50' : 'border-white/[0.08]'
  } rounded-lg px-3 py-2 text-sm text-white placeholder:text-game-muted focus:outline-none focus:border-game-neon/60 focus:bg-white/[0.08] transition-all`;
};

export function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-game-muted">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}