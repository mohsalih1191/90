import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Shield, Sparkles, Flame, ThumbsUp, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LiveChatWidget: React.FC = () => {
  const { chatMessages, sendChatMessage, currentUser, currentRole } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  const handleQuickCheer = (emoji: string) => {
    sendChatMessage(`${emoji} تشجيع حار لفريق ${currentUser.teamName}! استمروا يا أبطال!`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[400px] text-right overflow-hidden shadow-lg">
      
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200">
                منتدى وبث المجتمع المباشر
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <p className="text-[10px] text-slate-400">
              تفاعل الفرق وتشجيع الالتزام اليومي
            </p>
          </div>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          {chatMessages.length} رسالة
        </span>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {chatMessages.map((msg) => {
          const isCurrentUser = msg.senderName === currentUser.name;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5 px-1">
                {msg.teamBadge && <span>{msg.teamBadge}</span>}
                <span className="font-semibold text-slate-300">{msg.senderName}</span>
                {msg.isModeratorNote && (
                  <span className="px-1 py-0.2 rounded bg-blue-500/20 text-blue-400 text-[9px] font-bold border border-blue-500/30 flex items-center gap-0.5">
                    <Shield className="w-2.5 h-2.5" />
                    مشرف
                  </span>
                )}
                <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  msg.isModeratorNote
                    ? 'bg-blue-950/70 border border-blue-800/80 text-blue-100 shadow-sm'
                    : isCurrentUser
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-100 rounded-tr-sm'
                    : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Cheer reactions */}
      <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-around gap-1">
        <button
          onClick={() => handleQuickCheer('🔥')}
          className="text-xs px-2 py-1 rounded-lg hover:bg-slate-800 flex items-center gap-1 text-slate-300"
          title="تشجيع ناري"
        >
          <span>🔥</span>
          <span className="text-[10px] hidden sm:inline">نار التحدي</span>
        </button>
        <button
          onClick={() => handleQuickCheer('⚡')}
          className="text-xs px-2 py-1 rounded-lg hover:bg-slate-800 flex items-center gap-1 text-slate-300"
          title="همة عالية"
        >
          <span>⚡</span>
          <span className="text-[10px] hidden sm:inline">همة</span>
        </button>
        <button
          onClick={() => handleQuickCheer('🦅')}
          className="text-xs px-2 py-1 rounded-lg hover:bg-slate-800 flex items-center gap-1 text-slate-300"
          title="صقور"
        >
          <span>🦅</span>
          <span className="text-[10px] hidden sm:inline">صقور</span>
        </button>
        <button
          onClick={() => handleQuickCheer('💪')}
          className="text-xs px-2 py-1 rounded-lg hover:bg-slate-800 flex items-center gap-1 text-slate-300"
          title="قوة والتزام"
        >
          <span>💪</span>
          <span className="text-[10px] hidden sm:inline">التزام</span>
        </button>
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSend} className="p-2.5 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          placeholder="اكتب رسالتك أو شجع فريقك..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 rounded-xl font-bold transition-all shadow-sm"
          title="إرسال"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
