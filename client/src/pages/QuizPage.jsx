import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  AlertCircle,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';
import { getQuiz, submitQuiz } from '../services/quizService';

const CATEGORY_COLORS = {
  crypto_fundamentals: {
    badge: 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30',
    bar: '#00D4FF',
  },
  market_basics: {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    bar: '#F59E0B',
  },
  trading_fundamentals: {
    badge: 'bg-[#00F59B]/10 text-[#00F59B] border-[#00F59B]/30',
    bar: '#00F59B',
  },
  risk_management: {
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    bar: '#EF4444',
  },
  trading_discipline: {
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    bar: '#A855F7',
  },
};

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const fetchQuizData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setResult(null);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);

      const res = await getQuiz(quizId);
      if (res && res.data) {
        setQuiz(res.data);
      } else {
        throw new Error('Quiz not found');
      }
    } catch (err) {
      if (
        err.message &&
        (err.message.includes('not found') || err.message.includes('404'))
      ) {
        setNotFound(true);
      } else {
        setError(err.message || 'Failed to load quiz.');
      }
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleSelectOption = (questionId, optionId) => {
    if (result || submitting) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (submitting || !quiz) return;
    try {
      setSubmitting(true);
      const answersPayload = (quiz.questions || []).map((q) => ({
        questionId: q.id,
        selectedOptionId: selectedAnswers[q.id] || null,
      }));

      const res = await submitQuiz(quiz.id, answersPayload);
      if (res && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  // 404 State
  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center" data-testid="quiz-not-found">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 font-display">Quiz Not Found</h1>
        <p className="text-slate-400 mb-6 text-sm max-w-md mx-auto">
          The requested quiz could not be found. It may have been moved or does not exist.
        </p>
        <Link
          to="/learn"
          data-testid="not-found-back-link"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-sm font-medium border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learn Catalog
        </Link>
      </div>
    );
  }

  // Error State
  if (error && !quiz) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-1">Failed to Load Quiz</h2>
          <p className="text-sm text-slate-300 mb-4">{error}</p>
          <button
            onClick={fetchQuizData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium border border-white/15 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading || !quiz) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse py-6">
        <div className="h-6 w-36 bg-white/10 rounded" />
        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
          <div className="h-8 w-2/3 bg-white/10 rounded" />
          <div className="h-4 w-1/2 bg-white/5 rounded" />
        </div>
        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
          <div className="h-6 w-full bg-white/10 rounded" />
          <div className="h-12 w-full bg-white/5 rounded-xl" />
          <div className="h-12 w-full bg-white/5 rounded-xl" />
          <div className="h-12 w-full bg-white/5 rounded-xl" />
          <div className="h-12 w-full bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  const categoryStyle = CATEGORY_COLORS[quiz.category] || {
    badge: 'bg-white/10 text-slate-300 border-white/20',
    bar: '#00D4FF',
  };

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const totalQuestions = questions.length || 5;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to={quiz.lessonId ? `/learn/${quiz.lessonId}` : '/learn'}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>{quiz.lessonId ? 'Back to Lesson' : 'Back to Learn'}</span>
        </Link>
        <Link
          to="/learn"
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          All Lessons
        </Link>
      </div>

      {/* Quiz Header */}
      <div
        className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden"
        data-testid="quiz-header"
      >
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: categoryStyle.bar }}
        />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryStyle.badge}`}
          >
            {quiz.categoryLabel || quiz.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/[0.06] text-slate-300 border border-white/[0.08]">
            {quiz.difficulty || 'BEGINNER'}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>{quiz.estimatedMinutes || 3} min assessment</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-2 tracking-tight">
          {quiz.title}
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          {quiz.description}
        </p>
      </div>

      {/* RESULT VIEW (Post-submission) */}
      {result ? (
        <div className="space-y-6" data-testid="quiz-result-card">
          {/* Score & Pass/Review Banner */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-xl ${
              result.passed
                ? 'bg-emerald-950/30 border-[#00F59B]/30'
                : 'bg-amber-950/30 border-amber-500/30'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Assessment Result
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-0.5 font-display" data-testid="quiz-score-display">
                  Score: {result.score} / {result.totalQuestions} ({result.percentage}%)
                </h2>
              </div>

              {/* Status Badge */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${
                  result.passed
                    ? 'bg-[#00F59B]/15 text-[#00F59B] border-[#00F59B]/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}
              >
                {result.passed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-[#00F59B]" />
                    <span>Passed (80%+)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <span>Review Needed (&lt;80%)</span>
                  </>
                )}
              </div>
            </div>

            {/* Explanatory message */}
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {result.passed
                ? 'Excellent work! You demonstrated solid understanding of these foundational concepts.'
                : 'Keep learning — review the lesson material below to strengthen your understanding, then try again.'}
            </p>

            {/* Learning XP Banner */}
            <div
              className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs"
              data-testid="quiz-xp-display"
            >
              <div className="flex items-center gap-2 text-slate-300">
                <Sparkles className="w-4 h-4 text-[#00F59B]" />
                <span>
                  {result.earnedXp > 0
                    ? `+${result.earnedXp} Learning XP awarded for passing this quiz!`
                    : result.passed
                    ? 'Quiz already completed previously · +0 XP'
                    : 'Pass with 80% or higher to earn 100 Learning XP.'}
                </span>
              </div>
              <div className="font-mono text-slate-400 font-medium">
                Total XP: <span className="text-white font-bold">{result.totalXp} XP</span>
              </div>
            </div>
          </div>

          {/* Question-by-Question Detailed Review with Explanations */}
          <div className="space-y-4" data-testid="quiz-explanations">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 px-1">
              Question-by-Question Review
            </h3>

            {(result.explanations || []).map((exp, idx) => {
              const fullQ = questions.find((q) => q.id === exp.questionId) || {};
              const selectedOpt = fullQ.options?.find((o) => o.id === exp.selectedOptionId);
              const correctOpt = fullQ.options?.find((o) => o.id === exp.correctOptionId);

              return (
                <div
                  key={exp.questionId}
                  className={`p-6 rounded-2xl bg-slate-900/60 border ${
                    exp.isCorrect
                      ? 'border-[#00F59B]/20'
                      : 'border-rose-500/20'
                  } backdrop-blur-xl space-y-3`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-400">
                      Question {idx + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        exp.isCorrect
                          ? 'bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {exp.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Incorrect
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-white">
                    {fullQ.question}
                  </p>

                  <div className="text-xs space-y-1 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Your answer:</span>
                      <span
                        className={`font-medium ${
                          exp.isCorrect ? 'text-[#00F59B]' : 'text-rose-400'
                        }`}
                      >
                        {selectedOpt ? selectedOpt.text : '(Unanswered)'}
                      </span>
                    </div>

                    {!exp.isCorrect && correctOpt && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Correct answer:</span>
                        <span className="text-emerald-400 font-medium">
                          {correctOpt.text}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Educational Explanation */}
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300 leading-relaxed mt-2">
                    <span className="text-slate-400 font-semibold block mb-0.5">
                      Explanation:
                    </span>
                    {exp.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Navigation & Actions */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleRetry}
              data-testid="retry-quiz-btn"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs sm:text-sm font-semibold border border-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>

            <div className="flex items-center gap-2 ml-auto">
              {quiz.lessonId && (
                <Link
                  to={`/learn/${quiz.lessonId}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs sm:text-sm font-semibold border border-white/10 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Review Lesson</span>
                </Link>
              )}
              <Link
                to="/learn"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00F59B]/90 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-[#00F59B]/20 transition-colors"
              >
                <span>Continue Learning</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* INTERACTIVE QUESTION RUNNER (Pre-submission) */
        <div className="space-y-6">
          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl">
            {/* Question Step Indicator & Mini Navigator */}
            <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-white/[0.06]">
              <div>
                <span
                  className="text-xs font-medium text-slate-400"
                  data-testid="question-indicator"
                >
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-xs text-slate-500 ml-2">
                  ({answeredCount} of {totalQuestions} answered)
                </span>
              </div>

              {/* Step indicator dots */}
              <div className="flex items-center gap-1.5">
                {questions.map((q, idx) => {
                  const isAnswered = Boolean(selectedAnswers[q.id]);
                  const isCurrent = idx === currentQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        isCurrent
                          ? 'w-6 bg-[#00F59B]'
                          : isAnswered
                          ? 'w-2 bg-[#00D4FF]'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Jump to question ${idx + 1}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Question Text */}
            <h2
              className="text-lg sm:text-xl font-bold text-white mb-6 leading-snug"
              data-testid="question-text"
            >
              {currentQuestion.question}
            </h2>

            {/* 4 Selectable Option Cards */}
            <div className="space-y-3 mb-8" data-testid="quiz-options" role="radiogroup">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
                const letter = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    data-testid={`option-${opt.id}`}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    className={`w-full p-4 rounded-xl text-left border transition-all flex items-center gap-3.5 group cursor-pointer ${
                      isSelected
                        ? 'bg-[#00F59B]/10 border-[#00F59B] text-white shadow-[0_0_15px_rgba(0,245,155,0.15)] ring-1 ring-[#00F59B]/30'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/10 text-slate-200 hover:border-white/20'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#00F59B] text-slate-950'
                          : 'bg-white/[0.06] text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Question Navigation & Submit Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                data-testid="prev-question-btn"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors ${
                  currentQuestionIndex === 0
                    ? 'opacity-40 cursor-not-allowed border-white/5 text-slate-500'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-white border-white/10'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
                  }
                  data-testid="next-question-btn"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-[#00D4FF]/15 hover:bg-[#00D4FF]/25 text-[#00D4FF] border border-[#00D4FF]/30 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  data-testid="submit-quiz-btn"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#00F59B] hover:bg-[#00F59B]/90 text-slate-950 shadow-lg shadow-[#00F59B]/20 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Evaluating Answers...' : 'Submit Quiz'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Helper note */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-[11px] text-slate-500">
            Select your answer for each question. You can navigate between questions before submitting.
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
