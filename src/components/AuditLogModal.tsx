import React, { useState } from 'react';
import {
  X,
  Shield,
  Search,
  Eye,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  Lock,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.targetMemberName && log.targetMemberName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.reason && log.reason.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAction = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const exportAuditCSV = () => {
    const headers = ['المعرف', 'التوقيت', 'المشرف/المدير', 'الإجراء', 'المستهدف', 'السبب'];
    const rows = auditLogs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.userName}"`,
      l.action,
      `"${l.targetMemberName || '-'}"`,
      `"${l.reason || '-'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'UNMASK_PRIVATE_PROOF_IMAGE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Eye className="w-3 h-3" />
            إلغاء تعتيم إثبات خاص
          </span>
        );
      case 'APPROVE_SUBMISSION':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            اعتماد تسجيل يومي
          </span>
        );
      case 'SEND_INACTIVITY_ALERT':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            إرسال تنبيه غياب
          </span>
        );
      case 'FLAG_INACTIVE_USER_DAY_4':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
            <AlertTriangle className="w-3 h-3" />
            إنذار انقطاع تلقائي
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>سجل التدقيق الأمني وحماية البيانات</span>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                  غير قابل للتعديل (Tamper-Proof)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                توثيق فوري لكل عمليات فك التعتيم، الاعتماد، والتنبيهات لضمان خصوصية الأعضاء
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportAuditCSV}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>تصدير السجل CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters and search bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="بحث باسم المشرف، العضو، أو السبب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">نوع الإجراء:</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="all">كافة الإجراءات</option>
              <option value="UNMASK_PRIVATE_PROOF_IMAGE">إلغاء التعتيم (Unmask)</option>
              <option value="APPROVE_SUBMISSION">اعتماد التسجيلات</option>
              <option value="SEND_INACTIVITY_ALERT">تنبيهات الغياب</option>
            </select>
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto max-h-[60vh]">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold sticky top-0">
              <tr>
                <th className="px-4 py-3">التوقيت</th>
                <th className="px-4 py-3">المشرف المنفّذ</th>
                <th className="px-4 py-3">نوع الإجراء</th>
                <th className="px-4 py-3">العضو المستهدف</th>
                <th className="px-4 py-3">السبب / الملاحظة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-normal">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    لا توجد سجلات مطابقة لمعايير البحث
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-200 whitespace-nowrap">
                      {log.userName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-medium whitespace-nowrap">
                      {log.targetMemberName || '-'}
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs truncate" title={log.reason}>
                      {log.reason || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>إجمالي السجلات المسجلة: {filteredLogs.length} عملية</span>
          <span className="text-[11px] text-emerald-400 font-medium">
            🔒 تشفير متوافق مع معايير حماية الخصوصية
          </span>
        </div>

      </div>
    </div>
  );
};
