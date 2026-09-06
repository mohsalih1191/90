import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Team,
  Member,
  DailySubmission,
  WeeklyMatchup,
  AuditLogEntry,
  CommunityVote,
  FeedbackSubmission,
  ChatMessage,
  SystemNotification,
  UserRole,
  ViewMode
} from '../types';
import {
  INITIAL_TEAMS,
  INITIAL_MEMBERS,
  INITIAL_SUBMISSIONS,
  INITIAL_MATCHUP,
  INITIAL_VOTES,
  INITIAL_AUDIT_LOGS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_NOTIFICATIONS
} from '../mockData';

interface AppContextType {
  // Navigation & User State
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentUser: Member;
  setCurrentUser: (member: Member) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  
  // Data
  teams: Team[];
  members: Member[];
  submissions: DailySubmission[];
  weeklyMatchup: WeeklyMatchup;
  votes: CommunityVote[];
  auditLogs: AuditLogEntry[];
  chatMessages: ChatMessage[];
  notifications: SystemNotification[];
  feedbacks: FeedbackSubmission[];

  // Actions
  addDailySubmission: (sub: Omit<DailySubmission, 'id' | 'status' | 'submittedAt'>) => void;
  approveSubmission: (id: string, notes?: string) => void;
  rejectSubmission: (id: string, reason: string) => void;
  unmaskProof: (submissionId: string, memberId: string, reason: string) => void;
  remaskProof: (submissionId: string) => void;
  sendInactivityAlert: (memberId: string) => void;
  toggleMemberDeactivation: (memberId: string) => void;
  updateMemberRole: (memberId: string, newRole: UserRole) => void;
  updateNotificationSettings: (memberId: string, push: boolean, email: boolean, time: string) => void;
  castVote: (voteId: string, optionId: string) => void;
  submitFeedback: (rating: number, comment: string, category: FeedbackSubmission['category']) => void;
  sendChatMessage: (text: string) => void;
  exportMembersCSV: () => void;
  triggerCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = '90x_league_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage if exists
  const [viewMode, setViewMode] = useState<ViewMode>('participant');
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });
  const [submissions, setSubmissions] = useState<DailySubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });
  const [weeklyMatchup, setWeeklyMatchup] = useState<WeeklyMatchup>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_matchup');
    return saved ? JSON.parse(saved) : INITIAL_MATCHUP;
  });
  const [votes, setVotes] = useState<CommunityVote[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_votes');
    return saved ? JSON.parse(saved) : INITIAL_VOTES;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([]);

  // Current logged in member
  const [currentUser, setCurrentUser] = useState<Member>(() => members[0] || INITIAL_MEMBERS[0]);
  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser.role);

  // Sync role when user changes
  useEffect(() => {
    if (currentUser) {
      setCurrentRole(currentUser.role);
    }
  }, [currentUser]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_teams', JSON.stringify(teams));
    localStorage.setItem(STORAGE_KEY + '_members', JSON.stringify(members));
    localStorage.setItem(STORAGE_KEY + '_submissions', JSON.stringify(submissions));
    localStorage.setItem(STORAGE_KEY + '_matchup', JSON.stringify(weeklyMatchup));
    localStorage.setItem(STORAGE_KEY + '_votes', JSON.stringify(votes));
    localStorage.setItem(STORAGE_KEY + '_audit', JSON.stringify(auditLogs));
    localStorage.setItem(STORAGE_KEY + '_chat', JSON.stringify(chatMessages));
    localStorage.setItem(STORAGE_KEY + '_notifs', JSON.stringify(notifications));
  }, [teams, members, submissions, weeklyMatchup, votes, auditLogs, chatMessages, notifications]);

  // Trigger celebratory confetti
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899']
    });
  };

  // Recalculate team scores and ranks based on members' average score (Fair Metric)
  const recalculateTeamScores = (currentMembers: Member[]) => {
    setTeams((prevTeams) => {
      const updated = prevTeams.map((team) => {
        const teamMembers = currentMembers.filter((m) => m.teamId === team.id && m.status !== 'inactive');
        const activeCount = teamMembers.filter((m) => m.status === 'active').length;
        const avgScore = teamMembers.length > 0
          ? Number((teamMembers.reduce((sum, m) => sum + m.averageScore, 0) / teamMembers.length).toFixed(1))
          : 0;

        return {
          ...team,
          membersCount: currentMembers.filter((m) => m.teamId === team.id).length,
          activeMembersCount: activeCount,
          averageScore: avgScore
        };
      });

      // Sort by average score descending to update ranks
      updated.sort((a, b) => b.averageScore - a.averageScore);
      return updated.map((t, idx) => ({ ...t, rank: idx + 1 }));
    });
  };

  // Add a daily submission
  const addDailySubmission = (subData: Omit<DailySubmission, 'id' | 'status' | 'submittedAt'>) => {
    const newSub: DailySubmission = {
      ...subData,
      id: 'sub-' + Date.now(),
      status: 'pending',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      proofIsMasked: true
    };

    setSubmissions((prev) => [newSub, ...prev]);

    // Send a message to chat
    const chatMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      senderName: subData.memberName,
      teamBadge: teams.find((t) => t.id === subData.teamId)?.badge || '⚡',
      teamName: subData.teamName,
      text: `أتممت تسجيل اليوم ${subData.dayNumber} بنجاح! 💪 بإجمالي ${subData.scoreBreakdown.totalScore} نقطة بانتظار الاعتماد.`,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, chatMsg]);
    triggerCelebration();
  };

  // Moderator approval
  const approveSubmission = (id: string, notes?: string) => {
    const sub = submissions.find((s) => s.id === id);
    if (!sub) return;

    const approverName = currentUser.name || 'المشرف';
    const approvedTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Update submission
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'approved',
              moderatorNotes: notes,
              approvedBy: approverName,
              approvedAt: approvedTime
            }
          : s
      )
    );

    // Update member stats
    setMembers((prevMembers) => {
      const updated = prevMembers.map((member) => {
        if (member.id === sub.memberId) {
          const newStreak = member.streak + 1;
          const newTotalSubmissions = member.totalSubmissions + 1;
          const newLongest = Math.max(member.longestStreak, newStreak);
          const newAvgScore = Number(
            ((member.averageScore * member.totalSubmissions + sub.scoreBreakdown.totalScore) / newTotalSubmissions).toFixed(1)
          );
          const newCompletion = Math.min(100, Math.round((newTotalSubmissions / 35) * 100));

          return {
            ...member,
            streak: newStreak,
            longestStreak: newLongest,
            totalSubmissions: newTotalSubmissions,
            averageScore: newAvgScore,
            completionRate: newCompletion,
            status: 'active' as const,
            daysInactive: 0,
            lastLogDate: new Date().toISOString().split('T')[0]
          };
        }
        return member;
      });

      recalculateTeamScores(updated);
      return updated;
    });

    // Add audit log
    const audit: AuditLogEntry = {
      id: 'log-' + Date.now(),
      timestamp: approvedTime,
      userId: currentUser.id,
      userName: `${approverName} (${currentRole})`,
      userRole: currentRole,
      action: 'APPROVE_SUBMISSION',
      targetMemberId: sub.memberId,
      targetMemberName: sub.memberName,
      targetSubmissionId: sub.id,
      reason: notes || 'تم التحقق من المهام واعتماد النقاط المستحقة'
    };
    setAuditLogs((prev) => [audit, ...prev]);

    // Update weekly matchup if relevant
    setWeeklyMatchup((prev) => {
      if (prev.teamA.id === sub.teamId) {
        return {
          ...prev,
          teamA: { ...prev.teamA, score: Number((prev.teamA.score + 0.3).toFixed(1)) }
        };
      }
      if (prev.teamB.id === sub.teamId) {
        return {
          ...prev,
          teamB: { ...prev.teamB, score: Number((prev.teamB.score + 0.3).toFixed(1)) }
        };
      }
      return prev;
    });
  };

  // Moderator reject
  const rejectSubmission = (id: string, reason: string) => {
    const sub = submissions.find((s) => s.id === id);
    if (!sub) return;

    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected', moderatorNotes: reason } : s))
    );

    // Audit log
    const audit: AuditLogEntry = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      userId: currentUser.id,
      userName: `${currentUser.name} (${currentRole})`,
      userRole: currentRole,
      action: 'REJECT_SUBMISSION',
      targetMemberId: sub.memberId,
      targetMemberName: sub.memberName,
      targetSubmissionId: sub.id,
      reason: reason || 'البيانات غير مكتملة أو الإثبات غير واضح'
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Privacy & Data Security: Unmask proof with mandatory audit logging
  const unmaskProof = (submissionId: string, memberId: string, reason: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, proofIsMasked: false } : s))
    );

    const targetMember = members.find((m) => m.id === memberId);
    const audit: AuditLogEntry = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: `${currentUser.name} (${currentRole})`,
      userRole: currentRole,
      action: 'UNMASK_PRIVATE_PROOF_IMAGE',
      targetMemberId: memberId,
      targetMemberName: targetMember?.name || 'مشارك',
      targetSubmissionId: submissionId,
      reason: reason || 'إلغاء تعتيم الصورة للتحقق الإشرافي والمراجعة'
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Remask proof after review
  const remaskProof = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, proofIsMasked: true } : s))
    );
  };

  // Send inactivity alert (automatic or manual at day 4+)
  const sendInactivityAlert = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const notif: SystemNotification = {
      id: 'notif-' + Date.now(),
      targetMemberId: memberId,
      title: 'تنبيه غياب وإشعار متابعة',
      message: `مرحباً ${member.name}، لقد مر أكثر من ${member.daysInactive} أيام دون تسجيل تقدمك. استمرارية فريقك ${member.teamName} في لوحة الدوري تعتمد على كل صوت ومهمة!`,
      type: 'warning',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };

    setNotifications((prev) => [notif, ...prev]);

    // Audit log
    const audit: AuditLogEntry = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: `${currentUser.name} (${currentRole})`,
      userRole: currentRole,
      action: 'SEND_INACTIVITY_ALERT',
      targetMemberId: memberId,
      targetMemberName: member.name,
      reason: `إرسال تنبيه تأخر (${member.daysInactive} أيام غير نشط)`
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Toggle member deactivation (e.g. at 15 days inactivity)
  const toggleMemberDeactivation = (memberId: string) => {
    setMembers((prev) => {
      const updated = prev.map((m) => {
        if (m.id === memberId) {
          const newStatus: Member['status'] = m.status === 'inactive' ? 'active' : 'inactive';
          return { ...m, status: newStatus };
        }
        return m;
      });
      recalculateTeamScores(updated);
      return updated;
    });

    const targetMember = members.find((m) => m.id === memberId);
    const audit: AuditLogEntry = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: currentUser.id,
      userName: `${currentUser.name} (${currentRole})`,
      userRole: currentRole,
      action: targetMember?.status === 'inactive' ? 'REACTIVATE_MEMBER_ACCOUNT' : 'DEACTIVATE_MEMBER_ACCOUNT',
      targetMemberId: memberId,
      targetMemberName: targetMember?.name || '',
      reason: 'تحديث حالة الحساب من لوحة الإشراف المركزية'
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Role update
  const updateMemberRole = (memberId: string, newRole: UserRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    if (currentUser.id === memberId) {
      setCurrentRole(newRole);
    }
  };

  // Notification settings
  const updateNotificationSettings = (memberId: string, push: boolean, email: boolean, time: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              pushNotifications: push,
              emailNotifications: email,
              reminderTime: time
            }
          : m
      )
    );
    if (currentUser.id === memberId) {
      setCurrentUser((prev) => ({
        ...prev,
        pushNotifications: push,
        emailNotifications: email,
        reminderTime: time
      }));
    }
  };

  // Cast vote in 10-day community poll
  const castVote = (voteId: string, optionId: string) => {
    setVotes((prevVotes) =>
      prevVotes.map((vote) => {
        if (vote.id === voteId) {
          if (vote.userVotedOptionId) return vote; // already voted
          const updatedOptions = vote.options.map((opt) =>
            opt.id === optionId ? { ...opt, votesCount: opt.votesCount + 1 } : opt
          );
          return {
            ...vote,
            userVotedOptionId: optionId,
            totalVotes: vote.totalVotes + 1,
            options: updatedOptions
          };
        }
        return vote;
      })
    );
    triggerCelebration();
  };

  // Submit floating feedback
  const submitFeedback = (rating: number, comment: string, category: FeedbackSubmission['category']) => {
    const newFb: FeedbackSubmission = {
      id: 'fb-' + Date.now(),
      memberId: currentUser.id,
      memberName: currentUser.name,
      rating,
      comment,
      category,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setFeedbacks((prev) => [newFb, ...prev]);
  };

  // Send message in live chat
  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    const userTeam = teams.find((t) => t.id === currentUser.teamId);
    const msg: ChatMessage = {
      id: 'chat-' + Date.now(),
      senderName: currentUser.name,
      senderRole: currentRole,
      teamBadge: userTeam?.badge || '✨',
      teamName: userTeam?.name,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      isModeratorNote: currentRole === 'moderator' || currentRole === 'admin'
    };
    setChatMessages((prev) => [...prev, msg]);
  };

  // Export members CSV (US-020)
  const exportMembersCSV = () => {
    const headers = ['المعرف', 'الاسم', 'الفريق', 'الدور', 'الحالة', 'سلسلة الالتزام', 'نسبة الإنجاز', 'متوسط النقاط', 'آخر تسجيل', 'أيام الانقطاع'];
    const rows = members.map((m) => [
      m.id,
      `"${m.name}"`,
      `"${m.teamName}"`,
      m.role,
      m.status,
      m.streak,
      `${m.completionRate}%`,
      m.averageScore,
      m.lastLogDate,
      m.daysInactive
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `90x_league_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        currentUser,
        setCurrentUser,
        currentRole,
        setCurrentRole,
        teams,
        members,
        submissions,
        weeklyMatchup,
        votes,
        auditLogs,
        chatMessages,
        notifications,
        feedbacks,
        addDailySubmission,
        approveSubmission,
        rejectSubmission,
        unmaskProof,
        remaskProof,
        sendInactivityAlert,
        toggleMemberDeactivation,
        updateMemberRole,
        updateNotificationSettings,
        castVote,
        submitFeedback,
        sendChatMessage,
        exportMembersCSV,
        triggerCelebration
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
