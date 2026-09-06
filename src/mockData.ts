import {
  Team,
  Member,
  DailySubmission,
  WeeklyMatchup,
  AuditLogEntry,
  CommunityVote,
  ChatMessage,
  SystemNotification
} from './types';

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'صقور العزيمة',
    badge: '🦅',
    color: 'from-amber-500 to-orange-600',
    motto: 'الانضباط يصنع المستحيل',
    membersCount: 8,
    activeMembersCount: 7,
    averageScore: 92.4,
    totalCompletedTasks: 412,
    currentPhase: 2, // Acceleration phase (day 31-60)
    phaseProgress: 65,
    rank: 1,
    weeklyPoints: 648
  },
  {
    id: 'team-2',
    name: 'همة بلا حدود',
    badge: '⚡',
    color: 'from-emerald-500 to-teal-600',
    motto: 'كل يوم خطوة للأمام',
    membersCount: 6,
    activeMembersCount: 6,
    averageScore: 89.8,
    totalCompletedTasks: 380,
    currentPhase: 2,
    phaseProgress: 58,
    rank: 2,
    weeklyPoints: 538
  },
  {
    id: 'team-3',
    name: 'رواد التميز',
    badge: '🏆',
    color: 'from-blue-500 to-indigo-600',
    motto: 'الاستمرارية سر الانتصار',
    membersCount: 10,
    activeMembersCount: 8,
    averageScore: 85.1,
    totalCompletedTasks: 460,
    currentPhase: 2,
    phaseProgress: 42,
    rank: 3,
    weeklyPoints: 680
  },
  {
    id: 'team-4',
    name: 'فرسان 90X',
    badge: '🛡️',
    color: 'from-purple-500 to-violet-600',
    motto: 'قوة في الاتحاد والعزم',
    membersCount: 7,
    activeMembersCount: 5,
    averageScore: 81.3,
    totalCompletedTasks: 295,
    currentPhase: 1, // Foundation phase
    phaseProgress: 88,
    rank: 4,
    weeklyPoints: 488
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    name: 'سلطان الناصر',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'participant',
    teamId: 'team-1',
    teamName: 'صقور العزيمة',
    streak: 34,
    longestStreak: 34,
    totalSubmissions: 34,
    completionRate: 97,
    averageScore: 94.5,
    status: 'active',
    lastLogDate: '2026-09-06',
    daysInactive: 0,
    currentDay: 35,
    joinedDate: '2026-08-01',
    reminderTime: '20:30',
    pushNotifications: true,
    emailNotifications: true,
    baselineScore: 60,
    goalSummary: 'إتقان روتين صباحي، قراءة 30 دقيقة يومياً، وتطوير مهارة البرمجة'
  },
  {
    id: 'mem-2',
    name: 'فيصل القحطاني',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    role: 'participant',
    teamId: 'team-1',
    teamName: 'صقور العزيمة',
    streak: 29,
    longestStreak: 29,
    totalSubmissions: 31,
    completionRate: 91,
    averageScore: 91.2,
    status: 'active',
    lastLogDate: '2026-09-06',
    daysInactive: 0,
    currentDay: 35,
    joinedDate: '2026-08-01',
    reminderTime: '21:00',
    pushNotifications: true,
    emailNotifications: false,
    baselineScore: 55,
    goalSummary: 'تخفيض الوزن 8 كجم والالتزام بالمشي 10 آلاف خطوة يومياً'
  },
  {
    id: 'mem-3',
    name: 'نورة السالم',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'moderator',
    teamId: 'team-2',
    teamName: 'همة بلا حدود',
    streak: 33,
    longestStreak: 33,
    totalSubmissions: 33,
    completionRate: 98,
    averageScore: 96.0,
    status: 'active',
    lastLogDate: '2026-09-06',
    daysInactive: 0,
    currentDay: 35,
    joinedDate: '2026-08-01',
    reminderTime: '20:00',
    pushNotifications: true,
    emailNotifications: true,
    baselineScore: 70,
    goalSummary: 'إنهاء مشروع التخرج والتدريب على مهارات القيادة'
  },
  {
    id: 'mem-4',
    name: 'عبدالرحمن الدوسري',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'participant',
    teamId: 'team-2',
    teamName: 'همة بلا حدود',
    streak: 18,
    longestStreak: 22,
    totalSubmissions: 28,
    completionRate: 85,
    averageScore: 84.6,
    status: 'active',
    lastLogDate: '2026-09-05',
    daysInactive: 1,
    currentDay: 35,
    joinedDate: '2026-08-01',
    reminderTime: '21:30',
    pushNotifications: true,
    emailNotifications: false,
    baselineScore: 50,
    goalSummary: 'الاستيقاظ قبل الفجر والعمل المركز ساعتين يومياً'
  },
  {
    id: 'mem-5',
    name: 'خالد المطيري',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'participant',
    teamId: 'team-3',
    teamName: 'رواد التميز',
    streak: 0,
    longestStreak: 12,
    totalSubmissions: 19,
    completionRate: 61,
    averageScore: 72.0,
    status: 'lagging', // Flagged at 4+ days of missed log
    lastLogDate: '2026-09-01',
    daysInactive: 5,
    currentDay: 35,
    joinedDate: '2026-08-01',
    reminderTime: '20:00',
    pushNotifications: true,
    emailNotifications: true,
    baselineScore: 45,
    goalSummary: 'تنظيم إدارة الوقت والحد من استخدام الهاتف'
  },
  {
    id: 'mem-6',
    name: 'سارة الشمري',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'participant',
    teamId: 'team-4',
    teamName: 'فرسان 90X',
    streak: 0,
    longestStreak: 9,
    totalSubmissions: 11,
    completionRate: 35,
    averageScore: 58.0,
    status: 'inactive', // More than 15 days inactive -> auto deactivation candidate
    lastLogDate: '2026-08-20',
    daysInactive: 17,
    currentDay: 35,
    joinedDate: '2026-08-01',
    reminderTime: '19:00',
    pushNotifications: false,
    emailNotifications: false,
    baselineScore: 40,
    goalSummary: 'القراءة والكتابة اليومية'
  }
];

