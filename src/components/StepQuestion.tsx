import React from 'react';
import type { FactorItem, InfluenceLevel } from '../types';
import { LEVEL_DEFINITIONS } from '../data/emotionsDesires';
import { triggerHaptic } from '../utils/telegram';
import { ChevronLeft, ChevronRight, HelpCircle, Check, Sparkles } from 'lucide-react';

interface StepQuestionProps {
  factor: FactorItem;
  currentIndex: number;
  totalCount: number;
  currentLevel: InfluenceLevel;
  onSelectLevel: (level: InfluenceLevel) => void;
  onNext: () => void;
  onPrev: () => void;
  onSkipAllRemaining?: () => void;
  decisionTitle: string;
}

export const StepQuestion: React.FC<StepQuestionProps> = ({
  factor,
  currentIndex,
  totalCount,
  currentLevel,
  onSelectLevel,
  onNext,
  onPrev,
  onSkipAllRemaining,
  decisionTitle,
}) => {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalCount - 1;
  const progressPercent = Math.round(((currentIndex + 1) / totalCount) * 100);

  const handleLevelClick = (level: InfluenceLevel) => {
    triggerHaptic(level === 0 ? 'light' : level === 1 ? 'medium' : 'heavy');
    onSelectLevel(level);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between min-h-[580px] p-4 sm:p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Dynamic atmospheric color glow in background */}
      <div
        className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: factor.color }}
      />

      {/* Top Header: Progress & Category Tag */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full font-medium text-[11px] border"
              style={{
                borderColor: `${factor.color}66`,
                backgroundColor: `${factor.color}15`,
                color: factor.color,
              }}
            >
              {factor.categoryName} {factor.sensoryOrgan ? `· ${factor.sensoryOrgan}（${factor.sensoryLabel}）` : ''}
            </span>
            {decisionTitle && (
              <span className="truncate max-w-[150px] text-slate-400 italic">
                “{decisionTitle}”
              </span>
            )}
          </div>
          <span className="font-mono text-slate-400">
            {currentIndex + 1} / {totalCount}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: factor.color,
            }}
          />
        </div>

        {/* Main Title & Character */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-serif text-3xl font-bold shadow-lg shrink-0 transition-transform active:scale-95"
            style={{
              backgroundColor: `${factor.color}20`,
              color: factor.color,
              border: `1.5px solid ${factor.color}88`,
              boxShadow: `0 0 20px ${factor.color}33`,
            }}
          >
            {factor.name}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-white tracking-wide">
                {factor.name}
              </h2>
              <span className="text-xs text-slate-400 font-sans tracking-normal">
                {factor.englishName}
              </span>
            </div>
            {/* 小字标注详细内容 */}
            <p className="text-xs text-amber-300/90 mt-1 font-medium bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md inline-block">
              包含：{factor.subTitle}
            </p>
          </div>
        </div>

        {/* Prompt Question */}
        <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 mb-5">
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
            {factor.promptQuestion}
          </p>
        </div>

        {/* Thought / Bias Warning */}
        <div className="flex items-start gap-2 text-xs text-slate-400 mb-6 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
          <HelpCircle className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
          <span className="leading-tight">
            <strong className="text-slate-300">观照提示：</strong>
            {factor.cognitiveTrap}
          </span>
        </div>
      </div>

      {/* Influence Level Selection */}
      <div className="space-y-2.5 my-2">
        <label className="block text-xs font-medium text-slate-400 px-1">
          你当前受其影响的程度：
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LEVEL_DEFINITIONS.map((lvl) => {
            const isSelected = currentLevel === lvl.level;
            return (
              <button
                key={lvl.level}
                type="button"
                onClick={() => handleLevelClick(lvl.level as InfluenceLevel)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all duration-200 active:scale-[0.98] ${
                  isSelected
                    ? 'border-white/80 bg-white/10 shadow-lg text-white font-medium'
                    : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-slate-300 hover:border-slate-700'
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: factor.color,
                        backgroundColor: `${factor.color}20`,
                        boxShadow: `0 0 15px ${factor.color}33`,
                      }
                    : undefined
                }
              >
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <span>{lvl.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {lvl.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {lvl.desc}
                  </p>
                </div>
                {isSelected && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: factor.color }}
                  >
                    <Check className="w-3 h-3 text-slate-950 font-bold" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
            isFirst
              ? 'opacity-30 cursor-not-allowed text-slate-500'
              : 'text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>上一项</span>
        </button>

        {onSkipAllRemaining && !isLast && (
          <button
            type="button"
            onClick={onSkipAllRemaining}
            className="text-[11px] text-slate-400 hover:text-slate-300 underline underline-offset-4"
          >
            余项皆无影响
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            triggerHaptic('medium');
            onNext();
          }}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-medium text-sm text-slate-950 transition-all duration-200 active:scale-95 shadow-md font-sans"
          style={{
            backgroundColor: factor.color,
            boxShadow: `0 4px 14px ${factor.color}55`,
          }}
        >
          <span>{isLast ? '查看定心总结' : '下一项'}</span>
          {isLast ? <Sparkles className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
