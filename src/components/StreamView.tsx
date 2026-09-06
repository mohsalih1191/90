import React, { useState, useEffect } from 'react';
import {
  Tv,
  Flame,
  Trophy,
  Swords,
  Sparkles,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Eye,
  Volume2,
  Share2,
  Heart,
  MessageCircle,
  TrendingUp,
  Activity,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StreamView: React.FC = () => {
  const { teams, weeklyMatchup, triggerCelebration } = useApp();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'matchup' | 'journey'>('leaderboard');
  const [tickerIndex, setTickerIndex] = useState(0);

  const breakingAlerts = [
    '🔥 فريق صقور العزيمة يحافظ على الصدارة بمتوسط 92.4 نقطة!',
    '⚡ مواجهة نارية: همة بلا حدود يقلص الفارق في صراع الأسبوع الخامس!',
    '🏆 رحلة 90X: الفرق تدخل مرحلة التسارع ومضاعفة الأثر بنجاح!',
    '🛡️ الخصوصية أولاً: بيانات وإثباتات المشاركين مشفرة ومحمية بالكامل.'
  ];

  // Auto-rotate ticker news
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % breakingAlerts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [breakingAlerts.length]);

  return (
    <div className="space-y-6 text-right">
      
      {/* Stream Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
            <Tv className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-100">
                وضع بث تيك توك المباشر (9:16 Vertical Stream)
              </h2>
              <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                LIVE OBS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              تصميم عالي التباين بخطوط كبيرة وواضحة لبث الفيديو، خالي من أي بيانات خاصة
            </p>
          </div>
        </div>

        {/* View mode toggle: Container vs Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerCelebration}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>احتفال البث (Confetti)</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>إلغاء وضع ملء الشاشة</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>توسيع الشاشة للبث الكامل</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 9:16 Vertical Canvas */}
      <div className={`flex justify-center ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-0' : 'py-2'}`}>
        
        {/* 9:16 Aspect Ratio Frame */}
        <div
          className={`relative bg-slate-950 border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between text-slate-100 ${
            isFullscreen
              ? 'w-full h-full max-w-[500px] mx-auto rounded-none'
              : 'w-full max-w-[430px] aspect-[9/16] rounded-[40px]'
          }`}
          style={{ minHeight: isFullscreen ? '100vh' : '760px' }}
        >
          {/* Top Ambient Glow */}
          <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-amber-500/20 via-rose-500/10 to-transparent pointer-events-none"></div>

          {/* Stream Overlay Header */}
          <div className="relative z-10 p-5 pb-3">
            
            {/* Live Indicator & Broadcast Tag */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-rose-600 px-3 py-1 rounded-full text-white font-black text-xs shadow-lg shadow-rose-600/30">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>مباشر LIVE</span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-400">
                  دوري 90X
                </div>
              </div>

              {/* Privacy badge guarantee for viewers */}
              <div className="flex items-center gap-1 bg-slate-900/90 border border-emerald-500/40 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                <span>بيانات عامة مشفرة</span>
              </div>
            </div>

            {/* Title & Slogan */}
            <div className="text-center space-y-0.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
                دوري المجتمع 90X
              </h1>
              <p className="text-xs font-bold text-amber-400 tracking-wide uppercase">
                منظومة الانضباط • بث النتائج الحية
              </p>
            </div>

            {/* Stream Navigation Switcher Tabs */}
            <div className="flex items-center justify-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 mt-3 text-xs font-bold">
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`flex-1 py-1.5 rounded-xl transition-all ${
                  activeTab === 'leaderboard'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ترتيب الفرق
              </button>
              <button
                onClick={() => setActiveTab('matchup')}
                className={`flex-1 py-1.5 rounded-xl transition-all ${
                  activeTab === 'matchup'
                    ? 'bg-rose-500 text-white shadow-md font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                المواجهة
              </button>
              <button
                onClick={() => setActiveTab('journey')}
                className={`flex-1 py-1.5 rounded-xl transition-all ${
                  activeTab === 'journey'
                    ? 'bg-blue-500 text-white shadow-md font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                رحلة 90X
              </button>
            </div>

          </div>

          {/* Central Broadcast Content Area */}
          <div className="relative z-10 flex-1 px-5 py-2 overflow-y-auto space-y-4">
            
            {/* View 1: Live Leaderboard (لوحة الدوري الحية) */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between text-xs px-1 text-slate-400 font-bold">
                  <span>جدول ترتيب الفرق المباشر</span>
                  <span className="text-amber-400">متوسط النقاط العادل</span>
                </div>

                {teams.map((team) => (
                  <div
                    key={team.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      team.rank === 1
                        ? 'bg-gradient-to-r from-amber-500/25 via-slate-900 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/20'
                        : team.rank === 2
                        ? 'bg-gradient-to-r from-slate-400/20 via-slate-900 to-slate-900 border-slate-500'
                        : team.rank === 3
                        ? 'bg-gradient-to-r from-amber-800/20 via-slate-900 to-slate-900 border-amber-700'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-base ${
                            team.rank === 1
                              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/40 font-black'
                              : team.rank === 2
                              ? 'bg-slate-300 text-slate-950 font-black'
                              : team.rank === 3
                              ? 'bg-amber-700 text-amber-100 font-black'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          #{team.rank}
                        </div>
                        <div className="text-3xl">{team.badge}</div>
                        <div>
                          <div className="font-extrabold text-base text-white">
                            {team.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium">
                            {team.activeMembersCount} أعضاء متفاعلين • {team.totalCompletedTasks} مهمة
                          </div>
                        </div>
                      </div>

                      <div className="text-left">
                        <div className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                          {team.averageScore}
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold">
                          نقطة / 100
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar inside stream card */}
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-2">
                      <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            team.rank === 1 ? 'bg-amber-400' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${team.phaseProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        المرحلة {team.currentPhase} (%{team.phaseProgress})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View 2: Weekly Team Matchup (مواجهة الفرق الأسبوعية) */}
            {activeTab === 'matchup' && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200 text-center">
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-black text-rose-400 uppercase">
                    <Swords className="w-4 h-4" />
                    <span>مواجهة الأسبوع الخامسة المشتعلة</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    النقاط تُحتسب من متوسط التزام وتفاعل الفريقين
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
                  <div className="grid grid-cols-5 items-center gap-2">
                    
                    {/* Team A */}
                    <div className="col-span-2 space-y-1">
                      <div className="text-4xl animate-bounce">{weeklyMatchup.teamA.badge}</div>
                      <div className="text-sm font-black text-white">{weeklyMatchup.teamA.name}</div>
                      <div className="text-2xl font-black text-amber-400 font-mono">
                        {weeklyMatchup.teamA.score}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-bold">
                        {weeklyMatchup.teamA.membersActive} مشاركين
                      </div>
                    </div>

                    {/* VS */}
                    <div className="col-span-1">
                      <div className="w-12 h-12 rounded-full bg-rose-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-lg shadow-rose-600/50">
                        VS
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        صراع الصدارة
                      </div>
                    </div>

                    {/* Team B */}
                    <div className="col-span-2 space-y-1">
                      <div className="text-4xl animate-bounce">{weeklyMatchup.teamB.badge}</div>
                      <div className="text-sm font-black text-white">{weeklyMatchup.teamB.name}</div>
                      <div className="text-2xl font-black text-emerald-400 font-mono">
                        {weeklyMatchup.teamB.score}
                      </div>
                      <div className="text-[11px] text-emerald-400 font-bold">
                        {weeklyMatchup.teamB.membersActive} مشاركين
                      </div>
                    </div>

                  </div>

                  {/* Battle Tension Bar */}
                  <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>{weeklyMatchup.teamA.name}</span>
                      <span>فارق 2.6 نقطة فقط!</span>
                      <span>{weeklyMatchup.teamB.name}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
                      <div className="bg-amber-400 h-full" style={{ width: '51%' }}></div>
                      <div className="bg-emerald-500 h-full" style={{ width: '49%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs text-slate-300">
                  🏆 يُعلن الفريق الفائز في نهاية الأسبوع ويحصل على وسام الشرف بالبث المباشر
                </div>
              </div>
            )}

            {/* View 3: 90X Journey Stage Progress (رحلة 90X) */}
            {activeTab === 'journey' && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="text-center p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                  <div className="text-xs font-black text-amber-400">
                    رحلة الـ 90 يوماً نحو الإتقان الكامل
                  </div>
                  <div className="text-xl font-black text-white font-mono mt-0.5">
                    اليوم 35 / 90
                  </div>
                </div>

                {/* Vertical Stage Road */}
                <div className="space-y-3">
                  
                  {/* Phase 1 */}
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-emerald-400">الأيام 1 - 30</div>
                      <div className="text-sm font-extrabold text-white">المرحلة 1: التأسيس والانضباط</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs">
                      منجزة ✓
                    </span>
                  </div>

                  {/* Phase 2 (Active) */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/25 to-orange-500/20 border-2 border-amber-400 flex items-center justify-between shadow-lg shadow-amber-500/20">
                    <div>
                      <div className="text-[10px] font-black text-amber-300">الأيام 31 - 60 (جارية الآن)</div>
                      <div className="text-sm font-black text-amber-300">المرحلة 2: التسارع ومضاعفة الأثر</div>
                      <div className="text-[11px] text-slate-300 mt-1">إنجاز المهام الصعبة وتحسين التركيز</div>
                    </div>
                    <Flame className="w-7 h-7 text-amber-400 animate-bounce" />
                  </div>

                  {/* Phase 3 */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 opacity-60 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-500">الأيام 61 - 90</div>
                      <div className="text-sm font-bold text-slate-400">المرحلة 3: الإتقان والسيادة</div>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">قادمة</span>
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* Stream Overlay Footer: Breaking News Ticker & TikTok Interaction Bar */}
          <div className="relative z-10 p-4 border-t border-slate-800 bg-slate-950/95 space-y-2">
            
            {/* Breaking News Marquee */}
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black whitespace-nowrap">
                عاجل البث
              </span>
              <div className="text-slate-200 font-bold truncate flex-1 text-right">
                {breakingAlerts[tickerIndex]}
              </div>
            </div>

            {/* TikTok Simulated Engagement Stats Bar */}
            <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-rose-400 font-bold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  <span>24.8K إعجاب</span>
                </span>
                <span className="flex items-center gap-1 text-blue-400 font-bold">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>1.4K تعليق</span>
                </span>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>تحديث لحظي</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
