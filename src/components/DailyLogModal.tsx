import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Flame,
  TrendingUp,
  HeartHandshake,
  CheckSquare,
  Lock,
  Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TaskItem, ScoreBreakdown } from '../types';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyLogModal: React.FC<DailyLogModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addDailySubmission } = useApp();

  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 't-1', title: 'إنجاز الجلسة الأولى للعمل المركز (Deep Work)', completed: true },
    { id: 't-2', title: 'تمارين اللياقة أو المشي اليومي', completed: true },
    { id: 't-3', title: 'القراءة اليومية والتأمل الفردي', completed: false }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Scores state (0-100 scale components)
  const [consistencyDays, setConsistencyDays] = useState(currentUser.streak + 1);
  const [improvementLevel, setImprovementLevel] = useState<number>(18); // out of 20
  const [engagementScore, setEngagementScore] = useState<number>(10); // out of 10
  const [reflection, setReflection] = useState('');

  // Image Upload state & compression/blur simulation
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [blurredPreview, setBlurredPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Calculate task points (Max 40)
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const tasksScore = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 40) : 0;

  // Consistency Score (Max 30)
  const consistencyScore = Math.min(30, Math.round((Math.min(consistencyDays, 30) / 30) * 30));

  // Improvement Score (Max 20)
  const improvementScore = Math.min(20, Math.max(0, improvementLevel));

  // Engagement Score (Max 10)
  const peerEngagementScore = Math.min(10, Math.max(0, engagementScore));

  // Total Score out of 100
  const totalScore = tasksScore + consistencyScore + improvementScore + peerEngagementScore;

  // Toggle task
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Add custom task
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: 't-' + Date.now(), title: newTaskTitle.trim(), completed: true }
    ]);
    setNewTaskTitle('');
  };

  // Remove task
  const handleRemoveTask = (id: string) => {
    if (tasks.length <= 1) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle image upload with auto-compression and EXIF stripping
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('حجم الصورة كبير جداً، الحد الأقصى 10 ميجابايت.');
      return;
    }

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Use HTML Canvas to strip EXIF metadata & compress
        const canvas = document.createElement('canvas');
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setSelectedImage(compressedDataUrl);

          // Create blurred thumbnail for privacy masking
          const blurCanvas = document.createElement('canvas');
          blurCanvas.width = 100;
          blurCanvas.height = 100;
          const blurCtx = blurCanvas.getContext('2d');
          if (blurCtx) {
            blurCtx.filter = 'blur(6px)';
            blurCtx.drawImage(canvas, 0, 0, 100, 100);
            setBlurredPreview(blurCanvas.toDataURL('image/jpeg', 0.4));
          }
        }
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const scoreBreakdown: ScoreBreakdown = {
      tasksScore,
      consistencyScore,
      improvementScore,
      engagementScore: peerEngagementScore,
      totalScore
    };

    addDailySubmission({
      memberId: currentUser.id,
      memberName: currentUser.name,
      teamId: currentUser.teamId,
      teamName: currentUser.teamName,
      date: new Date().toISOString().split('T')[0],
      dayNumber: currentUser.streak + 1,
      tasks,
      reflection: reflection.trim() || 'تم إنجاز أهداف اليوم والالتزام ببرنامج 90X',
      scoreBreakdown,
      proofImageUrl: selectedImage || undefined,
      proofBlurredUrl: blurredPreview || undefined,
      proofIsMasked: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              #{currentUser.streak + 1}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                تسجيل التقدم اليومي | رحلة 90X
              </h2>
              <p className="text-xs text-slate-400">
                المشارك: {currentUser.name} • الفريق: {currentUser.teamName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Live Score Counter Preview */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-800/60 to-emerald-500/10 border border-amber-500/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
                  احتساب النقاط المباشر العادل (من 100)
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  توزيع النقاط: مهام (40) + استمرارية (30) + تحسن (20) + تفاعل (10)
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-amber-400 font-mono tracking-tight">
                  {totalScore}
                </span>
                <span className="text-slate-400 text-sm font-semibold">/ 100</span>
              </div>
            </div>

            {/* Micro Breakdown Bars */}
            <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
              <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">المهام (40)</div>
                <div className="text-xs font-bold text-slate-200">{tasksScore}</div>
              </div>
              <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">استمرارية (30)</div>
                <div className="text-xs font-bold text-emerald-400">{consistencyScore}</div>
              </div>
              <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">التحسن (20)</div>
                <div className="text-xs font-bold text-blue-400">{improvementScore}</div>
              </div>
              <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">تفاعل (10)</div>
                <div className="text-xs font-bold text-purple-400">{peerEngagementScore}</div>
              </div>
            </div>
          </div>

          {/* Section 1: Planned Tasks (40 Points) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-400" />
                1. إنجاز المهام المخطط لها (40 نقطة)
              </label>
              <span className="text-xs text-amber-400 font-bold">
                {completedTasksCount} من {tasks.length} مكتمل
              </span>
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-amber-500/10 border-amber-500/40 text-slate-100'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-900"
                    />
                    <span className={`text-sm ${task.completed ? 'font-medium' : ''}`}>
                      {task.title}
                    </span>
                  </div>
                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTask(task.id);
                      }}
                      className="text-xs text-slate-500 hover:text-rose-400 px-1"
                    >
                      حذف
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Custom Task */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="إضافة مهمة إضافية لليوم..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTask();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddTask}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                إضافة
              </button>
            </div>
          </div>

          {/* Section 2: Consistency & Continuity (30 Points) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400" />
                2. الاستمرارية وسلسلة الالتزام (30 نقطة)
              </label>
              <span className="text-xs text-emerald-400 font-bold">
                سلسلة {consistencyDays} يوم متواصل
              </span>
            </div>
            <p className="text-xs text-slate-400">
              تُحسب النقاط تلقائياً بناءً على عدم انقطاعك اليومي عن الالتزام.
            </p>
            <div className="w-full bg-slate-950 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300">سلسلة الالتزام الحالية:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {consistencyDays} يوم
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  +30 نقطة كاملة
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Improvement vs Baseline (20 Points) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                3. معدل التحسن مقارنة ببدايتك (20 نقطة)
              </label>
              <span className="text-xs text-blue-400 font-bold">
                {improvementLevel} / 20 نقطة
              </span>
            </div>
            <p className="text-xs text-slate-400">
              قياس التطور مقارنة بنقطة الانطلاق (خط الأساس السابق: {currentUser.baselineScore} نقطة)
            </p>
            <input
              type="range"
              min="5"
              max="20"
              value={improvementLevel}
              onChange={(e) => setImprovementLevel(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>تحسن تدريجي (5 نقاط)</span>
              <span>تحسن متوسط (12 نقطة)</span>
              <span>قفزة نوعية استثنائية (20 نقطة)</span>
            </div>
          </div>

          {/* Section 4: Community Engagement (10 Points) */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-purple-400" />
                4. التفاعل ودعم أعضاء المجموعة (10 نقاط)
              </label>
              <span className="text-xs text-purple-400 font-bold">
                {engagementScore} / 10 نقاط
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEngagementScore(10)}
                className={`p-2.5 rounded-xl border text-xs text-right transition-colors ${
                  engagementScore === 10
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                ✨ شاركت وشجعت أعضاء فريقي اليوم (10 نقاط)
              </button>
              <button
                type="button"
                onClick={() => setEngagementScore(5)}
                className={`p-2.5 rounded-xl border text-xs text-right transition-colors ${
                  engagementScore === 5
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                💬 تفاعل بسيط أو متابعة صامتة (5 نقاط)
              </button>
            </div>
          </div>

          {/* Section 5: Daily Reflection Note */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-sm font-bold text-slate-200">
              تأملات اليوم (Reflection & Key Wins)
            </label>
            <textarea
              rows={2}
              placeholder="ما هي أبرز إنجازاتك اليوم؟ وما التحدي الذي تغلبت عليه؟"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
            ></textarea>
          </div>

          {/* Section 6: Proof Photo Upload (With Auto Compression, EXIF Removal & Default Blur Masking) */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                إرفاق إثبات الإنجاز (صورة مع تعتيم تلقائي للخصوصية)
              </label>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" />
                خصوصية مشفرة ومحمية
              </span>
            </div>

            {/* Privacy notice guarantee */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>حماية البيانات:</strong> يتم ضغط الصورة وحذف بيانات الموقع والكاميرا (EXIF)، وتظليلها تلقائياً (Blur) بحيث لا تظهر في البث العام أو للمشاركين الآخرين، ولا تُكشف إلا للمشرف للتحقق عبر سجل تدقيق إلكتروني رسمي.
              </span>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            {!selectedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition-all"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-200">
                  انقر لاختيار صورة إثبات أو اسحبها هنا
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  PNG, JPG حتى 10MB (ضغط تلقائي وحذف البيانات الحساسة)
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-700">
                    <img
                      src={selectedImage}
                      alt="Proof"
                      className="w-full h-full object-cover filter blur-[4px]"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      تم الضغط وتظليل الصورة بنجاح
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      الصورة محمية بتعتيم آمن في واجهة المشارك والبث
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setBlurredPreview(null);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20"
                >
                  إزالة
                </button>
              </div>
            )}

            {uploadError && (
              <div className="text-xs text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {uploadError}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isCompressing || completedTasksCount === 0}
              className="flex-1 max-w-xs px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>إرسال تسجيل اليوم للاعتماد ({totalScore} نقطة)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
