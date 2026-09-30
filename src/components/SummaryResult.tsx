import React, { useState, useRef, useEffect } from 'react';
import type { FactorItem, InfluenceLevel, DecisionRecord } from '../types';
import { FACTORS, LEVEL_DEFINITIONS } from '../data/emotionsDesires';
import { MandalaWheel } from './MandalaWheel';
import { triggerHaptic } from '../utils/telegram';
import { saveDecision } from '../utils/storage';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Wind,
  Download,
  RotateCcw,
  Check,
  Calendar,
  X,
  Copy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';

interface SummaryResultProps {
  decisionTitle: string;
  assessments: Record<string, InfluenceLevel>;
  onReset: () => void;
  onOpenBreathing: () => void;
  onUpdateAssessment: (factorId: string, level: InfluenceLevel) => void;
}

export const SummaryResult: React.FC<SummaryResultProps> = ({
  decisionTitle,
  assessments,
  onReset,
  onOpenBreathing,
  onUpdateAssessment,
}) => {
  const [selectedFactor, setSelectedFactor] = useState<FactorItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Calculate clarity score
  const { clarityScore, verdict, verdictTitle, verdictDesc, topInfluences } = React.useMemo(() => {
    let penalty = 0;
    const influencedList: { factor: FactorItem; level: InfluenceLevel }[] = [];

    FACTORS.forEach((f) => {
      const level = assessments[f.id] ?? 0;
      penalty += level;
      if (level > 0) {
        influencedList.push({ factor: f, level });
      }
    });

    // Sort by level descending
    influencedList.sort((a, b) => b.level - a.level);

    const maxPenalty = 13 * 3;
    const score = Math.max(0, Math.round(100 - (penalty / maxPenalty) * 100));

    let v: 'clear' | 'caution' | 'danger' = 'clear';
    let title = '心如明镜 · 遵从本心';
    let desc = '你的情绪扰动极低，感官未受明显绑架，此时思维明晰，可遵从初衷果断推进。';

    if (score < 50) {
      v = 'danger';
      title = '迷障深重 · 急流暂止';
      desc = '当前深受强烈情绪或感官欲望支配，主观偏见极高，强烈建议冷静 24 小时后再定夺！';
    } else if (score < 80) {
      v = 'caution';
      title = '微澜暗涌 · 审慎观照';
      desc = '存在若干情绪扰动或感官偏好诱导，建议重点检视被点亮的维度，避开思维陷阱。';
    }

    return {
      clarityScore: score,
      verdict: v,
      verdictTitle: title,
      verdictDesc: desc,
      topInfluences: influencedList,
    };
  }, [assessments]);

  // Trigger celebration confetti on high score
  useEffect(() => {
    if (clarityScore >= 85) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10B981', '#6366F1', '#F59E0B'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [clarityScore]);

  // Save to local storage automatically once
  useEffect(() => {
    const record: DecisionRecord = {
      id: Date.now().toString(),
      title: decisionTitle || '未命名决断',
      timestamp: Date.now(),
      clarityScore,
      verdict,
      verdictText: verdictTitle,
      assessments: Object.fromEntries(
        Object.entries(assessments).map(([k, v]) => [k, { factorId: k, level: v }])
      ),
      topInfluences: topInfluences.map((i) => i.factor.name),
    };
    saveDecision(record);
  }, []);

  // Export card as image
  const handleExportImage = async () => {
    if (!cardRef.current) return;
    triggerHaptic('medium');
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        backgroundColor: '#090d16',
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `AreYouSure_定心卡片_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
      triggerHaptic('success');
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopySummary = () => {
    triggerHaptic('selection');
    const text = `【Are you sure · 定心反思】\n决定事由：“${decisionTitle || '个人决断'}”\n心境澄澈度：${clarityScore}%（${verdictTitle}）\n${
      topInfluences.length > 0
        ? `重点受扰维度：${topInfluences.map((i) => `${i.factor.name}(${i.level}级)`).join('、')}`
        : '七情六欲皆无扰动，心静如水。'
    }\n来自 Telegram Mini App：Are you sure`;

    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Printable / Exportable Card Container */}
      <div
        ref={cardRef}
        className="p-5 sm:p-7 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        {/* Subtle Ambient Glow */}
        <div
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{
            backgroundColor:
              verdict === 'clear' ? '#10B981' : verdict === 'caution' ? '#F59E0B' : '#EF4444',
          }}
        />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-indigo-400 font-semibold font-mono">
              Are you sure · 观心鉴照
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5 tracking-tight font-serif">
              {decisionTitle ? `“${decisionTitle}”` : '本次决策定心总结'}
            </h1>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-mono">
              {new Date().toLocaleDateString('zh-CN')}
            </span>
          </div>
        </div>

        {/* The Visual Mandala Wheel */}
        <div className="my-2 flex flex-col items-center">
          <MandalaWheel
            assessments={assessments}
            activeFactorId={selectedFactor?.id}
            onSelectFactor={(f) => setSelectedFactor(f)}
            size={340}
            interactive={true}
          />
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            点击轮盘上的任意扇区，可查看该卦象详情与醒脑对策
          </p>
        </div>

        {/* Big Verdict Banner */}
        <div
          className={`p-4 rounded-2xl border my-5 transition-all ${
            verdict === 'clear'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : verdict === 'caution'
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            {verdict === 'clear' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : verdict === 'caution' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
            )}
            <h3 className="font-serif font-bold text-base tracking-wide text-white">
              {verdictTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {verdictDesc}
          </p>
        </div>

        {/* Triggered Factors Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-slate-300">
            <span>
              受影响维度检视 ({topInfluences.length} / 13)
            </span>
            {topInfluences.length > 0 && (
              <span className="text-[11px] text-slate-400">按扰乱程度排序</span>
            )}
          </div>

          {topInfluences.length === 0 ? (
            <div className="p-4 rounded-2xl bg-emerald-900/20 border border-emerald-800/40 text-center">
              <Sparkles className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-sm font-semibold text-emerald-300">心境澄明，无任何情欲波澜</p>
              <p className="text-xs text-slate-400 mt-1">
                你没有受到任何七情六欲的盲目驱使，这是做出明智决定的最佳时机。
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {topInfluences.map(({ factor, level }) => {
                const lvlInfo = LEVEL_DEFINITIONS.find((l) => l.level === level);
                return (
                  <div
                    key={factor.id}
                    onClick={() => {
                      triggerHaptic('selection');
                      setSelectedFactor(factor);
                    }}
                    className="p-3 rounded-2xl border transition-all cursor-pointer hover:bg-slate-800/60 active:scale-[0.99] flex flex-col gap-1.5"
                    style={{
                      borderColor: `${factor.color}44`,
                      backgroundColor: `${factor.color}0D`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-serif font-bold text-sm"
                          style={{
                            backgroundColor: `${factor.color}25`,
                            color: factor.color,
                            border: `1px solid ${factor.color}66`,
                          }}
                        >
                          {factor.name}
                        </span>
                        <div>
                          <span className="text-sm font-semibold text-white">
                            {factor.name} · {factor.englishName}
                          </span>
                          <span className="text-[11px] text-slate-400 ml-2">
                            {factor.subTitle}
                          </span>
                        </div>
                      </div>

                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: `${factor.color}33`,
                          color: factor.color,
                        }}
                      >
                        {lvlInfo?.badge}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-950/40 p-2 rounded-xl border border-slate-800/80">
                      <strong className="text-amber-400/90 font-medium">醒脑对策：</strong>
                      {factor.calmAdvice}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail / Quick Adjust Modal for Selected Factor */}
      {selectedFactor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedFactor(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-serif text-2xl font-bold"
                style={{
                  backgroundColor: `${selectedFactor.color}20`,
                  color: selectedFactor.color,
                  border: `1px solid ${selectedFactor.color}66`,
                }}
              >
                {selectedFactor.name}
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  {selectedFactor.name} ({selectedFactor.categoryName}
                  {selectedFactor.sensoryOrgan ? `·${selectedFactor.sensoryOrgan}` : ''})
                </h4>
                <p className="text-xs text-slate-400">{selectedFactor.subTitle}</p>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <p>
                <strong className="text-slate-200">问：</strong>
                {selectedFactor.promptQuestion}
              </p>
              <p>
                <strong className="text-amber-400">解：</strong>
                {selectedFactor.calmAdvice}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">快捷调整受扰程度：</label>
              <div className="grid grid-cols-2 gap-1.5">
                {LEVEL_DEFINITIONS.map((lvl) => {
                  const isCurrent = (assessments[selectedFactor.id] ?? 0) === lvl.level;
                  return (
                    <button
                      key={lvl.level}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        onUpdateAssessment(selectedFactor.id, lvl.level as InfluenceLevel);
                      }}
                      className={`p-2 rounded-xl text-xs text-left border transition-all ${
                        isCurrent
                          ? 'border-indigo-400 bg-indigo-950/50 text-white font-medium'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{lvl.label}</span>
                        {isCurrent && <Check className="w-3 h-3 text-indigo-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedFactor(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
            >
              完成并关闭
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          type="button"
          onClick={onOpenBreathing}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all active:scale-95 shadow-sm"
        >
          <Wind className="w-4 h-4 text-indigo-400" />
          <span>正念呼吸(1分)</span>
        </button>

        <button
          type="button"
          onClick={handleExportImage}
          disabled={isExporting}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95 shadow-sm"
        >
          <Download className="w-4 h-4 text-sky-400" />
          <span>{isExporting ? '生成中...' : '保存定心卡'}</span>
        </button>

        <button
          type="button"
          onClick={handleCopySummary}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95 shadow-sm"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">已复制结论</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-amber-400" />
              <span>复制总结文本</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('medium');
            onReset();
          }}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95 shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <span>新的一次决断</span>
        </button>
      </div>

      {/* Mindful 24-Hour Rule Tip */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-3">
        <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">💡 心理学“24小时法则”：</strong>
          任何超过 ¥500 的冲动消费，或涉及人际摊牌、辞职跳槽、情感表白的重大决断，只要不是火灾地震等生命危险，延后
          24 小时执行。如果明天的你依然坚定，那便坚定前行；如果明天的你犹豫了，说明昨天救了你一次。
        </p>
      </div>
    </div>
  );
};
