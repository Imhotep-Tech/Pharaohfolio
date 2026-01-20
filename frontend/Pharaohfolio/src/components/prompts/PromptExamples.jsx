import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../common/Footer';
import PharaohfolioLogo from '../../assets/PharaohfolioLogo.png';

const PromptExamples = () => {
  const [copiedPrompt, setCopiedPrompt] = useState(null);

  const basePrompt = `Create a complete single-page portfolio website in ONE HTML file with embedded CSS and JavaScript. 

IMPORTANT INSTRUCTIONS FOR THE USER:
1. After you generate the code, COPY the entire HTML code
2. Go to Pharaohfolio (pharaohfolio.vercel.app)
3. PASTE the code into the editor
4. Click "Save & Deploy" to publish your portfolio

REQUIREMENTS:
- Include sections for: hero, about, projects/portfolio, skills, and contact
- Use modern styling with gradients, animations, and responsive design
- Make it mobile-friendly and visually appealing
- For images, ONLY use URLs from these sources:
  * https://i.imgur.com/
  * https://live.staticflickr.com/
  * https://images.unsplash.com/
  * https://picsum.photos/
- Do NOT include navigation menus (nav elements)
- Avoid external links that could be security risks
- Use semantic HTML5 tags
- Include smooth scrolling and hover effects

Generate a professional, modern portfolio website following these requirements.`;

  const aiServices = [
    {
      name: 'ChatGPT',
      icon: '🤖',
      color: 'from-green-500 to-emerald-600',
      url: 'https://chat.openai.com/',
      description: 'Generate code with OpenAI ChatGPT'
    },
    {
      name: 'Claude',
      icon: '🧠',
      color: 'from-orange-500 to-amber-600',
      url: 'https://claude.ai/',
      description: 'Generate code with Anthropic Claude'
    },
    {
      name: 'Gemini',
      icon: '✨',
      color: 'from-blue-500 to-indigo-600',
      url: 'https://gemini.google.com/',
      description: 'Generate code with Google Gemini'
    }
  ];

  const handleCopyPrompt = (promptText) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(promptText);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const handleAIRedirect = (url, promptText) => {
    handleCopyPrompt(promptText);
    setTimeout(() => {
      window.open(url, '_blank');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 bg-chef-pattern">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-40 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="chef-card rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/30 backdrop-blur-2xl bg-white/90">
          <div className="text-center mb-8">
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
            <p className="text-gray-500 text-sm mb-4">Simple Hosting for Single-Page Portfolios</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-chef text-gray-800 mb-4">
              Generate Your Portfolio with AI
            </h1>
            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-3xl mx-auto">
              Use your favorite AI assistant to generate portfolio code, then paste it into Pharaohfolio to deploy instantly
            </p>
          </div>

          <Link 
            to="/dashboard" 
            className="chef-button bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white flex items-center space-x-2 justify-center w-full sm:w-auto mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* AI Service Buttons */}
        <div className="chef-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 backdrop-blur-2xl bg-white/90">
          <h2 className="text-2xl font-bold font-chef text-gray-800 mb-6 text-center">
            Choose Your AI Assistant
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {aiServices.map((service) => (
              <button
                key={service.name}
                onClick={() => handleAIRedirect(service.url, basePrompt)}
                className={`chef-card p-6 rounded-2xl shadow-lg border border-white/30 backdrop-blur-xl bg-white/90 hover:scale-105 transition-all duration-300 cursor-pointer group`}
              >
                <div className={`text-6xl mb-4 text-center`}>{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{service.name}</h3>
                <p className="text-gray-600 text-sm text-center mb-4">{service.description}</p>
                <div className={`chef-button bg-gradient-to-r ${service.color} text-white w-full text-center`}>
                  Open & Copy Prompt
                </div>
                {copiedPrompt === basePrompt && (
                  <p className="text-green-600 text-xs text-center mt-2 font-semibold">
                    ✓ Prompt copied!
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              How It Works
            </h3>
            <ol className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start">
                <span className="font-bold mr-2">1.</span>
                <span>Click any AI assistant button above - the prompt will be copied automatically</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2.</span>
                <span>Paste the prompt into the AI chat and wait for code generation</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3.</span>
                <span>Copy the complete HTML code from the AI's response</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">4.</span>
                <span>Return to Pharaohfolio and paste the code into the editor</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">5.</span>
                <span>Click "Save & Deploy" to publish your portfolio instantly!</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Base Prompt Display */}
        <div className="chef-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 backdrop-blur-2xl bg-white/90">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-chef text-gray-800">
              Base Prompt Template
            </h2>
            <button
              onClick={() => handleCopyPrompt(basePrompt)}
              className="chef-button bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              <span>{copiedPrompt === basePrompt ? 'Copied!' : 'Copy Prompt'}</span>
            </button>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{basePrompt}</pre>
          </div>
          <p className="text-gray-600 text-sm mt-4">
            This prompt includes all the necessary instructions for the AI to generate code and for you to deploy it on Pharaohfolio.
          </p>
        </div>

        {/* Tips Section */}
        <div className="chef-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 backdrop-blur-2xl bg-white/90">
          <h2 className="text-2xl font-bold font-chef text-gray-800 mb-6">
            Pro Tips for Better Results
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">✨ Be Specific</h3>
              <p className="text-purple-800 text-sm">
                Add details about your profession, color preferences, and desired sections to get personalized results.
              </p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <h3 className="font-bold text-indigo-900 mb-2">🎨 Request Themes</h3>
              <p className="text-indigo-800 text-sm">
                Ask for specific color schemes, dark mode, or design styles (minimal, modern, creative, etc.).
              </p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">🖼️ Use Allowed Images</h3>
              <p className="text-blue-800 text-sm">
                Only images from imgur, flickr, unsplash, or picsum will work. Mention this in your prompt.
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">🔄 Iterate</h3>
              <p className="text-green-800 text-sm">
                If you don't like the result, ask the AI to modify specific sections or change the style.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PromptExamples;
