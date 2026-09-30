import { useState, useEffect } from 'react';
import type { InfluenceLevel, DecisionRecord } from './types';
import { FACTORS } from './data/emotionsDesires';
import { MandalaWheel } from './components/MandalaWheel';
import { StepQuestion } from './components/StepQuestion';
import { SummaryResult } from './components/SummaryResult';
import { Navbar } from './components/Navbar';
import { BreathingModal } from './components/BreathingModal';
import { HistoryModal } from './components/HistoryModal';
import { AboutModal } from './components/AboutModal';
import { initTelegramApp, triggerHaptic } from './utils/telegram';
import { Sparkles, ArrowRight } from 'lucide-react';

const PRESET_TOPICS = [
  '🛍️ 要不要冲动消费买下某物',
  '💔 要不要向TA发火摊牌',
  '💼 要不要冲动提辞职',
  '📈 要不要跟风加仓投资',
  '🍕 深夜要不要点高热量宵夜',
  '🛋️ 累了要不要直接放弃拖延',
];

export function App() {
  const [mode, setMode] = useState<'intro' | 'questioning' | 'summary'>('intro');
  const [decisionTitle, setDecisionTitle] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize assessments with 0 (no disturbance)
  const [assessments, setAssessments] = useState<Record<string, InfluenceLevel>>(() => {
    const initial: Record<string, InfluenceLevel> = {};
    FACTORS.forEach((f) => {
      initial[f.id] = 0;
    });
    return initial;
  });

  // Modals
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Telegram App Initialization
  useEffect(() => {
    initTelegramApp();
  }, []);

  // Telegram native BackButton synchronization
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.BackButton) return;

    if (mode === 'questioning') {
      tg.BackButton.show();
      const handleBack = () => {
        if (currentIndex > 0) {
          setCurrentIndex((i) => i - 1);
        } else {
          setMode('intro');
        }
      };
      tg.BackButton.onClick(handleBack);
      return () => {
        tg.BackButton?.offClick(handleBack);
      };
    } else if (mode === 'summary') {
      tg.BackButton.show();
      const handleBack = () => {
        setMode('intro');
      };
      tg.BackButton.onClick(handleBack);
      return () => {
        tg.BackButton?.offClick(handleBack);
      };
    } else {
      tg.BackButton.hide();
    }
  }, [mode, currentIndex]);

  const handleStart = () => {
    triggerHaptic('medium');
    setCurrentIndex(0);
    setMode('questioning');
  };

  const handleSelectLevel = (level: InfluenceLevel) => {
    const currentFactor = FACTORS[currentIndex];
    setAssessments((prev) => ({
      ...prev,
      [currentFactor.id]: level,
    }));
  };

  const handleNext = () => {
    if (currentIndex < FACTORS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setMode('summary');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      setMode('intro');
    }
  };

  const handleSkipAllRemaining = () => {
    triggerHaptic('light');
    setMode('summary');
  };

  const handleReset = () => {
    const fresh: Record<string, InfluenceLevel> = {};
    FACTORS.forEach((f) => {
      fresh[f.id] = 0;
    });
    setAssessments(fresh);
    setDecisionTitle('');
    setCurrentIndex(0);
    setMode('intro');
  };

  const handleUpdateAssessment = (factorId: string, level: InfluenceLevel) => {
    setAssessments((prev) => ({
      ...prev,
      [factorId]: level,
    }));
  };

  const handleLoadFromHistory = (record: DecisionRecord) => {
    setDecisionTitle(record.title);
    const loaded: Record<string, InfluenceLevel> = {};
    FACTORS.forEach((f) => {
      loaded[f.id] = (record.assessments[f.id]?.level ?? 0) as InfluenceLevel;
    });
    setAssessments(loaded);
    setMode('summary');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenBreathing={() => setIsBreathingOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-6 flex flex-col justify-center">
        {mode === 'intro' && (
          <div className="space-y-6 animate-fade-in text-center">
            {/* Tagline & Headline */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>东方七情六欲心境镜像</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
                Are you sure?
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                人在起心动念做决定时，往往被喜、怒、哀、惧、爱、恶、欲与眼耳鼻舌身意所遮蔽。停顿片刻，观照你的心境波澜。
              </p>
            </div>

            {/* Decision Input Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl text-left backdrop-blur-xl">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                你此刻正面临什么决定？（可选填）
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={decisionTitle}
                  onChange={(e) => setDecisionTitle(e.target.value)}
                  placeholder="例如：要不要立刻买下新电脑 / 要不要向TA摊牌..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  maxLength={60}
                />
              </div>

              {/* Quick tags */}
              <div className="mt-3">
                <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">
                  快捷预设决策情境：
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_TOPICS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setDecisionTitle(tag.replace(/^[^\s]+\s/, ''));
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 active:scale-95 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mandala Wheel Preview */}
            <div className="py-2 flex flex-col items-center">
              <MandalaWheel
                assessments={assessments}
                size={300}
                interactive={true}
                onSelectFactor={(f) => {
                  const idx = FACTORS.findIndex((x) => x.id === f.id);
                  if (idx !== -1) {
                    setCurrentIndex(idx);
                    setMode('questioning');
                  }
                }}
              />
              <span className="text-[11px] text-slate-500 mt-2">
                13 卦象心境轮盘 · 点击任意卦象可直接检视
              </span>
            </div>

            {/* Start Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStart}
                className="w-full max-w-sm mx-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-amber-500 hover:from-indigo-600 hover:to-amber-600 text-slate-950 font-bold text-base shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 font-sans"
              >
                <span>开始逐问观照（13问）</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>
            </div>
          </div>
        )}

        {mode === 'questioning' && (
          <StepQuestion
            factor={FACTORS[currentIndex]}
            currentIndex={currentIndex}
            totalCount={FACTORS.length}
            currentLevel={assessments[FACTORS[currentIndex].id] ?? 0}
            onSelectLevel={handleSelectLevel}
            onNext={handleNext}
            onPrev={handlePrev}
            onSkipAllRemaining={handleSkipAllRemaining}
            decisionTitle={decisionTitle}
          />
        )}

        {mode === 'summary' && (
          <SummaryResult
            decisionTitle={decisionTitle}
            assessments={assessments}
            onReset={handleReset}
            onOpenBreathing={() => setIsBreathingOpen(true)}
            onUpdateAssessment={handleUpdateAssessment}
          />
        )}
      </main>

      {/* Modals */}
      <BreathingModal isOpen={isBreathingOpen} onClose={() => setIsBreathingOpen(false)} />
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectRecord={handleLoadFromHistory}
      />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}

export default App;
