import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, Send, MessageSquare, Shield, HelpCircle, ArrowRight } from 'lucide-react';
import sayraaAvatar from '../assets/sayraa-avatar.jpg';

export const InterviewRoomPage = () => {
  const { routeParams, navigateTo, showToast, currentUser } = useApp();
  const { applicationId, candidateId, jobId } = routeParams;

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isListening, setIsListening] = useState(true);
  const [sayraaState, setSayraaState] = useState('speaking'); // speaking, listening, complete
  const [latestQuestion, setLatestQuestion] = useState('Namaste! Aapka screening interview room load ho raha hai...');
  const [currentFocus, setCurrentFocus] = useState('Introduction');
  const [isCompleted, setIsCompleted] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!applicationId || !candidateId || !jobId) {
      showToast('Interview session parameters are missing.', 'error');
      navigateTo(currentUser?.role === 'Candidate' ? '/dashboard' : '/pipeline');
      return;
    }

    // Initialize WebSocket
    const wsUrl = `ws://localhost:5000/ws/interview?applicationId=${applicationId}&candidateId=${candidateId}&jobId=${jobId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('✅ WebSocket Connection established for Interview');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'speech') {
        setLatestQuestion(data.text);
        setSayraaState('listening');
        if (data.focus) setCurrentFocus(data.focus);
        
        setMessages(prev => [...prev, {
          sender: 'Sayraa',
          text: data.text,
          timestamp: new Date()
        }]);
      } else if (data.type === 'complete') {
        setSayraaState('complete');
        setIsCompleted(true);
        setLatestQuestion('Dhanyawaad! Aapka screening assessment aur interview scorecard load hone ke liye tayyar hai.');
        setMessages(prev => [...prev, {
          sender: 'Sayraa',
          text: 'Dhanyawaad! Aapka screening assessment aur interview scorecard load hone ke liye tayyar hai.',
          timestamp: new Date()
        }]);
      } else if (data.type === 'error') {
        showToast(data.message, 'error');
      }
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket Interview connection closed');
    };

    setSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [applicationId, candidateId, jobId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!currentResponse.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;

    // Send candidate text to websocket
    socket.send(JSON.stringify({
      type: 'response',
      text: currentResponse
    }));

    setMessages(prev => [...prev, {
      sender: 'Candidate',
      text: currentResponse,
      timestamp: new Date()
    }]);

    setCurrentResponse('');
    setSayraaState('speaking');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Recording Header */}
      <div className="glass-panel p-4 bg-slate-900/60 border border-slate-900 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-pulse" />
          <div>
            <span className="text-xs font-bold text-slate-200">INTERVIEW SESSION ACTIVE</span>
            <span className="text-[10px] text-slate-500 block">All transcripts and recordings are saved for recruiter compliance reviews.</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-indigo-950/40 border border-indigo-900/50 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-indigo-400">
          <Shield className="w-4 h-4" />
          <span>Category Focus: {currentFocus}</span>
        </div>
      </div>

      {/* Main Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        
        {/* Left Column: Sayraa Avatar Panel (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-4 sm:p-6 rounded-3xl border border-slate-900 flex flex-col items-center justify-between text-center relative overflow-hidden bg-slate-950/40 min-h-[360px] sm:min-h-[420px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full filter blur-2xl" />
          
          <div className="space-y-1 mt-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Sayraa screening Assistant</span>
            <h2 className="text-lg font-bold font-outfit text-indigo-400">Automated Voice Screening</h2>
          </div>

          {/* Avatar visualization */}
          <div className="relative my-6">
            <div className={`w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-500/40 flex items-center justify-center shadow-2xl relative transition-all duration-300 ${
              sayraaState === 'speaking' ? 'scale-105 ring-4 ring-indigo-500/50 shadow-indigo-500/30' : 'scale-100'
            }`}>
              <img 
                src={sayraaAvatar} 
                alt="Sayraa AI Interviewer" 
                className="w-full h-full object-cover"
              />
              {sayraaState === 'speaking' && (
                <div className="absolute -inset-2.5 rounded-full border-2 border-indigo-400/50 animate-ping pointer-events-none" />
              )}
            </div>

            {/* Audio Wave Visualizer Simulation */}
            {sayraaState === 'speaking' && (
              <div className="flex gap-1 justify-center mt-6">
                {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((val, idx) => (
                  <div 
                    key={idx} 
                    className="w-1 bg-indigo-400 rounded-full animate-pulse" 
                    style={{ height: `${val * 4}px`, animationDelay: `${idx * 0.15}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 w-full mb-4">
            {/* Sayraa Speech Box */}
            <div className="p-4 bg-slate-900/60 border border-slate-850 rounded-2xl text-xs text-slate-300 leading-relaxed text-left min-h-[70px]">
              {latestQuestion}
            </div>

            {/* Control buttons */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setIsListening(!isListening)}
                className={`p-2.5 rounded-xl border transition flex items-center gap-2 text-xs font-semibold ${
                  isListening 
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200' 
                    : 'bg-rose-950/40 border-rose-900/50 text-rose-400'
                }`}
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span>{isListening ? 'Mute Mic' : 'Unmute Mic'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Transcription/Chat Timeline (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl border border-slate-900 flex flex-col justify-between overflow-hidden bg-slate-950/20 max-h-[400px] sm:max-h-[500px]">
          
          {/* Chat Timeline header */}
          <div className="px-5 py-3.5 border-b border-slate-900 bg-slate-900/30 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Session Transcript</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'Sayraa' ? 'self-start items-start' : 'self-end items-end ml-auto'
                }`}
              >
                <span className="text-[10px] text-slate-500 font-bold mb-1">{msg.sender}</span>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'Sayraa' 
                    ? 'bg-slate-900/80 border border-slate-850 text-slate-300 rounded-tl-none' 
                    : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/5'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Panel */}
          <div className="p-4 border-t border-slate-900 bg-slate-950/80">
            {isCompleted ? (
              <div className="text-center py-2 space-y-3">
                <p className="text-xs text-emerald-400 font-bold">✓ Interview Completed Successfully!</p>
                <button
                  onClick={() => navigateTo(currentUser?.role === 'Candidate' ? '/dashboard' : '/pipeline')}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 mx-auto shadow-lg shadow-indigo-600/10"
                >
                  Return to {currentUser?.role === 'Candidate' ? 'Dashboard' : 'Pipeline Tracker'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2.5">
                <textarea
                  rows={2}
                  value={currentResponse}
                  onChange={(e) => setCurrentResponse(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={sayraaState === 'speaking'}
                  placeholder={sayraaState === 'speaking' ? "Awaiting Sayraa's question..." : "Type your screening response in Hindi/English..."}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 resize-none disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={sayraaState === 'speaking' || !currentResponse.trim()}
                  className="px-4.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center transition shadow-lg shadow-indigo-600/10 disabled:opacity-50 disabled:hover:bg-indigo-600"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
