import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, Wind } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BreathingModal: React.FC<BreathingModalProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'吸气' | '屏息' | '呼气' | '静心'>('吸气');
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [cycleTime, setCycleTime] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      setSecondsLeft(60);
      setPhase('吸气');
      setCycleTime(0);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
        setCycleTime((c) => {
          const next = (c + 1) % 16;
          // 4s inhale, 4s hold, 4s exhale, 4s calm
          if (next < 4) {
            setPhase('吸气');
          } else if (next < 8) {
            setPhase('屏息');
          } else if (next < 12) {
            setPhase('呼气');
          } else {
            setPhase('静心');
          }
          return next;
        });
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      triggerHaptic('success');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  if (!isOpen) return null;

  // Animation scale based on cycle
  const circleScale =
    phase === '吸气'
      ? 1 + (cycleTime % 4) * 0.1
      : phase === '屏息'
      ? 1.35
      : phase === '呼气'
      ? 1.35 - (cycleTime % 4) * 0.08
      : 1.05;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col items-center text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-indigo-400 mb-2">
          <Wind className="w-5 h-5" />
          <h3 className="text-base font-semibold">1分钟定心正念呼吸</h3>
        </div>

        <p className="text-xs text-slate-400 mb-8 max-w-xs">
          放慢心跳，让前额叶皮层接管冲动的杏仁核。4秒吸气，4秒屏息，4秒深呼。
        </p>

        {/* Breathing animated circle */}
        <div className="relative w-48 h-48 flex items-center justify-center my-4">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-teal-400/20 blur-xl transition-transform duration-1000 ease-in-out"
            style={{ transform: `scale(${circleScale * 1.2})` }}
          />
          <div
            className="w-36 h-36 rounded-full border-2 border-indigo-400/50 flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out shadow-[0_0_30px_rgba(99,102,241,0.3)] bg-slate-950/60"
            style={{ transform: `scale(${circleScale})` }}
          >
            <span className="text-2xl font-serif font-bold text-white tracking-widest mb-1">
              {phase}
            </span>
            <span className="text-xs font-mono text-indigo-300">
              {isActive ? `${secondsLeft}s` : '准备'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              setIsActive(!isActive);
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg active:scale-95"
          >
            <Play className={`w-4 h-4 ${isActive ? 'rotate-90' : ''}`} />
            <span>{isActive ? '暂停' : '开始正念呼吸'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setIsActive(false);
              setSecondsLeft(60);
              setPhase('吸气');
              setCycleTime(0);
            }}
            className="p-2.5 rounded-full bg-slate-800 text-slate-300 hover:text-white active:scale-95"
            title="重置"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
