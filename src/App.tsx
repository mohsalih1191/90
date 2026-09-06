import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ParticipantView } from './components/ParticipantView';
import { AdminView } from './components/AdminView';
import { StreamView } from './components/StreamView';
import { DailyLogModal } from './components/DailyLogModal';
import { AuditLogModal } from './components/AuditLogModal';
import { NotificationsModal } from './components/NotificationsModal';
import { FeedbackWidget } from './components/FeedbackWidget';

const MainLayout: React.FC = () => {
  const { viewMode } = useApp();
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isNotifsModalOpen, setIsNotifsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      
      {/* Top Navigation */}
      <Navbar
        onOpenAuditLog={() => setIsAuditModalOpen(true)}
        onOpenNotifications={() => setIsNotifsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {viewMode === 'participant' && (
          <ParticipantView onOpenDailyModal={() => setIsDailyModalOpen(true)} />
        )}

        {viewMode === 'moderator' && (
          <AdminView onOpenAuditLog={() => setIsAuditModalOpen(true)} />
        )}

        {viewMode === 'stream' && (
          <StreamView />
        )}
      </main>

      {/* Modals & Floating Widgets */}
      <DailyLogModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
      />

      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotifsModalOpen}
        onClose={() => setIsNotifsModalOpen(false)}
      />

      {/* Floating 5-star rating & review widget */}
      <FeedbackWidget />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">دوري المجتمع 90X</span>
            <span>•</span>
            <span>نظام التحدي والانضباط والمواجهات الأسبوعية</span>
          </div>
          <div className="text-slate-400">
            🔒 تشفير بيانات كامل • تيك توك وسيلة للبث مع الحفاظ التام على خصوصية الإثباتات
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
