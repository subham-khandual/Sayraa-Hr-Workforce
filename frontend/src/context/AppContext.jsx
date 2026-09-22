import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithGooglePopup } from '../config/firebase';

const AppContext = createContext();

const API_BASE = 'http://localhost:5000/api/v1';

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(() => {
    // Restore last route on refresh, but only for authenticated users
    const savedRoute = sessionStorage.getItem('currentRoute');
    const savedToken = localStorage.getItem('token');
    if (savedToken && savedRoute && savedRoute !== '/') return savedRoute;
    return '/';
  });
  const [routeParams, setRouteParams] = useState({});
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Settings thresholds
  const [settings, setSettings] = useState({
    atsThreshold: 70,
    assessmentThreshold: 60,
    interviewThreshold: 65,
    autoScreening: true
  });

  // Decode JWT to set current user; auto-redirect away from landing page if already signed in
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check token expiry
        if (payload.exp && Date.now() / 1000 > payload.exp) {
          logout(false);
          return;
        }
        setCurrentUser({
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          avatar: payload.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          organization: payload.organization || 'None'
        });
        localStorage.setItem('token', token);
        // If user is on landing/login page, send them to dashboard
        setCurrentRoute(prev => {
          if (prev === '/' || prev === '/login' || prev === '/register') return '/dashboard';
          return prev;
        });
      } catch (err) {
        console.error('Failed to decode token:', err);
        logout(false);
      }
    } else {
      setCurrentUser(null);
      localStorage.removeItem('token');
      sessionStorage.removeItem('currentRoute');
    }
  }, [token]);

  // Load basic data when logged in
  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const logout = (showNotice = true) => {
    setToken('');
    setCurrentUser(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('currentRoute');
    setCurrentRoute('/');
    if (showNotice) {
      showToast('Logged out successfully', 'info');
    }
  };

  const navigateTo = (route, params = {}) => {
    setRouteParams(params);
    setCurrentRoute(route);
    // Persist route so it survives page refresh
    if (route !== '/' && route !== '/login' && route !== '/register') {
      sessionStorage.setItem('currentRoute', route);
    } else {
      sessionStorage.removeItem('currentRoute');
    }
  };

  // Helper fetch wrapper
  const apiFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token is invalid or expired. Clear session without crashing.
          setToken('');
          setCurrentUser(null);
          localStorage.removeItem('token');
        }
        throw new Error(data.error || 'Server request failed');
      }
      return data;
    } catch (err) {
      console.warn(`API Fetch [${endpoint}]:`, err.message);
      throw err;
    }
  };

  const refreshData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [jobsData, candidatesData, appsData, logsData, assessData] = await Promise.all([
        apiFetch('/jobs').catch(() => []),
        apiFetch('/candidates').catch(() => []),
        apiFetch('/applications').catch(() => []),
        apiFetch('/audit-logs').catch(() => []),
        apiFetch('/assessments').catch(() => [])
      ]);
      setJobs(jobsData || []);
      setCandidates(candidatesData || []);
      setApplications(appsData || []);
      setAuditLogs(logsData || []);
      setAssessments(assessData || []);
    } catch (err) {
      console.warn('Failed to refresh app data:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      setToken(data.token);
      showToast(`Welcome back, ${data.user.name}!`);
      setCurrentRoute('/dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name, email, password, role, organization) => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role, organization })
      });
      setToken(data.token);
      showToast('Registration successful! Welcome to Sayraa.');
      setCurrentRoute('/dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGooglePopup();
      const user = result.user;
      const data = await apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          avatar: user.photoURL,
          googleUid: user.uid
        })
      });
      setToken(data.token);
      showToast(`Welcome, ${data.user.name}!`);
      setCurrentRoute('/dashboard');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        showToast(err.message || 'Google sign-in failed', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (email, purpose = 'login') => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
      return { success: true, message: data.message, expiresIn: data.expiresIn };
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email, otp, name = '', password = '', role = 'Candidate') => {
    setIsLoading(true);
    try {
      const data = await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp, name, password, role })
      });
      setToken(data.token);
      showToast(`Welcome, ${data.user.name}!`);
      setCurrentRoute('/dashboard');
      return data;
    } catch (err) {
      // Handled in apiFetch
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createJob = async (jobData) => {
    try {
      const newJob = await apiFetch('/jobs', {
        method: 'POST',
        body: JSON.stringify(jobData)
      });
      setJobs(prev => [...prev, newJob]);
      showToast('Job posting created successfully.');
      refreshData();
      return newJob;
    } catch (err) {
      // Handled in apiFetch
    }
  };

  const applyForJob = async (jobId, resumeText) => {
    if (!currentUser) return;
    try {
      // Find candidate associated with user
      const cand = candidates.find(c => c.email === currentUser.email);
      const candId = cand ? cand._id : 'cand-1'; // fallback seed

      const application = await apiFetch('/applications', {
        method: 'POST',
        body: JSON.stringify({ jobId, candidateId: candId, resumeText })
      });
      setApplications(prev => [...prev, application]);
      showToast('Application submitted successfully!');
      refreshData();
      return application;
    } catch (err) {
      // Handled
    }
  };

  const updateApplicationStage = async (appId, stage) => {
    try {
      const updated = await apiFetch(`/applications/${appId}/stage`, {
        method: 'PUT',
        body: JSON.stringify({ stage })
      });
      setApplications(prev => prev.map(a => a._id === appId ? updated : a));
      showToast(`Candidate moved to ${stage}`);
      refreshData();
      return updated;
    } catch (err) {
      // Handled
    }
  };

  const deleteApplication = async (appId) => {
    try {
      await apiFetch(`/applications/${appId}`, {
        method: 'DELETE'
      });
      setApplications(prev => prev.filter(a => a._id !== appId));
      showToast('Application withdrawn successfully.');
      refreshData();
    } catch (err) {
      showToast(err.message || 'Failed to withdraw application', 'error');
    }
  };

  const getEvaluation = async (appId) => {
    try {
      return await apiFetch(`/applications/${appId}/evaluation`);
    } catch (err) {
      // Handled
    }
  };

  const submitReview = async (appId, recommendation, notes) => {
    try {
      const review = await apiFetch(`/applications/${appId}/review`, {
        method: 'POST',
        body: JSON.stringify({ recommendation, notes })
      });
      showToast('HR Review submitted successfully.');
      refreshData();
      setCurrentRoute('/pipeline');
      return review;
    } catch (err) {
      // Handled
    }
  };

  const submitDecision = async (appId, status, reason) => {
    try {
      const decision = await apiFetch(`/applications/${appId}/decision`, {
        method: 'POST',
        body: JSON.stringify({ status, reason })
      });
      showToast(`Hiring decision finalized: ${status}`);
      refreshData();
      setCurrentRoute('/pipeline');
      return decision;
    } catch (err) {
      // Handled
    }
  };

  const submitAssessment = async (appId, score) => {
    setIsLoading(true);
    try {
      const data = await apiFetch(`/applications/${appId}/assessment`, {
        method: 'POST',
        body: JSON.stringify({ score })
      });
      showToast('Assessment submitted successfully!');
      refreshData();
      return data;
    } catch (err) {
      // Handled in apiFetch
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      token,
      currentUser,
      currentRoute,
      routeParams,
      jobs,
      candidates,
      applications,
      auditLogs,
      assessments,
      settings,
      setSettings,
      isLoading,
      toast,
      showToast,
      login,
      loginWithGoogle,
      signup,
      logout,
      navigateTo,
      createJob,
      applyForJob,
      updateApplicationStage,
      deleteApplication,
      getEvaluation,
      submitReview,
      submitDecision,
      submitAssessment,
      sendOTP,
      verifyOTP,
      refreshData
    }}>
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
