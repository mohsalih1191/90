import React, { useState } from 'react';
import {
  Shield,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Download,
  FileSpreadsheet,
  Clock,
  Flame,
  UserCheck,
  UserX,
  MessageSquare,
  FileText,
  Filter,
  Check,
  ArrowUpDown,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Member, DailySubmission, UserRole, MemberStatus } from '../types';

interface AdminViewProps {
  onOpenAuditLog: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onOpenAuditLog }) => {
  const {
    members,
    submissions,
    currentUser,
    currentRole,
    approveSubmission,
    rejectSubmission,
    unmaskProof,
    remaskProof,
    sendInactivityAlert,
    toggleMemberDeactivation,
    updateMemberRole,
    exportMembersCSV
  } = useApp();

  // Search, filter, sorting state for directory
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MemberStatus>('all');
  const [sortBy, setSortBy] = useState<'streak' | 'averageScore' | 'name' | 'daysInactive'>('streak');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selected member for history modal
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Unmask prompt dialog state
  const [unmaskDialog, setUnmaskDialog] = useState<{
    isOpen: boolean;
    submissionId: string;
    memberId: string;
    reason: string;
  }>({
    isOpen: false,
    submissionId: '',
    memberId: '',
    reason: 'التحقق من صحة إثبات الإنجاز لاعتماد النقاط'
  });

  // Approval note state
  const [approvalNote, setApprovalNote] = useState<Record<string, string>>({});

  // Pending submissions list
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');

  // Filter & sort members directory
  const filteredMembers = members
    .filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'streak') comparison = a.streak - b.streak;
      else if (sortBy === 'averageScore') comparison = a.averageScore - b.averageScore;
      else if (sortBy === 'daysInactive') comparison = a.daysInactive - b.daysInactive;
      else comparison = a.name.localeCompare(b.name);

      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // Stats summaries
  const activeCount = members.filter((m) => m.status === 'active').length;
  const laggingCount = members.filter((m) => m.status === 'lagging').length;
  const inactiveCount = members.filter((m) => m.status === 'inactive').length;

  const handleOpenUnmask = (submissionId: string, memberId: string) => {
    setUnmaskDialog({
      isOpen: true,
      submissionId,
      memberId,
      reason: 'التحقق من إثبات المهمة اليومية لاعتماد درجات الاستحقاق'
    });
  };

  const handleConfirmUnmask = () => {
    unmaskProof(unmaskDialog.submissionId, unmaskDialog.memberId, unmaskDialog.reason);
    setUnmaskDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-right">
      
      {/* Top Banner & Stats Overview */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                لوحة المشرف والتحكم المركزية
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                {currentRole === 'admin' ? 'صلاحيات مدير عام' : 'صلاحيات مشرف دوري'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              متابعة الأعضاء، اعتماد التسجيلات، تدقيق الإثباتات مع الحفاظ الكامل على الخصوصية
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportMembersCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>تصدير البيانات CSV</span>
            </button>
            <button
              onClick={onOpenAuditLog}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>سجل التدقيق الأمني</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs text-slate-400">إجمالي المشاركين</div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 font-mono mt-1">
              {members.length}
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              {activeCount} نشط وملتزم
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs text-slate-400">بانتظار الاعتماد والمراجعة</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-1">
              {pendingSubmissions.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              تسجيلات يومية واردة
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs text-slate-400">متأخرين (4+ أيام بلا تسجيل)</div>
            <div className="text-2xl sm:text-3xl font-black text-orange-400 font-mono mt-1">
              {laggingCount}
            </div>
            <div className="text-[11px] text-orange-400/90 mt-0.5">
              يحتاجون تنبيه فوري
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs text-slate-400">غير نشطين (15+ يوم)</div>
            <div className="text-2xl sm:text-3xl font-black text-rose-400 font-mono mt-1">
              {inactiveCount}
            </div>
            <div className="text-[11px] text-rose-400/90 mt-0.5">
              مرشحون للتعطيل التلقائي
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Submissions Approval Queue (اعتماد التسجيلات اليومية) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-right shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-slate-100">
              طابور المراجعة والاعتماد اليومي
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              {pendingSubmissions.length} بانتظارك
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            تدقيق المهام ونقاط الـ 100 قبل النشر في لوحة الدوري وبث تيك توك
          </span>
        </div>

        {pendingSubmissions.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 stroke-[1.5]" />
            <p className="text-sm font-bold text-slate-300">
              رائع! تم اعتماد ومراجعة جميع التسجيلات اليومية.
            </p>
            <p className="text-xs text-slate-500">
              ستظهر التسجيلات الجديدة هنا فور إرسالها من المشاركين.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingSubmissions.map((sub) => {
              const note = approvalNote[sub.id] || '';

              return (
                <div
                  key={sub.id}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-md"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                        #{sub.dayNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-100">
                            {sub.memberName}
                          </span>
                          <span className="text-xs text-slate-400">
                            • {sub.teamName}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                            {sub.submittedAt}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          تأملات المشارك: "{sub.reflection}"
                        </div>
                      </div>
                    </div>

                    {/* Points Breakdown Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
                      <span className="text-slate-400 text-[11px] px-1">النقاط المقترحة:</span>
                      <span className="font-black text-amber-400 font-mono text-sm px-1.5 py-0.5 bg-amber-500/10 rounded">
                        {sub.scoreBreakdown.totalScore} / 100
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        (مهام: {sub.scoreBreakdown.tasksScore} + استمرارية: {sub.scoreBreakdown.consistencyScore} + تحسن: {sub.scoreBreakdown.improvementScore} + تفاعل: {sub.scoreBreakdown.engagementScore})
                      </span>
                    </div>
                  </div>

                  {/* Body: Tasks & Proof Photo with Privacy Blur */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    
                    {/* Tasks list */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-300 block mb-1">
                        المهام المنجزة:
                      </span>
                      {sub.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80"
                        >
                          <span className={task.completed ? 'text-emerald-400' : 'text-slate-500'}>
                            {task.completed ? '✓' : '✗'}
                          </span>
                          <span className={task.completed ? '' : 'line-through opacity-60'}>
                            {task.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Proof Photo & Masking Inspection (PB-010, PB-012) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-300">
                          إثبات الإنجاز المرفق:
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-400" />
                          {sub.proofIsMasked ? 'مظلل للخصوصية' : 'تم إلغاء التعتيم (موثق)'}
                        </span>
                      </div>

                      {sub.proofImageUrl ? (
                        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 h-32 flex items-center justify-center group">
                          <img
                            src={sub.proofImageUrl}
                            alt="Proof Preview"
                            className={`w-full h-full object-cover transition-all duration-300 ${
                              sub.proofIsMasked ? 'filter blur-[10px] scale-105' : 'filter-none'
                            }`}
                          />

                          {/* Masking Overlay & Unmask button */}
                          {sub.proofIsMasked ? (
                            <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center p-3 text-center">
                              <Lock className="w-5 h-5 text-amber-400 mb-1" />
                              <span className="text-[11px] font-bold text-slate-200">
                                الصورة محمية بتعتيم آمن
                              </span>
                              <button
                                type="button"
                                onClick={() => handleOpenUnmask(sub.id, sub.memberId)}
                                className="mt-2 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-lg shadow-md flex items-center gap-1 transition-all"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>إلغاء التعتيم للتحقق (يُسجل في التدقيق)</span>
                              </button>
                            </div>
                          ) : (
                            <div className="absolute top-2 right-2 flex gap-1">
                              <button
                                type="button"
                                onClick={() => remaskProof(sub.id)}
                                className="px-2 py-1 bg-slate-950/80 hover:bg-slate-900 text-slate-200 text-[10px] rounded border border-slate-700 flex items-center gap-1"
                              >
                                <EyeOff className="w-3 h-3" />
                                <span>إعادة التعتيم</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-32 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 flex items-center justify-center text-xs text-slate-500">
                          لم يُرفق صورة إثبات لهذا التسجيل
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Actions Bar: Notes, Approve, Reject */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <input
                      type="text"
                      placeholder="إضافة ملاحظة أو تشجيع للمشارك..."
                      value={note}
                      onChange={(e) =>
                        setApprovalNote((prev) => ({ ...prev, [sub.id]: e.target.value }))
                      }
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => rejectSubmission(sub.id, note || 'يرجى استكمال البيانات المطلوبة')}
                        className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>طلب تعديل</span>
                      </button>

                      <button
                        onClick={() => approveSubmission(sub.id, note)}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>اعتماد فوري ونشر النقاط</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Member Directory & Status Management (دليل المشاركين والمتابعة) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-right shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-extrabold text-slate-100">
                دليل الأعضاء ومتابعة الالتزام (Member Directory)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              مراقبة السلاسل، تتبع المتأخرين، إرسال التنبيهات وإدارة الحسابات
            </p>
          </div>

          <div className="text-xs text-slate-400">
            يعرض {filteredMembers.length} من أصل {members.length} عضو
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-5">
          {/* Search */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="بحث بالاسم، الفريق، أو المعرف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-4 flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الكل ({members.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === 'active'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              نشط ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('lagging')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === 'lagging'
                  ? 'bg-orange-500/20 text-orange-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              متأخر ({laggingCount})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === 'inactive'
                  ? 'bg-rose-500/20 text-rose-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              معطل ({inactiveCount})
            </button>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="streak">ترتيب حسب: السلسلة 🔥</option>
              <option value="averageScore">ترتيب حسب: متوسط النقاط 🏆</option>
              <option value="daysInactive">ترتيب حسب: أيام الانقطاع ⚠️</option>
              <option value="name">ترتيب أبجدي</option>
            </select>
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="px-4 py-3">المشارك والفريق</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">سلسلة الالتزام</th>
                <th className="px-4 py-3">نسبة الإنجاز</th>
                <th className="px-4 py-3">متوسط النقاط</th>
                <th className="px-4 py-3">آخر تسجيل</th>
                <th className="px-4 py-3">الدور والصلاحية</th>
                <th className="px-4 py-3 text-center">إجراءات المتابعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                  
                  {/* Name & Avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-200">{member.name}</div>
                        <div className="text-[10px] text-slate-400">{member.teamName}</div>
                      </div>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    {member.status === 'active' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        نشط
                      </span>
                    ) : member.status === 'lagging' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        <AlertTriangle className="w-3 h-3" />
                        متأخر ({member.daysInactive} أيام)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        <UserX className="w-3 h-3" />
                        غير نشط ({member.daysInactive} يوم)
                      </span>
                    )}
                  </td>

                  {/* Streak */}
                  <td className="px-4 py-3 font-mono font-bold text-amber-400">
                    🔥 {member.streak} يوم
                  </td>

                  {/* Completion % */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${member.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-semibold text-slate-300">
                        %{member.completionRate}
                      </span>
                    </div>
                  </td>

                  {/* Average Score */}
                  <td className="px-4 py-3 font-mono font-black text-slate-200">
                    {member.averageScore}
                  </td>

                  {/* Last Log */}
                  <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                    {member.lastLogDate}
                  </td>

                  {/* Role Selector */}
                  <td className="px-4 py-3">
                    <select
                      value={member.role}
                      onChange={(e) => updateMemberRole(member.id, e.target.value as UserRole)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="participant">مشارك</option>
                      <option value="moderator">مشرف</option>
                      <option value="admin">مدير</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      
                      {/* Send Alert if lagging */}
                      {member.daysInactive >= 3 && (
                        <button
                          onClick={() => sendInactivityAlert(member.id)}
                          className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30"
                          title="إرسال تنبيه غياب تلقائي"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Deactivate / Reactivate */}
                      <button
                        onClick={() => toggleMemberDeactivation(member.id)}
                        className={`p-1.5 rounded-lg text-xs border ${
                          member.status === 'inactive'
                            ? 'bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border-slate-700'
                        }`}
                        title={member.status === 'inactive' ? 'إعادة تفعيل الحساب' : 'تعطيل الحساب'}
                      >
                        {member.status === 'inactive' ? (
                          <UserCheck className="w-3.5 h-3.5" />
                        ) : (
                          <UserX className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* View member history link */}
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        title="عرض سجل المشارك الكامل"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unmask Security Confirmation Modal */}
      {unmaskDialog.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-right space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  تأكيد فك تعتيم صورة الإثبات
                </h3>
                <p className="text-xs text-slate-400">
                  يتم تسجيل هذا الإجراء في سجل التدقيق الأمني (Audit Trail)
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              حسب سياسة الخصوصية، تظل صور المشاركين محجوبة عن الجمهور حتى يقوم المشرف المعتمد بإلغاء التعتيم لأغراض التحقق فقط.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                سبب إلغاء التعتيم (مطلوب للتوثيق):
              </label>
              <input
                type="text"
                value={unmaskDialog.reason}
                onChange={(e) =>
                  setUnmaskDialog((prev) => ({ ...prev, reason: e.target.value }))
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setUnmaskDialog((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmUnmask}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 text-white font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>توثيق وفك التعتيم</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member History Modal Drawer */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 text-right space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-500"
                />
                <div>
                  <h3 className="font-bold text-base text-slate-100">{selectedMember.name}</h3>
                  <div className="text-xs text-slate-400">
                    {selectedMember.teamName} • انضم: {selectedMember.joinedDate}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">السلسلة الحالية</div>
                <div className="text-lg font-black text-amber-400 font-mono">
                  {selectedMember.streak} يوم
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">متوسط الدرجات</div>
                <div className="text-lg font-black text-emerald-400 font-mono">
                  {selectedMember.averageScore}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400">إجمالي التسجيلات</div>
                <div className="text-lg font-black text-blue-400 font-mono">
                  {selectedMember.totalSubmissions}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-2">
                سجل التسجيلات التاريخية للمشارك:
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {submissions
                  .filter((s) => s.memberId === selectedMember.id)
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-200">
                          اليوم #{sub.dayNumber} ({sub.date})
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-sm">
                          "{sub.reflection}"
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="font-mono font-bold text-amber-400">
                          {sub.scoreBreakdown.totalScore} نقطة
                        </span>
                        <div className="text-[10px] text-slate-500">
                          {sub.status === 'approved' ? 'معتمد ✓' : 'قيد المراجعة'}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
