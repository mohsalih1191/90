export type UserRole = 'participant' | 'moderator' | 'admin';

export type ViewMode = 'participant' | 'moderator' | 'stream';

export type MemberStatus = 'active' | 'lagging' | 'inactive';

export interface ScoreBreakdown {
  tasksScore: number;       // max 40 pts
  consistencyScore: number; // max 30 pts
  improvementScore: number; // max 20 pts
  engagementScore: number;  // max 10 pts
  totalScore: number;       // max 100 pts
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface DailySubmission {
  id: string;
  memberId: string;
  memberName: string;
  teamId: string;
  teamName: string;
  date: string; // YYYY-MM-DD
  dayNumber: number; // e.g. Day 24 of 90
  tasks: TaskItem[];
  reflection: string;
  scoreBreakdown: ScoreBreakdown;
  proofImageUrl?: string;
  proofBlurredUrl?: string;
  proofIsMasked: boolean;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  moderatorNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  teamId: string;
  teamName: string;
  streak: number; // current consecutive days
  longestStreak: number;
  totalSubmissions: number;
  completionRate: number; // percentage 0-100
  averageScore: number; // 0-100
  status: MemberStatus;
  lastLogDate: string;
  daysInactive: number;
  currentDay: number;
  joinedDate: string;
  reminderTime: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  baselineScore: number;
  goalSummary: string;
}

export interface Team {
  id: string;
  name: string;
  badge: string;
  color: string;
  motto: string;
  membersCount: number;
  averageScore: number; // fair team score = average of members
  totalCompletedTasks: number;
  currentPhase: number; // 1: Foundation (1-30), 2: Acceleration (31-60), 3: Mastery (61-90)
  phaseProgress: number; // 0-100%
  rank: number;
  weeklyPoints: number;
  activeMembersCount: number;
}

export interface WeeklyMatchup {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  teamA: {
    id: string;
    name: string;
    badge: string;
    score: number;
    membersActive: number;
  };
  teamB: {
    id: string;
    name: string;
    badge: string;
    score: number;
    membersActive: number;
  };
  title: string;
  status: 'active' | 'concluded';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetMemberId?: string;
  targetMemberName?: string;
  targetSubmissionId?: string;
  reason?: string;
  ipAddress?: string;
}

export interface CommunityVote {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  remainingDays: number;
  options: {
    id: string;
    text: string;
    votesCount: number;
  }[];
  userVotedOptionId?: string;
  totalVotes: number;
  isOpen: boolean;
}

export interface FeedbackSubmission {
  id: string;
  memberId: string;
  memberName: string;
  rating: number; // 1-5
  comment: string;
  category: 'stream' | 'challenge' | 'moderation' | 'general';
  submittedAt: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole?: UserRole;
  teamBadge?: string;
  teamName?: string;
  text: string;
  timestamp: string;
  isModeratorNote?: boolean;
}

export interface SystemNotification {
  id: string;
  targetMemberId?: string;
  title: string;
  message: string;
  type: 'warning' | 'alert' | 'cheer' | 'system';
  createdAt: string;
  read: boolean;
}
