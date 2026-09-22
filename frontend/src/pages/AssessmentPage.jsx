import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, CheckCircle, ShieldAlert } from 'lucide-react';

export const AssessmentPage = () => {
  const { routeParams, navigateTo, submitAssessment, jobs, showToast, currentUser } = useApp();
  const { appId, jobId } = routeParams;

  const job = jobs.find(j => j._id === jobId);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      q: 'Which of the following is correct about state updates in React?',
      options: [
        'They are synchronous and immediate.',
        'They are batched and asynchronous.',
        'They bypass virtual DOM updates.',
        'They can only be triggered via custom hook wrappers.'
      ],
      answer: 1
    },
    {
      id: 2,
      q: 'What is the purpose of indexes in MongoDB database collections?',
      options: [
        'To enforce security permissions.',
        'To support real-time socket connections.',
        'To improve query execution performance.',
        'To enable automated schema migration.'
      ],
      answer: 2
    },
    {
      id: 3,
      q: 'What is the primary role of middleware functions in ExpressJS backend routing?',
      options: [
        'Compiling JSX files for clients.',
        'Executing business queries inside MongoDB schema structures.',
        'Intercepting and modifying request/response flows.',
        'Establishing persistent WebSocket server channels.'
      ],
      answer: 2
    }
  ];

  const handleOptionSelect = (qId, optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(selectedAnswers).length < questions.length) {
      showToast('Please answer all assessment questions before submitting.', 'warning');
      return;
    }

    // Grade
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.answer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    await submitAssessment(appId, score);
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigateTo(currentUser?.role === 'Candidate' ? '/dashboard' : '/pipeline')}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-outfit text-slate-100">Skills Assessment Test</h1>
          <p className="text-xs text-slate-400">Position: {job ? job.title : 'Software Engineer'} • {job?.department}</p>
        </div>
      </div>

      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-slate-900 bg-slate-950/20">
        {isSubmitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Assessment Submitted Successfully</h3>
              <p className="text-xs text-slate-500 mt-1">Your scoring and metrics have been compiled and sent to recruiters.</p>
            </div>
            <button
              onClick={() => navigateTo(currentUser?.role === 'Candidate' ? '/dashboard' : '/pipeline')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/10"
            >
              Return to {currentUser?.role === 'Candidate' ? 'Dashboard' : 'Pipeline Dashboard'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-slate-400 block">Question {idx + 1}</span>
                  <p className="text-xs text-slate-200 font-semibold">{q.q}</p>
                  
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleOptionSelect(q.id, optIdx)}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition ${
                            isSelected 
                              ? 'bg-indigo-600 border-indigo-500 text-white' 
                              : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800 active:bg-slate-900'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition text-sm shadow-lg shadow-indigo-600/10"
            >
              Submit Assessment Answers
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
