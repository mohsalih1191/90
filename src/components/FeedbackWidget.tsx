import React, { useState } from 'react';
import { MessageSquarePlus, Star, X, Check, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FeedbackSubmission } from '../types';

export const FeedbackWidget: React.FC = () => {
  const { submitFeedback } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<FeedbackSubmission['category']>('general');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(rating, comment, category);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsOpen(false);
      setComment('');
    }, 1800);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          id="btn-feedback-floating"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/25 transition-transform hover:scale-105"
          title="تقييم التجربة وملاحظاتك"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span className="hidden sm:inline">شاركنا رأيك</span>
          <span className="flex items-center gap-0.5 text-slate-900 bg-amber-400/80 px-1.5 py-0.2 rounded-full text-[10px]">
            <Star className="w-3 h-3 fill-slate-900" />
            تقييم
          </span>
        </button>
      )}

      {/* Floating Panel / Drawer */}
      {isOpen && (
        <div className="w-80 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-right animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-slate-200">تقييم التجربة والبث</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="py-6 text-center text-emerald-400 space-y-2">
              <Check className="w-8 h-8 mx-auto stroke-[2.5]" />
              <div className="text-xs font-bold">شكراً لتقييمك وملاحظتك القيمة!</div>
              <p className="text-[11px] text-slate-400">نعمل باستمرار على تطوير دوري المجتمع</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Star rating */}
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        s <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600 hover:text-slate-400'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Category tags */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {[
                  { id: 'stream', label: 'بث تيك توك' },
                  { id: 'challenge', label: 'تحدي 90X' },
                  { id: 'moderation', label: 'الإشراف' },
                  { id: 'general', label: 'عام' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id as FeedbackSubmission['category'])}
                    className={`text-[11px] px-2 py-1 rounded-lg border transition-colors ${
                      category === c.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Comment text area */}
              <textarea
                rows={2}
                placeholder="اكتب ملاحظتك أو فكرة تحفيزية..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
              ></textarea>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال الملاحظة</span>
              </button>
            </form>
          )}

        </div>
      )}

    </div>
  );
};
