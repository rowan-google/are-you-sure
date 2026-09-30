import React from 'react';
import { History, Wind, Info, Compass } from 'lucide-react';
import { triggerHaptic, isTelegramWebApp, getTelegramUser } from '../utils/telegram';

interface NavbarProps {
  onOpenHistory: () => void;
  onOpenBreathing: () => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  onOpenBreathing,
  onOpenAbout,
}) => {
  const tgUser = getTelegramUser();
  const inTg = isTelegramWebApp();

  return (
    <header className="w-full max-w-xl mx-auto px-4 py-3 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-500 p-[1px] flex items-center justify-center shadow-lg">
          <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
            <Compass className="w-4 h-4 text-indigo-400 animate-spin-slow" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-bold text-sm text-white tracking-wide">
              Are you sure
            </span>
            <span className="text-[10px] text-amber-400 font-serif px-1.5 py-0.2 bg-amber-500/10 border border-amber-500/20 rounded">
              定心
            </span>
          </div>
          {inTg && tgUser && (
            <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
              Hi, {tgUser.first_name}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onOpenBreathing();
          }}
          className="p-2 text-slate-400 hover:text-indigo-400 rounded-xl hover:bg-slate-800/60 active:scale-95 transition-all"
          title="正念呼吸"
        >
          <Wind className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onOpenHistory();
          }}
          className="p-2 text-slate-400 hover:text-amber-400 rounded-xl hover:bg-slate-800/60 active:scale-95 transition-all"
          title="决断历史"
        >
          <History className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            onOpenAbout();
          }}
          className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800/60 active:scale-95 transition-all"
          title="关于本App"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
