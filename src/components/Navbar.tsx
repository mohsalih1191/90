import React, { useState } from 'react';
import {
  Trophy,
  Users,
  Tv,
  Shield,
  Bell,
  FileSpreadsheet,
  FileText,
  UserCheck,
  CheckCircle,
  Flame,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole, ViewMode } from '../types';

interface NavbarProps {
  onOpenAuditLog: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuditLog, onOpenNotifications }) => {
  const {
    viewMode,
    setViewMode,
    currentRole,
    setCurrentRole,
    currentUser,
    setCurrentUser,
    members,
    notifications,
    submissions,
    exportMembersCSV
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const handleSelectUser = (memberId: string) => {
    const selected = members.find((m) => m.id === memberId);
    if (selected) {
      setCurrentUser(selected);
      setCurrentRole(selected.role);
    }
    setShowRoleMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand & Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              90X
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                  دوري المجتمع 90X
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  مباشر حياً
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-400">
                منظومة التحدي والانضباط الجماعي
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs (3 الواجهات الأساسية) */}
          <nav className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
            <button
              id="tab-participant-view"
              onClick={() => setViewMode('participant')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'participant'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>المشارك</span>
            </button>

            <button
              id="tab-moderator-view"
              onClick={() => setViewMode('moderator')}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'moderator'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>المشرف</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              id="tab-stream-view"
              onClick={() => setViewMode('stream')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                viewMode === 'stream'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/25 font-bold animate-pulse'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span className="flex items-center gap-1">
                <span>بث 9:16</span>
                <span className="hidden lg:inline text-[10px] bg-rose-950 text-rose-300 px-1 py-0.5 rounded border border-rose-800">
                  تيك توك
                </span>
              </span>
            </button>
          </nav>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-2">
            
            {/* Audit Log button for Admins/Mods */}
            {(currentRole === 'moderator' || currentRole === 'admin') && (
              <button
                id="btn-open-audit-log"
                onClick={onOpenAuditLog}
                title="سجل التدقيق الأمني (Audit Log)"
                className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 border border-slate-800 text-xs hidden sm:flex items-center gap-1"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden md:inline">سجل التدقيق</span>
              </button>
            )}

            {/* Export CSV for Admin */}
            {(currentRole === 'admin' || currentRole === 'moderator') && (
              <button
                id="btn-export-csv"
                onClick={exportMembersCSV}
                title="تصدير بيانات الأعضاء CSV"
                className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800 text-xs hidden sm:flex items-center gap-1"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span className="hidden md:inline">تصدير CSV</span>
              </button>
            )}

            {/* Notifications */}
            <button
              id="btn-open-notifications"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800"
              title="الإشعارات والتنبيهات"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>

            {/* Role & Persona Switcher Dropdown */}
            <div className="relative">
              <button
                id="btn-role-switcher-dropdown"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-500/50"
                />
                <div className="text-right hidden sm:block">
                  <div className="text-slate-200 font-bold truncate max-w-[90px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-400 font-medium">
                    {currentRole === 'admin' ? 'مدير عام' : currentRole === 'moderator' ? 'مشرف معتمد' : 'مشارك'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleMenu && (
                <div className="absolute left-0 sm:right-0 mt-2 w-64 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1.5 text-[11px] text-slate-400 font-bold border-b border-slate-800 mb-1">
                    تبديل الشخصية للتجربة السريعة:
                  </div>
                  
                  {members.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSelectUser(m.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-right text-xs transition-colors ${
                        currentUser.id === m.id
                          ? 'bg-amber-500/20 text-amber-300 font-bold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-slate-200">{m.name}</div>
                          <div className="text-[10px] text-slate-400">{m.teamName}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        m.role === 'moderator'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : m.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {m.role === 'moderator' ? 'مشرف' : m.role === 'admin' ? 'مدير' : 'مشارك'}
                      </span>
                    </button>
                  ))}

                  <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between items-center px-1">
                    <span className="text-[11px] text-slate-400">تغيير الصلاحية:</span>
                    <div className="flex gap-1">
                      {(['participant', 'moderator', 'admin'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            setCurrentRole(r);
                            setShowRoleMenu(false);
                          }}
                          className={`text-[10px] px-2 py-1 rounded font-bold transition-colors ${
                            currentRole === r
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {r === 'participant' ? 'مشارك' : r === 'moderator' ? 'مشرف' : 'مدير'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
