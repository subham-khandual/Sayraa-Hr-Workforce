import React from 'react';
import { useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobsPage } from './pages/JobsPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { ResultsPage } from './pages/ResultsPage';
import { CandidatesPage } from './pages/CandidatesPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { InterviewRoomPage } from './pages/InterviewRoomPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { HRReviewPage } from './pages/HRReviewPage';
import { FinalDecisionPage } from './pages/FinalDecisionPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { OTPAuthPage } from './pages/OTPAuthPage';
import { OfferLetterPage } from './pages/OfferLetterPage';

function App() {
  const { currentRoute, currentUser } = useApp();

  const renderPage = () => {
    const isCandidate = currentUser?.role === 'Candidate';

    // Route guard: if a candidate, allow candidate-relevant pages
    if (isCandidate) {
      const allowedCandidateRoutes = [
        '/', 
        '/login', 
        '/register', 
        '/dashboard', 
        '/jobs', 
        '/profile', 
        '/resume', 
        '/results', 
        '/applications', 
        '/assessment', 
        '/interview',
        '/settings',
        '/help',
        '/otp-auth',
        '/offer'
      ];
      if (!allowedCandidateRoutes.includes(currentRoute)) {
        return <DashboardPage />;
      }
    }

    switch (currentRoute) {
      case '/':
      case '/login':
      case '/register':
        return <LandingPage />;
      case '/otp-auth':
        return <OTPAuthPage />;
      case '/offer':
        return <OfferLetterPage />;
      case '/dashboard':
        return <DashboardPage />;
      case '/profile':
        return <ProfileSetupPage />;
      case '/resume':
        return <ResumeUploadPage />;
      case '/results':
        return <ResultsPage />;
      case '/jobs':
        return <JobsPage />;
      case '/applications':
      case '/pipeline':
        return isCandidate ? <DashboardPage /> : <ApplicationsPage />;
      case '/candidates':
        return <CandidatesPage />;
      case '/interview':
        return <InterviewRoomPage />;
      case '/evaluation':
        return <EvaluationPage />;
      case '/review':
        return <HRReviewPage />;
      case '/decision':
        return <FinalDecisionPage />;
      case '/analytics':
        return <AnalyticsPage />;
      case '/reports':
        return <ReportsPage />;
      case '/settings':
        return <SettingsPage />;
      case '/logs':
        return <AuditLogsPage />;
      case '/assessment':
        return <AssessmentPage />;
      case '/help':
        return (
          <div className="max-w-3xl mx-auto py-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-outfit text-2xl font-bold text-slate-900">Sayraa Help & Support</h2>
            <p className="text-xs text-slate-500">Need help with AI resume screening, job applications, or interview simulations? Reach out to support@sayraa.ai or check our FAQs.</p>
          </div>
        );
      default:
        return (
          <div className="text-center py-20 bg-white rounded-3xl p-8 max-w-md mx-auto border border-slate-200 shadow-sm mt-10">
            <h2 className="text-xl font-bold text-slate-900 font-outfit">404 - Page Not Found</h2>
            <p className="text-xs text-slate-500 mt-2">The requested view does not exist.</p>
          </div>
        );
    }
  };

  return (
    <AppShell>
      {renderPage()}
    </AppShell>
  );
}

export default App;
