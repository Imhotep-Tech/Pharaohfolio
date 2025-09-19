import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import Footer from '../common/Footer';
import PharaohfolioLogo from '../../assets/PharaohfolioLogo.png';
import CodeEditor from './components/CodeEditor';

const Dashboard = () => {
  const { user } = useAuth();
  const [editorOpen, setEditorOpen] = useState(false);
  const [portfolioCode, setPortfolioCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [sanitizationLog, setSanitizationLog] = useState([]);

  // Fetch portfolio code once on mount
  useEffect(() => {
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
      });
  }, []);

  // Fetch portfolio code again every time editorOpen changes to true
  useEffect(() => {
    if (editorOpen) {
      setLoading(true);
      setError('');
      setSuccess('');
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
    }
  }, [editorOpen]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    if (!portfolioCode || !portfolioCode.trim()) {
      setError('Portfolio code cannot be empty.');
      setSaving(false);
      return;
    }
    try {
      const response = await axios.post('/api/portfolio/save/', { user_code: portfolioCode });
      setSuccess(response.data.message);
      
      // Show sanitization details if changes were made
      if (response.data.changes_made) {
        const details = response.data.sanitization_details || [];
        if (details.length > 0) {
          const warningMessage = `⚠️ Security modifications made:\n${response.data.sanitization_summary}`;
          setError(warningMessage);
        }
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to save portfolio. Please try again.');
      }
    }
    setSaving(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 bg-chef-pattern">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-40 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="chef-card rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/30 backdrop-blur-2xl bg-white/90 text-center">
          <div className="flex flex-col items-center mb-8">
            {/* Header with Chef Logo and Brand */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full mb-4 shadow-lg border-4 border-white">
              <img 
                src={PharaohfolioLogo} 
                alt="Pharaohfolio Logo" 
                className="w-14 h-14 object-contain"
              />
            </div>
            <div
              className="font-extrabold text-3xl sm:text-4xl mb-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent font-chef drop-shadow-lg tracking-wide"
              style={{
                letterSpacing: '0.04em',
                lineHeight: '1.1',
                textShadow: '0 2px 8px rgba(124,58,237,0.12)'
              }}
            >
              Pharaohfolio
            </div>
            <p className="text-gray-500 text-sm mb-2">Simple Hosting for Single-Page Portfolios</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-chef text-gray-800 mb-4">
              Welcome, {user?.first_name || user?.username}!
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed max-w-2xl">
              Paste your AI-generated HTML/CSS/JS code and deploy your portfolio instantly.
            </p>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            <button
              className="chef-button bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white flex items-center space-x-2 w-full sm:w-auto"
              onClick={() => setEditorOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{portfolioCode ? 'Edit Portfolio' : 'Create Portfolio'}</span>
            </button>
            {/* ...other dashboard actions if needed... */}
          </div>
        </div>

        {/* Portfolio Preview */}
        {/*
        {portfolioCode && (
          <div className="chef-card rounded-2xl p-6 sm:p-8 shadow-lg border border-white/30 backdrop-blur-2xl bg-white/90 mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Live Preview</h2>
            <div className="w-full h-96 bg-gray-100 rounded-lg overflow-auto border">
              <iframe
                title="Portfolio Preview"
                srcDoc={portfolioCode}
                sandbox="allow-scripts"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}
        */}

        {/* Instead, show a link to the user's portfolio page after saving: */}
        {portfolioCode && (
          <div className="chef-card rounded-2xl p-6 sm:p-8 shadow-lg border border-white/30 backdrop-blur-2xl bg-white/90 mt-8 text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Portfolio is Live!</h2>
            <a
              href={`/u/${user?.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold shadow-lg hover:from-purple-600 hover:to-indigo-600 transition"
            >
              View Your Portfolio
            </a>
            <p className="text-gray-500 text-sm mt-4">
              Share this link: <span className="font-mono">{`pharaohfolio.vercel.app/u/${user?.username}`}</span>
            </p>
          </div>
        )}

        {/* If no code, show a getting started guide */}
        {!portfolioCode && (
          <div className="chef-card rounded-2xl p-6 sm:p-8 shadow-lg border border-white/30 backdrop-blur-2xl bg-white/90">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold font-chef text-gray-800 mb-4">
                Get Started in 3 Steps
              </h3>
              <ol className="text-left text-gray-700 space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <strong>Generate your code with AI:</strong>
                    <div className="mt-1 p-2 bg-gray-50 rounded text-sm font-mono text-left">
                      "Create a complete portfolio website in a single HTML file with embedded CSS and JavaScript. Include sections for: hero, about, projects, skills, and contact. Use modern styling with gradients, animations, and responsive design. For images, ONLY use URLs from: https://i.imgur.com/, https://live.staticflickr.com/, https://images.unsplash.com/, or https://picsum.photos/. Do NOT include navigation menus, external links, or any elements that could be security risks."
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <strong>Copy and paste the complete code</strong> (including &lt;!DOCTYPE html&gt;, &lt;head&gt;, and &lt;body&gt; tags) into the editor below.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <strong>Click "Save & Deploy"</strong> to publish your portfolio instantly!
                  </div>
                </li>
              </ol>
              <p className="text-gray-500 text-sm">
                Your portfolio will be live at <b>pharaohfolio.com/u/yourusername</b>
              </p>
            </div>
            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
              <div className="flex items-start gap-2 mb-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <strong className="text-blue-900">Security & Content Guidelines:</strong>
                </div>
              </div>
              <ul className="space-y-1 text-xs">
                <li>• <strong>Allowed image sources:</strong> imgur.com, flickr.com, unsplash.com, picsum.photos</li>
                <li>• <strong>Navigation menus are automatically removed</strong> for security</li>
                <li>• <strong>External links (&lt;a&gt; tags) are allowed</strong> but will be sanitized</li>
                <li>• <strong>Any security modifications will be clearly shown</strong> after saving</li>
                <li>• <strong>Only sanitized code is saved</strong> for maximum security</li>
              </ul>
            </div>
            {/* Prompt Examples */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Prompt Examples for AI</h4>
              <ul className="space-y-2 text-left text-gray-700 text-sm">
                <PromptExample text={`Create a personal portfolio website for a frontend developer named Sarah, with a modern design, a hero section, about, projects, and contact form. Use HTML, CSS, and JavaScript in one file. For images, use only links from https://i.imgur.com/, https://live.staticflickr.com/, https://images.unsplash.com/, or https://picsum.photos/. Do not include navigation bars or navigation links.`} />
                <PromptExample text={`Generate a single-file HTML/CSS/JS portfolio for a graphic designer named Alex, with a gallery section, animated transitions, and a dark theme. Only use images from https://i.imgur.com/, https://live.staticflickr.com/, https://images.unsplash.com/, or https://picsum.photos/. Do not include navigation bars or navigation links.`} />
                <PromptExample text={`Build a responsive portfolio page for a data scientist named Priya, including sections for bio, skills, projects (with charts using only CSS/HTML), and contact info. Use only HTML, CSS, and JavaScript. Images must be from https://i.imgur.com/, https://live.staticflickr.com/, https://images.unsplash.com/, or https://picsum.photos/. Do not include navigation bars or navigation links.`} />
                <PromptExample text={`Create a one-page resume website for a backend engineer named Ahmed, with a timeline of experience, skills, and a downloadable CV button. Use HTML, CSS, and JavaScript in one file. Images only from https://i.imgur.com/, https://live.staticflickr.com/, https://images.unsplash.com/, or https://picsum.photos/. Do not include navigation bars or navigation links.`} />
                <PromptExample text={`Make a creative portfolio for a photographer named Emily, with a fullscreen color slider, about section, and contact form. Use images only from https://i.imgur.com/, https://live.staticflickr.com/, https://images.unsplash.com/, or https://picsum.photos/. Do not include navigation bars or navigation links.`} />
                <PromptExample text={`Design a portfolio for a UI/UX designer named Lucas, with a case studies section, testimonials, and a minimal, clean layout. Use HTML, CSS, and JavaScript in one file. Images only from https://i.imgur.com/, https://live.staticflickr.com/, https://images.unsplash.com/, or https://picsum.photos/. Do not include navigation bars or navigation links.`} />
                <PromptExample text={`Create a personal landing page for a student named Maria, with sections for education, projects, and social links (as text or <a> tags). Use only HTML, CSS, and JavaScript. Images only from https://i.imgur.com/, https://live.staticflickr.com/, https://images.unsplash.com/, or https://picsum.photos/. Do not include navigation bars or navigation links.`} />
                <PromptExample text={`Build a portfolio for a mobile app developer named John, featuring app screenshots, skills, and a contact form. All code in one HTML file. Images only from https://i.imgur.com/, https://live.staticflickr.com/, https://images.unsplash.com/, or https://picsum.photos/. Do not include navigation bars or navigation links.`} />
              </ul>
              <div className="text-xs text-gray-400 mt-2">
                Click the copy icon to use a prompt with your favorite AI!
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Code Editor */}
      {editorOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              onClick={() => setEditorOpen(false)}
              aria-label="Close editor"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Portfolio Editor</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Paste your HTML, CSS, and JavaScript code below. This will be your live portfolio.
            </p>
            
            {/* Sanitization info */}
            {sanitizationLog.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong>Previous modifications made:</strong>
                    <ul className="mt-1 space-y-1">
                      {sanitizationLog.map((log, index) => (
                        <li key={index} className="text-xs">
                          • {log.action.replace(/_/g, ' ')}: {log.count} items
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <CodeEditor
                value={portfolioCode}
                onChange={setPortfolioCode}
                language="html"
              />
            )}
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="chef-button-secondary"
                onClick={() => setEditorOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="chef-button bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                onClick={handleSave}
                disabled={saving || loading}
              >
                {saving ? 'Saving...' : 'Save & Deploy'}
              </button>
            </div>
            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">{success}</div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

// Add this helper component at the bottom of the file (before export)
function PromptExample({ text }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };
  return (
    <li className="flex items-start gap-2">
      <span className="flex-1">{text}</span>
      <button
        onClick={handleCopy}
        title="Copy prompt"
        className="ml-2 text-gray-400 hover:text-purple-600 transition"
        style={{ minWidth: 24 }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" />
          <rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" />
        </svg>
      </button>
    </li>
  );
}

export default Dashboard;