export const INITIAL_SUBMISSIONS: DailySubmission[] = [
  {
    id: 'sub-1',
    memberId: 'mem-1',
    memberName: 'سلطان الناصر',
    teamId: 'team-1',
    teamName: 'صقور العزيمة',
    date: '2026-09-06',
    dayNumber: 35,
    tasks: [
      { id: 't-1', title: 'جلسة تركيز برمجي ساعتين (Deep Work)', completed: true },
      { id: 't-2', title: 'ممارسة الرياضة الصباحية 45 دقيقة', completed: true },
      { id: 't-3', title: 'قراءة 20 صفحة من كتاب القيادة', completed: true }
    ],
    reflection: 'اليوم شعرت بطاقة عالية جداً، التركيز كان 10/10 والتمارين الرياضية أعطتني حافز كبير للمواصلة.',
    scoreBreakdown: {
      tasksScore: 40,
      consistencyScore: 30,
      improvementScore: 18,
      engagementScore: 10,
      totalScore: 98
    },
    proofImageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&auto=format&fit=crop&q=80',
    proofBlurredUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&auto=format&fit=crop&q=10&blur=20',
    proofIsMasked: true,
    status: 'pending',
    submittedAt: '2026-09-06 18:30'
  },
  {
    id: 'sub-2',
    memberId: 'mem-2',
    memberName: 'فيصل القحطاني',
    teamId: 'team-1',
    teamName: 'صقور العزيمة',
    date: '2026-09-06',
    dayNumber: 35,
    tasks: [
      { id: 't-4', title: 'إكمال 10,000 خطوة قبل الغروب', completed: true },
      { id: 't-5', title: 'شرب 3 لترات ماء وتناول وجبة صحية', completed: true },
      { id: 't-6', title: 'النوم قبل الساعة 11 مساءً', completed: false }
    ],
    reflection: 'حققت هدف الخطوات وتجاوزته بـ 12,000 خطوة، تأخرت قليلاً في موعد النوم ولكن التقدم ملحوظ.',
    scoreBreakdown: {
      tasksScore: 30,
      consistencyScore: 30,
      improvementScore: 16,
      engagementScore: 9,
      totalScore: 85
    },
    proofImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    proofBlurredUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=10&blur=20',
    proofIsMasked: true,
    status: 'approved',
    submittedAt: '2026-09-06 19:15',
    approvedBy: 'نورة السالم',
    approvedAt: '2026-09-06 19:40',
    moderatorNotes: 'أداء ممتاز يا فيصل، استمرارية مبهرة!'
  },
  {
    id: 'sub-3',
    memberId: 'mem-4',
    memberName: 'عبدالرحمن الدوسري',
    teamId: 'team-2',
    teamName: 'همة بلا حدود',
    date: '2026-09-05',
    dayNumber: 34,
    tasks: [
      { id: 't-7', title: 'استيقاظ باكر الساعة 5 صباحاً', completed: true },
      { id: 't-8', title: 'كتابة اليوميات والتخطيط لليوم', completed: true }
    ],
    reflection: 'عدت للالتزام بعد يوم ضغط عمل. دعم المجموعة ساعدني كثيراً في عدم كسر السلسلة.',
    scoreBreakdown: {
      tasksScore: 35,
      consistencyScore: 25,
      improvementScore: 15,
      engagementScore: 10,
      totalScore: 85
    },
    proofImageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&auto=format&fit=crop&q=80',
    proofBlurredUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&auto=format&fit=crop&q=10&blur=20',
    proofIsMasked: true,
    status: 'approved',
    submittedAt: '2026-09-05 21:00',
    approvedBy: 'نورة السالم',
    approvedAt: '2026-09-05 21:20'
  }
];

