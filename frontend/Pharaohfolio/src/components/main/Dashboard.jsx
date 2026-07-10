import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import Footer from '../common/Footer';
import PharaohfolioLogo from '../../assets/PharaohfolioLogo.png';
import CodeEditor from './components/CodeEditor';
import { Link } from 'react-router-dom';

const SAMPLE_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Professional Portfolio</title>
  <style>
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #0b0f19;
      color: #f3f4f6;
      margin: 0;
      padding: 3rem 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 2.5rem;
      max-width: 450px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    }
    .profile-img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 3px solid #fbcd3d;
      margin-bottom: 1.5rem;
      object-fit: cover;
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
    }
    h1 {
      font-size: 2.2rem;
      margin: 0 0 0.5rem 0;
      font-weight: 800;
      letter-spacing: -0.025em;
    }
    .title {
      color: #fbcd3d;
      font-size: 1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0 0 1.5rem 0;
    }
    .bio {
      color: #9ca3af;
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0 0 2rem 0;
    }
    .links {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }
    .link-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #ffffff;
      padding: 1rem;
      border-radius: 12px;
      font-weight: 600;
      text-decoration: none;
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }
    .link-btn:hover {
      background: rgba(212, 175, 55, 0.1);
      border-color: #fbcd3d;
      color: #fbcd3d;
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="card">
    <img class="profile-img" src="https://picsum.photos/id/64/200/200" alt="Avatar">
    <h1>Your Name</h1>
    <div class="title">Your Professional Title</div>
    <p class="bio">Write a short, engaging description about what you do, your achievements, or your creative passions here.</p>
    <div class="links">
      <a href="#" class="link-btn">My Projects</a>
      <a href="#" class="link-btn">Read My Articles</a>
      <a href="#" class="link-btn">Let's Connect</a>
    </div>
  </div>
</body>
</html>`;

const Dashboard = () => {
  const { user } = useAuth();
  const [portfolioCode, setPortfolioCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [sanitizationLog, setSanitizationLog] = useState([]);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview' (for mobile responsive design)
  const [cleanAlert, setCleanAlert] = useState(false);

  // Fetch portfolio code once on mount
  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/portfolio/my/get/')
      .then(res => {
        if (res.data?.user_code_status) {
          setPortfolioCode(res.data.user_code || '');
          setSanitizationLog(res.data.sanitization_log || []);
        } else {
          setPortfolioCode('');
          setSanitizationLog([]);
        }
      })
      .catch(() => {
        setPortfolioCode('');
        setSanitizationLog([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Smart markdown block stripper helper
  const cleanAICodeText = (code) => {
    if (!code) return '';
    let cleaned = code.trim();
    const startRegex = /^```(?:html)?\s*/i;
    const endRegex = /\s*```$/;
    let modified = false;

    if (startRegex.test(cleaned)) {
      cleaned = cleaned.replace(startRegex, '');
      modified = true;
    }
    if (endRegex.test(cleaned)) {
      cleaned = cleaned.replace(endRegex, '');
      modified = true;
    }

    if (modified) {
      setCleanAlert(true);
      setTimeout(() => setCleanAlert(false), 4000);
    }
    return cleaned;
  };

  const handleCodeChange = (newVal) => {
    // If user is typing or pasting, check for markdown code fences
    const cleaned = cleanAICodeText(newVal);
    setPortfolioCode(cleaned);
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleLoadSample = () => {
    if (window.confirm("Load a pre-made template? This will replace your current code.")) {
      setPortfolioCode(SAMPLE_TEMPLATE);
      setSuccess("Sample template loaded! Click 'Save & Deploy' to go live.");
    }
  };

  const handleCleanCodeManual = () => {
    const cleaned = cleanAICodeText(portfolioCode);
    setPortfolioCode(cleaned);
    setSuccess("Code cleaned! Surrounding markdown backticks removed.");
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    const cleanedCode = cleanAICodeText(portfolioCode);
    if (!cleanedCode || !cleanedCode.trim()) {
      setError('Portfolio code cannot be empty.');
      setSaving(false);
      return;
    }

    try {
      const response = await axios.post('/api/portfolio/save/', { user_code: cleanedCode });
      setSuccess(response.data.message);
      
      // Update local storage status
      if (response.data.changes_made) {
        const details = response.data.sanitization_details || [];
        if (details.length > 0) {
          const warningMessage = `⚠️ Security modifications made: ${response.data.sanitization_summary}`;
          setError(warningMessage);
        }
      }
      
      // Fetch status log update
      axios.get('/api/portfolio/my/get/').then(res => {
        if (res.data?.sanitization_log) {
          setSanitizationLog(res.data.sanitization_log);
        }
      });
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to save portfolio. Please try again.');
      }
    }
    setSaving(false);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/u/${user?.username}`;
    navigator.clipboard.writeText(link);
    setSuccess("Copied live link to clipboard!");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-indigo-950 bg-pharaoh-pattern text-white flex flex-col justify-between">
      {/* Background radial overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-48 h-48 bg-gold-600/5 rounded-full filter blur-3xl opacity-25"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500/5 rounded-full filter blur-3xl opacity-25"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col space-y-6">
        
        {/* Top Header Card */}
        <div className="pharaoh-card rounded-2xl p-6 shadow-xl border border-white/10 bg-obsidian-900/40 backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-obsidian-950">
              <img 
                src={PharaohfolioLogo} 
                alt="Pharaohfolio Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-chef text-white">
                Welcome, {user?.first_name || user?.username}!
              </h1>
              <p className="text-gray-400 text-xs mt-0.5">Simple Hosting for Single-Page Portfolios</p>
            </div>
          </div>

          {/* Active Live Link Status */}
          {portfolioCode && (
            <div className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between gap-4 md:max-w-md w-full">
              <div className="min-w-0">
                <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Your Live Portfolio</span>
                <a 
                  href={`/u/${user?.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-gold-400 hover:underline truncate block"
                >
                  {`${window.location.host}/u/${user?.username}`}
                </a>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium border border-white/5 transition flex items-center gap-1"
                  title="Copy link"
                >
                  📋 <span className="hidden sm:inline">Copy</span>
                </button>
                <a
                  href={`/u/${user?.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-gradient-to-r from-gold-400 to-gold-600 text-obsidian-950 font-bold hover:shadow-[0_0_10px_rgba(212,175,55,0.3)] rounded-lg text-xs transition"
                >
                  Open ↗
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Quick Launch & Prompts Action Bar */}
        <div className="pharaoh-card rounded-xl p-4 shadow-md border border-white/10 bg-obsidian-900/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-xs text-gold-400 font-bold uppercase tracking-wider">Create with AI:</span>
            <div className="flex flex-wrap gap-2">
              <a 
                href="https://chatgpt.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1.5 bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/20 hover:border-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition duration-300"
              >
                💬 ChatGPT
              </a>
              <a 
                href="https://claude.ai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1.5 bg-amber-950/30 hover:bg-amber-900/50 text-amber-300 border border-amber-500/20 hover:border-amber-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition duration-300"
              >
                🧠 Claude
              </a>
              <a 
                href="https://gemini.google.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1.5 bg-blue-950/30 hover:bg-blue-900/50 text-blue-300 border border-blue-500/20 hover:border-blue-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition duration-300"
              >
                ✨ Gemini
              </a>
            </div>
          </div>
          
          <Link
            to="/prompts"
            className="px-4 py-2 bg-gradient-to-r from-gold-400 to-gold-600 text-obsidian-950 font-bold hover:shadow-[0_0_12px_rgba(212,175,55,0.4)] rounded-xl text-xs sm:text-sm transition duration-300 flex items-center gap-1.5 w-full sm:w-auto justify-center"
          >
            💡 Browse Prompt Examples
          </Link>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <svg className="w-10 h-10 text-gold-500 animate-spin mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-400 text-sm">Loading your code editor...</p>
          </div>
        ) : (
          /* Main Workspace Split Grid */
          <div className="flex-1 grid lg:grid-cols-12 gap-6 items-stretch min-h-[500px]">
            
            {/* Mobile View Toggle Tabs */}
            <div className="lg:hidden col-span-12 flex bg-obsidian-900/60 p-1 border border-white/5 rounded-xl">
              <button
                className={`flex-1 py-2 text-sm font-semibold rounded-lg ${
                  activeTab === 'editor' ? 'bg-gold-500 text-obsidian-950' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('editor')}
              >
                📝 Code Editor
              </button>
              <button
                className={`flex-1 py-2 text-sm font-semibold rounded-lg ${
                  activeTab === 'preview' ? 'bg-gold-500 text-obsidian-950' : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('preview')}
              >
                👁️ Live Preview
              </button>
            </div>

            {/* Left Side Panel: Code Editor */}
            <div className={`lg:col-span-6 flex flex-col space-y-4 ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
              <div className="pharaoh-card rounded-2xl p-5 border border-white/10 bg-obsidian-900/40 backdrop-blur-xl flex-1 flex flex-col justify-between">
                
                {/* Editor Header / Toolbars */}
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <div>
                      <h3 className="font-bold text-white text-base">Paste Portfolio Code</h3>
                      <p className="text-gray-400 text-[11px] mt-0.5">Paste your raw HTML/CSS/JS file below.</p>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={handleLoadSample}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-xs border border-white/5 rounded-lg font-medium text-gold-400 transition"
                        title="Load Sample Developer Template"
                      >
                        ⚡ Load Sample
                      </button>
                      <button
                        onClick={handleCleanCodeManual}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-xs border border-white/5 rounded-lg font-medium text-gray-300 transition"
                        title="Remove surrounding markdown backticks"
                      >
                        🧹 Clean Code
                      </button>
                    </div>
                  </div>

                  {/* Clean up notification popups */}
                  {cleanAlert && (
                    <div className="mb-3 p-2 bg-emerald-950/40 border border-emerald-900/50 rounded-lg text-emerald-400 text-xs animate-pulse">
                      ✨ Smart Parser: Stripped markdown formatting brackets automatically!
                    </div>
                  )}

                  {/* Code Editor component */}
                  <CodeEditor
                    value={portfolioCode}
                    onChange={handleCodeChange}
                    language="html"
                  />
                </div>

                {/* Editor Footer Actions */}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                    <span className="text-[11px] text-gray-500">
                      💡 Tip: Generate your portfolio with Claude/ChatGPT and paste the raw code here.
                    </span>
                    <button
                      className="pharaoh-button text-obsidian-950 font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <svg className="w-4 h-4 text-obsidian-950 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <span>🚀 Save & Deploy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Feedback states */}
                  {success && (
                    <div className="mt-3 p-3 bg-emerald-950/30 border border-emerald-900/35 text-emerald-400 text-xs rounded-xl font-medium">
                      {success}
                    </div>
                  )}
                  {error && (
                    <div className="mt-3 p-3 bg-red-950/30 border border-red-900/35 text-red-400 text-xs rounded-xl leading-relaxed whitespace-pre-line">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side Panel: Live Preview Frame Mockup */}
            <div className={`lg:col-span-6 flex flex-col space-y-4 ${activeTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
              <div className="pharaoh-card rounded-2xl p-0 border border-white/10 bg-obsidian-900/40 backdrop-blur-xl flex-1 flex flex-col justify-between overflow-hidden shadow-2xl">
                
                {/* Browser Frame Header */}
                <div className="bg-obsidian-950 px-4 py-3 flex items-center gap-3 border-b border-white/5 flex-shrink-0">
                  {/* Mock browser dots */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  </div>
                  
                  {/* Mock URL bar */}
                  <div className="flex-1 bg-black/60 border border-white/5 rounded-lg px-3 py-1 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span className="truncate">pharaohfolio.com/u/{user?.username}</span>
                    <span className="text-[10px] text-gold-500 font-bold bg-gold-500/10 px-1.5 py-0.5 rounded flex-shrink-0 border border-gold-500/20">
                      LIVE PREVIEW
                    </span>
                  </div>
                </div>

                {/* Browser Frame Sandbox Iframe */}
                <div className="flex-1 bg-white relative">
                  {portfolioCode ? (
                    <iframe
                      title="Portfolio Preview"
                      srcDoc={portfolioCode}
                      sandbox="allow-scripts"
                      className="w-full h-full border-0 absolute inset-0"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-obsidian-950 flex flex-col items-center justify-center p-6 text-center text-white">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-2xl mb-4 animate-pulse">
                        👁️
                      </div>
                      <h4 className="font-bold text-white mb-1.5 text-sm">No Website Code Found</h4>
                      <p className="text-gray-400 text-xs max-w-xs leading-relaxed">
                        Pasted code will appear here. Click "Load Sample" to try a template immediately!
                      </p>
                    </div>
                  )}
                </div>

                {/* Sanitization status updates summary */}
                {sanitizationLog.length > 0 && (
                  <div className="bg-obsidian-950 px-4 py-2 border-t border-white/5 text-[10px] text-gray-500 font-mono flex items-center gap-1.5 flex-shrink-0 overflow-x-auto whitespace-nowrap">
                    <span className="text-gold-400 font-bold uppercase text-[9px] flex-shrink-0">Security Check:</span>
                    {sanitizationLog.map((log, index) => (
                      <span key={index} className="bg-white/5 px-2 py-0.5 rounded text-gray-400">
                        {log.action.replace(/_/g, ' ')} ({log.count})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;