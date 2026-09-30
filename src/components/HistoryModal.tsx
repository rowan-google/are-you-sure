import React from 'react';
import type { DecisionRecord } from '../types';
import { getStoredDecisions, deleteDecision, clearAllDecisions } from '../utils/storage';
import { X, Trash2, Calendar, ShieldCheck } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecord?: (record: DecisionRecord) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onSelectRecord }) => {
  const [records, setRecords] = React.useState<DecisionRecord[]>([]);

  const loadData = () => {
    setRecords(getStoredDecisions());
  };

  React.useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    deleteDecision(id);
    loadData();
  };

  const handleClearAll = () => {
    if (window.confirm('确定要清空所有本地决策反思历史记录吗？')) {
      triggerHaptic('warning');
      clearAllDecisions();
      loadData();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[85vh] p-5 sm:p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white font-serif">本地决断足迹</h3>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
              纯本地无上传
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 my-2 pr-1">
          {records.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>暂无决策历史记录</p>
              <p className="mt-1">每次完成“Are you sure”观照，都会在此留下私密印记</p>
            </div>
          ) : (
            records.map((rec) => {
              const dateStr = new Date(rec.timestamp).toLocaleString('zh-CN', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={rec.id}
                  onClick={() => {
                    if (onSelectRecord) {
                      triggerHaptic('selection');
                      onSelectRecord(rec);
                      onClose();
                    }
                  }}
                  className="p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400 font-mono">{dateStr}</span>
                      <span
                        className={`text-[10px] px-2 py-0.2 rounded-full font-medium ${
                          rec.verdict === 'clear'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                            : rec.verdict === 'caution'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                            : 'bg-rose-950 text-rose-300 border border-rose-800/50'
                        }`}
                      >
                        澄澈度 {rec.clarityScore}%
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white truncate">{rec.title}</h4>

                    {rec.topInfluences && rec.topInfluences.length > 0 && (
                      <p className="text-[11px] text-slate-400 truncate mt-1">
                        扰动：{rec.topInfluences.join('、')}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(rec.id, e)}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-950/30 transition-all opacity-80 group-hover:opacity-100"
                    title="删除此记录"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {records.length > 0 && (
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>共 {records.length} 条记录</span>
            <button
              onClick={handleClearAll}
              className="text-rose-400 hover:text-rose-300 transition-colors"
            >
              清空全部
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
