import React from 'react';
import { X, ShieldCheck, Sparkles } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md max-h-[85vh] p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-y-auto space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pt-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-serif">Are you sure · 定心</h3>
          <p className="text-xs text-slate-400 mt-0.5">纯本地运行的东方哲学决策助手</p>
        </div>

        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <h4 className="font-semibold text-amber-300 mb-1">七情与六欲</h4>
            <p className="text-slate-400">
              古人云：人之动摇，非理之不及，实情欲乱之。
              <br />
              <strong>七情：</strong>喜、怒、哀、惧、爱、恶、欲。
              <br />
              <strong>六欲：</strong>见欲（眼）、听欲（耳）、香欲（鼻）、味欲（舌）、触欲（身）、意欲（意）。
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <h4 className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% 纯本地隐私安全
            </h4>
            <p className="text-slate-400">
              本应用没有任何后端数据库，不收集任何用户隐私。所有决策思考、反思记录完全保存在你手机或本地浏览器的
              LocalStorage 中，离线可用，绝不外泄。
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <h4 className="font-semibold text-sky-300 mb-1">Telegram Mini App 与 GitHub Pages 部署</h4>
            <p className="text-slate-400">
              本应用专为 GitHub Pages 与 Telegram Mini App 设计：
              <br />
              1. 部署到 GitHub Pages 仓库后，即可获得 HTTPS 静态链接。
              <br />
              2. 在 Telegram @BotFather 中创建 Mini App，填入该链接即可在 Telegram 内直接拉起！
            </p>
          </div>
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-500">
          心如明镜台 · 观照得自在
        </div>
      </div>
    </div>
  );
};
