import React from 'react';
import { Vote, Clock, CheckCircle2, Award, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VotingWidget: React.FC = () => {
  const { votes, castVote, currentUser } = useApp();
  const currentVote = votes[0];

  if (!currentVote) return null;

  const hasVoted = Boolean(currentVote.userVotedOptionId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-right relative overflow-hidden shadow-lg">
      
      {/* Background subtle glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Vote className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-100">
                تصويت المجتمع الـ 10 أيام
              </h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                نشط
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              صوتك يحدد فعاليات البث ومكافآت التحدي القادم
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>متبقي {currentVote.remainingDays} أيام</span>
        </div>
      </div>

      {/* Poll Details */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-slate-200 mb-1">
          {currentVote.title}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          {currentVote.description}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {currentVote.options.map((opt) => {
          const isSelected = currentVote.userVotedOptionId === opt.id;
          const percentage = currentVote.totalVotes > 0
            ? Math.round((opt.votesCount / currentVote.totalVotes) * 100)
            : 0;

          return (
            <button
              key={opt.id}
              disabled={hasVoted}
              onClick={() => castVote(currentVote.id, opt.id)}
              className={`w-full text-right p-3 rounded-xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                  : hasVoted
                  ? 'bg-slate-950/60 border-slate-800 text-slate-300 opacity-90'
                  : 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
            >
              {/* Progress bar fill for results */}
              {hasVoted && (
                <div
                  className={`absolute top-0 right-0 bottom-0 opacity-20 pointer-events-none transition-all duration-700 ${
                    isSelected ? 'bg-amber-400' : 'bg-slate-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              )}

              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                    isSelected
                      ? 'border-amber-400 bg-amber-400 text-slate-950'
                      : 'border-slate-600 bg-slate-800'
                  }`}>
                    {isSelected && '✓'}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">
                    {opt.text}
                  </span>
                </div>

                {hasVoted && (
                  <div className="flex items-center gap-2 text-xs font-mono font-bold">
                    <span className="text-slate-400 text-[11px]">({opt.votesCount} صوت)</span>
                    <span className={isSelected ? 'text-amber-400' : 'text-slate-300'}>
                      %{percentage}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span>إجمالي المصوتين: {currentVote.totalVotes} مشارك</span>
        </div>
        {hasVoted ? (
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تم تسجيل تصويتك بنجاح
          </span>
        ) : (
          <span className="text-amber-400/90 text-[11px]">
            اختر خياراً لتسجيل صوتك مرة واحدة
          </span>
        )}
      </div>

    </div>
  );
};
