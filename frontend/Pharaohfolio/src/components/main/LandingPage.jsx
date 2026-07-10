import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../common/Footer';
import PharaohfolioLogo from '../../assets/PharaohfolioLogo.png';

const MOCK_TEMPLATES = {
  developer: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #0b0f19; color: #ffffff; margin: 0; padding: 2.5rem 1.5rem; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; box-sizing: border-box;}
    .profile-img { width: 90px; height: 90px; border-radius: 50%; border: 3px solid #fbcd3d; margin-bottom: 1.5rem; object-fit: cover; box-shadow: 0 0 20px rgba(212,175,55,0.2); }
    h1 { font-size: 1.8rem; margin: 0 0 0.5rem 0; background: linear-gradient(135deg, #fff 0%, #a3a3a3 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p.title { color: #fbcd3d; font-size: 0.95rem; margin: 0 0 1.5rem 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;}
    p.bio { color: #9ca3af; font-size: 0.9rem; max-width: 320px; margin: 0 auto 2rem auto; line-height: 1.6; }
    .links { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 280px; }
    .link-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 0.8rem; border-radius: 8px; font-weight: 500; text-decoration: none; font-size: 0.9rem; transition: all 0.2s ease; }
    .link-btn:hover { background: rgba(212,175,55,0.1); border-color: #fbcd3d; color: #fbcd3d; }
  </style>
</head>
<body>
  <img class="profile-img" src="https://picsum.photos/id/64/150/150" alt="Avatar">
  <h1>Alex Rivera</h1>
  <p class="title">Full Stack Engineer</p>
  <p class="bio">Building high-performance interactive interfaces. Let's build something exceptional.</p>
  <div class="links">
    <a href="#" class="link-btn">GitHub</a>
    <a href="#" class="link-btn">LinkedIn</a>
    <a href="#" class="link-btn">Contact Me</a>
  </div>
</body>
</html>`,
  photographer: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #050505; color: #ffffff; margin: 0; padding: 2rem 1rem; text-align: center; }
    h1 { font-size: 1.5rem; font-weight: 300; letter-spacing: 0.15em; margin: 1rem 0 0.25rem 0; text-transform: uppercase; }
    p.subtitle { color: #888888; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 2rem 0; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; max-width: 320px; margin: 0 auto; }
    .img-box { position: relative; width: 100%; aspect-ratio: 1; border-radius: 4px; overflow: hidden; }
    .img-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
    .img-box img:hover { transform: scale(1.05); }
    .footer { margin-top: 2rem; font-size: 0.75rem; color: #666666; }
  </style>
</head>
<body>
  <h1>Leila Vance</h1>
  <p class="subtitle">Fine Art & Photography</p>
  <div class="grid">
    <div class="img-box"><img src="https://picsum.photos/id/10/300/300" alt="Fine Art"></div>
    <div class="img-box"><img src="https://picsum.photos/id/29/300/300" alt="Fine Art"></div>
    <div class="img-box"><img src="https://picsum.photos/id/43/300/300" alt="Fine Art"></div>
    <div class="img-box"><img src="https://picsum.photos/id/48/300/300" alt="Fine Art"></div>
  </div>
  <p class="footer">Based in Cairo. Available worldwide.</p>
</body>
</html>`,
  writer: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: Georgia, serif; background: #faf8f5; color: #1c1917; margin: 0; padding: 2.5rem 1.5rem; line-height: 1.6; }
    .header { text-align: center; border-bottom: 2px solid #e7e5e4; padding-bottom: 1.5rem; margin-bottom: 2rem; }
    h1 { font-size: 1.8rem; margin: 0 0 0.5rem 0; font-family: inherit; font-weight: 700; color: #292524; }
    p.subtitle { font-style: italic; color: #78716c; margin: 0; font-size: 0.95rem; }
    .article-list { display: flex; flex-direction: column; gap: 1.5rem; }
    .article { border-left: 3px solid #d4af37; padding-left: 1rem; text-align: left; }
    .article h3 { margin: 0 0 0.5rem 0; font-size: 1.1rem; color: #292524; }
    .article p { margin: 0; color: #57524e; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Olivia Vance</h1>
    <p class="subtitle">Essays on Culture, Design, and Identity</p>
  </div>
  <div class="article-list">
    <div class="article">
      <h3>The Quiet Architecture of Ruins</h3>
      <p>An exploration of modern concrete ruins and how they interact with urban rewilding and nature.</p>
    </div>
    <div class="article">
      <h3>Analog Minds in Digital Mediums</h3>
      <p>How the physical texture of print influences structural retention and writing discipline.</p>
    </div>
  </div>
</body>
</html>`
};

function LandingPage() {
  const [activeTemplate, setActiveTemplate] = useState('developer');
  const [simulationState, setSimulationState] = useState('idle'); // 'idle' | 'copying' | 'pasting' | 'deployed'
  const [simulatedCode, setSimulatedCode] = useState('');
  const [typedPrompt, setTypedPrompt] = useState('');
  
  const simulationTimerRef = useRef(null);

  // Restart simulator when active template changes
  useEffect(() => {
    // Clear previous timers
    if (simulationTimerRef.current) clearTimeout(simulationTimerRef.current);
    
    setSimulationState('idle');
    setSimulatedCode('');
    setTypedPrompt('');

    // Start Simulation Flow
    // Phase 1: Type the prompt
    let promptText = activeTemplate === 'developer'
      ? 'Create a modern developer bio links site with gold accents.'
      : activeTemplate === 'photographer'
      ? 'Generate a minimalist dark photography grid page.'
      : 'Build a editorial writer article index page.';

    let currentLength = 0;
    const typeInterval = setInterval(() => {
      if (currentLength < promptText.length) {
        setTypedPrompt(promptText.substring(0, currentLength + 1));
        currentLength++;
      } else {
        clearInterval(typeInterval);
        
        // Phase 2: Copying AI code (simulates code typing in codeblock)
        simulationTimerRef.current = setTimeout(() => {
          setSimulationState('copying');
          setSimulatedCode(MOCK_TEMPLATES[activeTemplate].substring(0, 180) + '\n\n/* ... [AI Code Block Generated] ... */');

          // Phase 3: Click Deploy & Paste
          simulationTimerRef.current = setTimeout(() => {
            setSimulationState('pasting');
            
            // Phase 4: Live Link active
            simulationTimerRef.current = setTimeout(() => {
              setSimulationState('deployed');
            }, 1200);
          }, 1500);
        }, 800);
      }
    }, 45);

    return () => {
      clearInterval(typeInterval);
      if (simulationTimerRef.current) clearTimeout(simulationTimerRef.current);
    };
  }, [activeTemplate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-indigo-950 bg-pharaoh-pattern text-white relative overflow-hidden">
      {/* Decorative Golden Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,rgba(0,0,0,0)_60%)] filter blur-3xl opacity-80 animate-float"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,rgba(0,0,0,0)_65%)] filter blur-3xl opacity-85 animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 lg:pt-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex p-4 bg-white/5 rounded-full mb-6 border border-white/10 shadow-2xl backdrop-blur-xl hover:scale-105 transition-transform duration-300">
              <img 
                src={PharaohfolioLogo} 
                alt="Pharaohfolio Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-chef text-white mb-6 leading-tight">
              Your AI Portfolio, <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600 bg-clip-text text-transparent">
                Hosted in 3 Seconds.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              No servers, no domains, no code required. Just copy the code from your favorite AI (ChatGPT, Claude, Gemini) and paste it here to get your live URL!
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 relative z-20">
              <Link
                to="/register"
                className="pharaoh-button text-obsidian-950 px-10 py-4 font-bold text-lg shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] rounded-xl min-w-[200px]"
              >
                🚀 Start Free
              </Link>
              <Link
                to="/login"
                className="pharaoh-button-secondary text-gold-400 px-10 py-4 font-bold text-lg rounded-xl min-w-[200px]"
              >
                🔓 Sign In
              </Link>
            </div>
            
            {/* Quick Helper Badge */}
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1.5 mt-2">
              <span>⚡ Paste-and-Deploy Hosting</span>
              <span>•</span>
              <span>No Credit Card Required</span>
            </div>
          </div>

          {/* Interactive AI-to-Live Simulator */}
          <div className="max-w-5xl mx-auto mt-12 mb-20 relative z-20">
            {/* Template Toggle Buttons */}
            <div className="flex justify-center gap-2 mb-8">
              {['developer', 'photographer', 'writer'].map((tpl) => (
                <button
                  key={tpl}
                  onClick={() => setActiveTemplate(tpl)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 border ${
                    activeTemplate === tpl
                      ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-obsidian-950 border-transparent shadow-lg scale-105'
                      : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {tpl.charAt(0).toUpperCase() + tpl.slice(1)} Portfolio
                </button>
              ))}
            </div>

            {/* Simulator Board */}
            <div className="grid lg:grid-cols-12 gap-8 items-center bg-obsidian-900/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
              {/* Left Side: The Input Process */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Visual Step 1: AI Prompt Screen */}
                <div className="rounded-xl bg-obsidian-950/80 border border-white/5 overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      AI Assistant Chat (Claude / ChatGPT)
                    </span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-white/20"></div>
                      <div className="w-2 h-2 rounded-full bg-white/20"></div>
                      <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex justify-end">
                      <div className="bg-white/10 text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-sm max-w-[85%] font-medium">
                        {typedPrompt || <span className="text-gray-600">Typing prompt...</span>}
                      </div>
                    </div>
                    {simulationState !== 'idle' && (
                      <div className="flex justify-start">
                        <div className="bg-blue-950/40 border border-blue-900/30 text-gray-200 rounded-2xl rounded-tl-none px-4 py-3 text-sm max-w-[90%] space-y-2">
                          <p className="font-semibold text-blue-400">🤖 AI Assistant:</p>
                          <p className="text-xs">Here is your single-file portfolio code. Click to copy it!</p>
                          <div className="relative">
                            <pre className="text-[11px] font-mono bg-black/60 p-2.5 rounded border border-white/5 text-emerald-400 overflow-hidden leading-relaxed select-none font-sans">
                              <code>{simulatedCode}</code>
                            </pre>
                            <div className="absolute right-2 top-2">
                              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                                📋 Code Ready
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visual Step 2: Paste Panel */}
                {simulationState !== 'idle' && (
                  <div className={`rounded-xl bg-obsidian-950/80 border transition-all duration-500 overflow-hidden shadow-lg ${
                    simulationState === 'pasting' || simulationState === 'deployed' 
                      ? 'border-gold-500/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]' 
                      : 'border-white/5 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
                      <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                        Pharaohfolio Editor Panel
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">dashboard/editor</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="bg-black/60 border border-white/5 p-3 rounded h-20 flex items-center justify-center relative overflow-hidden">
                        {simulationState === 'pasting' || simulationState === 'deployed' ? (
                          <div className="text-center font-mono text-xs text-gold-400 animate-pulse">
                            Pasted! Extracting code details...
                          </div>
                        ) : (
                          <div className="text-center text-xs text-gray-500 font-medium flex flex-col items-center gap-1">
                            <span>Waiting for code paste...</span>
                          </div>
                        )}
                        {simulationState === 'copying' && (
                          <div className="absolute inset-0 bg-gold-500/5 flex items-center justify-center animate-pulse">
                            <span className="text-[10px] bg-gold-500/10 text-gold-300 px-3 py-1 rounded-full border border-gold-500/20 font-bold uppercase tracking-wider animate-bounce">
                              Copying Code from AI...
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <button 
                          className={`px-4 py-2 rounded text-xs font-bold transition-all duration-300 ${
                            simulationState === 'pasting'
                              ? 'bg-gold-500 text-obsidian-950 scale-102 pulse-gold'
                              : simulationState === 'deployed'
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-white/10 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {simulationState === 'deployed' ? '✓ Deployed Successfully' : '🚀 Save & Deploy'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: The Smartphone Preview Frame */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="text-center mb-3">
                  <span className="text-xs bg-gold-500/10 text-gold-400 font-bold px-3 py-1 rounded-full border border-gold-500/20 uppercase tracking-widest">
                    Simulated Smartphone view
                  </span>
                </div>
                
                {/* Phone Shell */}
                <div className="w-[280px] h-[520px] bg-[#0c0d13] border-[6px] border-[#2b2d35] rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col z-10">
                  {/* Phone Speaker/Camera notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-[#2b2d35] rounded-b-2xl z-30 flex items-center justify-center">
                    <div className="w-12 h-1 bg-black rounded-full mb-1.5"></div>
                  </div>

                  {/* Browser URL Bar */}
                  <div className="pt-6 pb-2 px-3 bg-obsidian-900 border-b border-white/5 z-20">
                    <div className="w-full bg-black/60 rounded-lg px-2 py-1.5 flex items-center justify-between text-[10px] text-gray-400 border border-white/5 font-mono">
                      <div className="flex items-center gap-1.5 truncate">
                        {simulationState === 'deployed' ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                        )}
                        <span className="truncate">pharaohfolio.com/u/user</span>
                      </div>
                      {simulationState === 'deployed' && (
                        <span className="text-emerald-400 text-[9px] font-bold tracking-wider animate-pulse flex-shrink-0">
                          LIVE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Phone Screen/Iframe content */}
                  <div className="flex-1 bg-white relative">
                    {simulationState === 'deployed' ? (
                      <iframe
                        srcDoc={MOCK_TEMPLATES[activeTemplate]}
                        title="Simulated Portfolio"
                        sandbox="allow-scripts"
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-obsidian-950 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-xl mb-4 animate-bounce">
                          📱
                        </div>
                        <p className="text-xs text-gray-400 font-semibold mb-2">Simulated Live Browser</p>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                          Once the AI code is pasted and deployed, your portfolio appears here instantly.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Stepper Section */}
      <section className="relative z-10 py-16 border-t border-white/5 bg-obsidian-950/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-chef text-white mb-4">
              How Pharaohfolio Works
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Skip complex configurations. Go live in 3 simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                icon: "🤖",
                title: "Ask any AI for Code",
                description: "Ask ChatGPT, Gemini, or Claude to build you a portfolio in a single HTML file with embedded styling."
              },
              {
                step: "2",
                icon: "📋",
                title: "Paste & Clean Code",
                description: "Paste your generated code in Pharaohfolio. Our compiler automatically strips away markdown brackets."
              },
              {
                step: "3",
                icon: "🚀",
                title: "Instantly Live",
                description: "Click Deploy and get a permanent hosted link under your username. Edit anytime."
              }
            ].map((item, index) => (
              <div key={index} className="pharaoh-card rounded-2xl p-6 border border-white/5 bg-obsidian-900/30 text-center relative hover:scale-102 transition-transform duration-300">
                <div className="absolute -top-4 left-6 w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center font-bold text-obsidian-950 text-sm shadow-md">
                  {item.step}
                </div>
                <div className="text-4xl mb-4 mt-2">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="relative z-10 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-chef text-white mb-4">
              Perfect For Anyone Without Coding Skills
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Get a professional resume online without learning Git, domains, or HTML.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: "🎨", title: "Designers & Artists", desc: "Display visual grids, paintings, or design files easily." },
              { icon: "💼", title: "Freelancers", desc: "Share a sleek list of links and client contact forms." },
              { icon: "🎓", title: "Students", desc: "Display academic resumes and university projects." },
              { icon: "🚀", title: "Creators", desc: "A personal landing page linking all your social handles." }
            ].map((benefit, index) => (
              <div key={index} className="pharaoh-card rounded-xl p-6 border border-white/5 bg-obsidian-900/20 text-center">
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold text-white text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Try with Demo section */}
      <section className="relative z-10 py-16 border-t border-white/5 bg-obsidian-950/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <div className="pharaoh-card rounded-3xl p-10 sm:p-12 border border-white/10 bg-gradient-to-br from-obsidian-900 to-indigo-950 shadow-2xl relative">
            <div className="absolute top-0 right-10 w-24 h-24 bg-gold-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex justify-center mb-4">
              <img 
                src={PharaohfolioLogo} 
                alt="Pharaohfolio Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-chef text-white mb-4">
              Ready to Share Your Portfolio?
            </h2>
            <p className="text-gray-300 text-base mb-8 max-w-lg mx-auto">
              Join Pharaohfolio today. Host your custom Single-Page sites and resumes instantly.
            </p>
            <div className="flex justify-center items-center">
              <Link
                to="/register"
                className="pharaoh-button text-obsidian-950 px-10 py-4 font-bold text-lg rounded-xl shadow-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] max-w-xs text-center"
              >
                🚀 Register Account Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;