export const INITIAL_MATCHUP: WeeklyMatchup = {
  id: 'match-week-5',
  weekNumber: 5,
  title: 'المواجهة الكبرى للأسبوع الخامس: معركة الصدارة',
  startDate: '2026-09-01',
  endDate: '2026-09-07',
  teamA: {
    id: 'team-1',
    name: 'صقور العزيمة',
    badge: '🦅',
    score: 92.4,
    membersActive: 7
  },
  teamB: {
    id: 'team-2',
    name: 'همة بلا حدود',
    badge: '⚡',
    score: 89.8,
    membersActive: 6
  },
  status: 'active'
};

export const INITIAL_VOTES: CommunityVote[] = [
  {
    id: 'vote-1',
    title: 'تحدي الأسبوع السادس المجتمعي (ينتهي خلال 10 أيام)',
    description: 'اختر التحدي الإضافي الذي ستتنافس عليه الفرق لزيادة نقاط الالتزام والتفاعل في البث المباشر القادم:',
    category: 'فعاليات الأسبوع',
    startDate: '2026-09-01',
    endDate: '2026-09-10',
    remainingDays: 4,
    totalVotes: 48,
    isOpen: true,
    userVotedOptionId: undefined,
    options: [
      { id: 'opt-1', text: 'ساعة الصمت الرقمي المسائي (Digital Sunset)', votesCount: 22 },
      { id: 'opt-2', text: 'تحدي المشي الجماعي 10,000 خطوة يومياً', votesCount: 16 },
      { id: 'opt-3', text: 'تلخيص يومي لكتاب ملهم في سطرين', votesCount: 10 }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-06 17:10:22',
    userId: 'mem-3',
    userName: 'نورة السالم (مشرف)',
    userRole: 'moderator',
    action: 'UNMASK_PHOTO_VERIFICATION',
    targetMemberId: 'mem-2',
    targetMemberName: 'فيصل القحطاني',
    targetSubmissionId: 'sub-2',
    reason: 'التحقق من إثبات المشي والخطوات لاعتماد النقاط'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-06 14:05:00',
    userId: 'admin-sys',
    userName: 'مدير النظام',
    userRole: 'admin',
    action: 'FLAG_INACTIVE_USER_DAY_4',
    targetMemberId: 'mem-5',
    targetMemberName: 'خالد المطيري',
    reason: 'تنبيه تلقائي بعد انقطاع 4 أيام عن التسجيل'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-05 21:20:10',
    userId: 'mem-3',
    userName: 'نورة السالم (مشرف)',
    userRole: 'moderator',
    action: 'APPROVE_SUBMISSION',
    targetMemberId: 'mem-4',
    targetMemberName: 'عبدالرحمن الدوسري',
    targetSubmissionId: 'sub-3',
    reason: 'اعتماد تسجيل اليوم 34 بنجاح'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'chat-1',
    senderName: 'سلطان الناصر',
    teamBadge: '🦅',
    teamName: 'صقور العزيمة',
    text: 'يا أبطال الصقور، اليوم حققنا 98 نقطة، نحتاج شد الحيل لحسم مواجهة هذا الأسبوع! 🔥',
    timestamp: '18:42'
  },
  {
    id: 'chat-2',
    senderName: 'نورة السالم',
    senderRole: 'moderator',
    teamBadge: '⚡',
    teamName: 'همة بلا حدود',
    text: 'همة بلا حدود لا تستسلم أبداً! الفارق نقطتين فقط وسنقلب الطاولة في بث الليلة ⚡💪',
    timestamp: '18:45',
    isModeratorNote: true
  },
  {
    id: 'chat-3',
    senderName: 'فيصل القحطاني',
    teamBadge: '🦅',
    teamName: 'صقور العزيمة',
    text: 'تم إنجاز 12 ألف خطوة، موعدنا الليلة على بث تيك توك المباشر مع الكابتن 🏆',
    timestamp: '19:16'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    targetMemberId: 'mem-5',
    title: 'تنبيه عدم تسجيل (4 أيام)',
    message: 'مرت 4 أيام دون تسجيل تقدمك اليومي. فريقك ينتظرك ومجموعتك تحتاج دعمك للارتقاء في الترتيب!',
    type: 'warning',
    createdAt: '2026-09-05 10:00',
    read: false
  },
  {
    id: 'notif-2',
    title: 'تحدي المواجهة الأسبوعية مشتعل!',
    message: 'فريق صقور العزيمة يتقدم بفارق ضئيل عن فريق همة بلا حدود قبل نهاية الأسبوع.',
    type: 'cheer',
    createdAt: '2026-09-06 12:00',
    read: false
  }
];
