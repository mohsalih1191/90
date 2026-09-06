import React, { useState } from 'react';
import {
  Flame,
  Trophy,
  Target,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
  Swords,
  ChevronLeft,
  Bell,
  Sliders,
  ShieldAlert,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VotingWidget } from './VotingWidget';
import { LiveChatWidget } from './LiveChatWidget';
import { ScoreHistoryChart } from './ScoreHistoryChart';

interface ParticipantViewProps {
  onOpenDailyModal: () => void;
}

export const ParticipantView: React.FC<ParticipantViewProps> = ({ onOpenDailyModal }) => {
  const {
    currentUser,
    teams,
    weeklyMatchup,
    submissions,
    updateNotificationSettings
  } = useApp();

  const [reminderTime, setReminderTime] = useState(currentUser.reminderTime);
  const [pushNotif, setPushNotif] = useState(currentUser.pushNotifications);
  const [emailNotif, setEmailNotif] = useState(currentUser.emailNotifications);
  const [isSavedPrefs, setIsSavedPrefs] = useState(false);

  const userTeam = teams.find((t) => t.id === currentUser.teamId);
  const userSubmissions = submissions.filter((s) => s.memberId === currentUser.id);
  const latestSubmission = userSubmissions[0];
  const hasLoggedToday = latestSubmission && latestSubmission.date === new Date().toISOString().split('T')[0];

  // 90X Phase computation
  const currentDay = currentUser.currentDay || 35;
  const currentPhaseNumber = currentDay <= 30 ? 1 : currentDay <= 60 ? 2 : 3;
  const phaseTitle =
    currentPhaseNumber === 1
      ? 'المرحلة الأولى: بناء الأساس والانضباط (1 - 30 يوم)'
      : currentPhaseNumber === 2
      ? 'المرحلة الثانية: التسارع وتثبيت العادات (31 - 60 يوم)'
      : 'المرحلة الثالثة: الإتقان والسيادة الكاملة (61 - 90 يوم)';

  const phaseProgressPercent = Math.round((currentDay / 90) * 100);

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationSettings(currentUser.id, pushNotif, emailNotif, reminderTime);
    setIsSavedPrefs(true);
    setTimeout(() => setIsSavedPrefs(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero / Stat Overview Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-8 text-right shadow-2xl">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                رحلة 90X • اليوم {currentDay} من 90
              </span>
              <span className="text-xs font-bold text-slate-400">
                {userTeam?.badge} {userTeam?.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              أهلاً بك يا {currentUser.name} 🚀
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {currentUser.goalSummary}
            </p>
          </div>

          {/* Action Button: Daily Log Submission */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              id="btn-open-daily-log-hero"
              onClick={onOpenDailyModal}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>{hasLoggedToday ? 'تحديث تسجيل اليوم' : 'تسجيل تقدم اليوم'}</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800/80">
          
          {/* 1. Streak */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>سلسلة الالتزام</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {currentUser.streak}
              </span>
              <span className="text-xs text-slate-400 font-semibold">يوم متواصل</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              أطول سلسلة: {currentUser.longestStreak} يوم
            </div>
          </div>

          {/* 2. Fair Average Score */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>متوسط درجاتك</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {currentUser.averageScore}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ 100</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              احتساب عادل: مهام + استمرارية + تحسن + دعم
            </div>
          </div>

          {/* 3. Team Rank */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>ترتيب فريقك</span>
              <Trophy className="w-4 h-4 text-orange-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                #{userTeam?.rank || 1}
              </span>
              <span className="text-xs text-slate-400 font-semibold">في الدوري</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              متوسط نقاط الفريق: {userTeam?.averageScore}
            </div>
          </div>

          {/* 4. Completion Rate */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>نسبة الالتزام</span>
              <Target className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                %{currentUser.completionRate}
              </span>
              <span className="text-xs text-slate-400 font-semibold">من المستهدف</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {currentUser.totalSubmissions} تسجيلات معتمدة
            </div>
          </div>

        </div>

      </div>

      {/* 90X Journey Map: Phases & Milestones */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 text-right shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-100">
                خارطة رحلة 90X (التقدم نحو الإتقان)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {phaseTitle}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">إجمالي التقدم في الـ 90 يوم:</span>
            <span className="text-sm font-bold text-amber-400 font-mono">%{phaseProgressPercent}</span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-3 mb-6">
          <div className="w-full bg-slate-950 rounded-full h-3.5 p-0.5 border border-slate-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${phaseProgressPercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>البداية (اليوم 1)</span>
            <span>اليوم {currentDay}</span>
            <span>المحطة الختامية (اليوم 90)</span>
          </div>
        </div>

        {/* 3 Milestone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Phase 1 */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                المرحلة 1: منجزة ✓
              </span>
              <span className="text-xs font-mono text-slate-400">الأيام 1-30</span>
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-1">
              مرحلة التأسيس وبناء العادات
            </h3>
            <p className="text-xs text-slate-400">
              كسر المقاومة النفسية وتثبيت روتين الصباح والمهام المحورية بدون انقطاع.
            </p>
          </div>

          {/* Phase 2 - Current */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 border-2 border-amber-500/60 relative shadow-lg shadow-amber-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="w-3 h-3 fill-slate-950" />
                المرحلة الحالية جارية
              </span>
              <span className="text-xs font-mono text-amber-300 font-bold">الأيام 31-60</span>
            </div>
            <h3 className="text-sm font-extrabold text-amber-300 mb-1">
              مرحلة التسارع ومضاعفة الأثر
            </h3>
            <p className="text-xs text-slate-300">
              رفع وتيرة العمل المركز وتحسين جودة الإنجاز بنسبة 20% أسبوعياً.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 opacity-70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                المرحلة 3: القادمة
              </span>
              <span className="text-xs font-mono text-slate-500">الأيام 61-90</span>
            </div>
            <h3 className="text-sm font-bold text-slate-300 mb-1">
              مرحلة الإتقان والسيادة
            </h3>
            <p className="text-xs text-slate-500">
              تحويل العادات إلى هوية دائمة وحصاد الثمار في البث الختامي الكبير.
            </p>
          </div>

        </div>
      </div>

      {/* 30-Day Performance History Visualization (Recharts) */}
      <ScoreHistoryChart currentUser={currentUser} submissions={submissions} />

      {/* Main Grid: League Table & Matchup vs Engagement Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Live League Leaderboard & Weekly Matchup */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Weekly Team Matchup Spotlight (المواجهات الأسبوعية) */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 text-right relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-extrabold text-slate-100">
                  المواجهة الأسبوعية المباشرة (الأسبوع {weeklyMatchup.weekNumber})
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                مشتعلة الآن 🔥
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              فعالية أسبوعية لرفع الحماس والمنافسة الشريفة بين الفرق المتقاربة في الترتيب:
            </p>

            {/* Clash Card */}
            <div className="grid grid-cols-5 items-center gap-2 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              
              {/* Team A */}
              <div className="col-span-2 text-center space-y-1">
                <div className="text-3xl">{weeklyMatchup.teamA.badge}</div>
                <div className="text-sm font-bold text-slate-200">{weeklyMatchup.teamA.name}</div>
                <div className="text-lg font-black text-amber-400 font-mono">
                  {weeklyMatchup.teamA.score}
                </div>
                <div className="text-[10px] text-slate-400">
                  {weeklyMatchup.teamA.membersActive} مشارك نشط
                </div>
              </div>

              {/* VS Divider */}
              <div className="col-span-1 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-slate-800/90 border border-slate-700 flex items-center justify-center font-black text-rose-400 text-xs">
                  VS
                </div>
                <div className="text-[10px] text-slate-500 mt-1">فارق 2.6</div>
              </div>

              {/* Team B */}
              <div className="col-span-2 text-center space-y-1">
                <div className="text-3xl">{weeklyMatchup.teamB.badge}</div>
                <div className="text-sm font-bold text-slate-200">{weeklyMatchup.teamB.name}</div>
                <div className="text-lg font-black text-emerald-400 font-mono">
                  {weeklyMatchup.teamB.score}
                </div>
                <div className="text-[10px] text-slate-400">
                  {weeklyMatchup.teamB.membersActive} مشارك نشط
                </div>
              </div>

            </div>
          </div>

          {/* Live Community League Table (اللوحة الرئيسية اليومية) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-right shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-extrabold text-slate-100">
                    لوحة الدوري المجتمعي المباشرة
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  الترتيب يعتمد على <strong>متوسط نقاط الأعضاء</strong> لضمان عدالة المنافسة
                </p>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                تحديث تلقائي مستمر
              </span>
            </div>

            {/* Teams Leaderboard List */}
            <div className="space-y-3">
              {teams.map((team) => {
                const isUserTeam = team.id === currentUser.teamId;

                return (
                  <div
                    key={team.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isUserTeam
                        ? 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border-amber-500/50 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                          team.rank === 1
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                            : team.rank === 2
                            ? 'bg-slate-300 text-slate-950'
                            : team.rank === 3
                            ? 'bg-amber-700 text-amber-100'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          #{team.rank}
                        </div>
                        <div className="text-2xl">{team.badge}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-slate-100">
                              {team.name}
                            </span>
                            {isUserTeam && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                                فريقك
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400">
                            {team.activeMembersCount} من {team.membersCount} نشطين • المرحلة {team.currentPhase}
                          </div>
                        </div>
                      </div>

                      <div className="text-left">
                        <div className="flex items-baseline gap-1 justify-end">
                          <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                            {team.averageScore}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">نقطة</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          متوسط أعضاء الفريق
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        تقدم المرحلة:
                      </span>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${team.phaseProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        %{team.phaseProgress}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* 10-day Community Voting Widget */}
          <VotingWidget />

        </div>

        {/* Right Col: Live Chat Feed & Notification Preferences */}
        <div className="space-y-6">
          
          {/* Live Chat / Community Cheer Feed */}
          <LiveChatWidget />

          {/* User Notification Preferences (US-025) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-right shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-sm text-slate-100">
                  تفضيلات التنبيهات والتذكير
                </h4>
              </div>
              <Sliders className="w-4 h-4 text-slate-400" />
            </div>

            <form onSubmit={handleSaveNotifications} className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">إشعارات التطبيق (Push Alerts)</span>
                <input
                  type="checkbox"
                  checked={pushNotif}
                  onChange={(e) => setPushNotif(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-amber-500 bg-slate-900"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">تنبيهات البريد الإلكتروني (Email)</span>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-amber-500 bg-slate-900"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <label className="text-slate-400 text-[11px] block">
                  وقت التذكير اليومي بالتسجيل:
                </label>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 font-bold transition-colors"
              >
                {isSavedPrefs ? 'تم حفظ التفضيلات ✓' : 'حفظ التفضيلات'}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
