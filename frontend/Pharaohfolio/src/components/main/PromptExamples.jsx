import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PROMPTS = [
  "Create a portfolio website for a frontend developer named [Your Name] (e.g. specializing in [Your Specialty]). If you do not know me or if I leave the placeholders in brackets [ ] unchanged, please use your knowledge about me to fill them in, or generate high-quality realistic mock details fitting this role. Design a modern interface with a hero section, about, projects list, and a contact form. Use HTML, CSS, and JavaScript in one file. For images, use only links from https://i.imgur.com/ or https://live.staticflickr.com/. Do not include navigation bars or navigation links.",
  "Generate a single-file HTML/CSS/JS portfolio for a graphic designer named [Your Name] (specializing in [Your Art Style]). If you do not know me or if I leave the placeholders in brackets [ ] unchanged, please use your knowledge about me to fill them in, or generate high-quality realistic mock details fitting this role. Include a gallery section (use imgur or flickr images), animated transitions, and a dark theme. Only use images from https://i.imgur.com/ or https://live.staticflickr.com/. Do not include navigation bars or navigation links.",
  "Build a responsive portfolio page for a data scientist named [Your Name] (focusing on [Your Focus Area]). If you do not know me or if I leave the placeholders in brackets [ ] unchanged, please use your knowledge about me to fill them in, or generate high-quality realistic mock details fitting this role. Include sections for bio, skills, projects (with charts using only CSS/HTML), and contact info. Use only HTML, CSS, and JavaScript. Images must be from https://i.imgur.com/ or https://live.staticflickr.com/. Do not include navigation bars or navigation links.",
  "Create a one-page resume website for a backend engineer named [Your Name] (specializing in [Your Tech Stack]). If you do not know me or if I leave the placeholders in brackets [ ] unchanged, please use your knowledge about me to fill them in, or generate high-quality realistic mock details fitting this role. Include a timeline of experience, skills, and a CV link. Use HTML, CSS, and JavaScript in one file. Images only from https://i.imgur.com/ or https://live.staticflickr.com/. Do not include navigation bars or navigation links.",
  "Make a creative portfolio for a photographer named [Your Name] (focusing on [Your Photography Style]). If you do not know me or if I leave the placeholders in brackets [ ] unchanged, please use your knowledge about me to fill them in, or generate high-quality realistic mock details fitting this role. Include a fullscreen color slider, about section, and contact form. Use imgur or flickr images only (https://i.imgur.com/ or https://live.staticflickr.com/). Do not include navigation bars or navigation links.",
  "Design a portfolio for a UI/UX designer named [Your Name] (specializing in [Your Design Focus]). If you do not know me or if I leave the placeholders in brackets [ ] unchanged, please use your knowledge about me to fill them in, or generate high-quality realistic mock details fitting this role. Include a case studies section, testimonials, and a minimal, clean layout. Use HTML, CSS, and JavaScript in one file. Images only from https://i.imgur.com/ or https://live.staticflickr.com/. Do not include navigation bars or navigation links.",
  "Create a personal landing page for a student named [Your Name] (studying [Your Major]). If you do not know me or if I leave the placeholders in brackets [ ] unchanged, please use your knowledge about me to fill them in, or generate high-quality realistic mock details fitting this role. Include sections for education, projects, and social links (as text or <a> tags). Use only HTML, CSS, and JavaScript. Images only from https://i.imgur.com/ or https://live.staticflickr.com/. Do not include navigation bars or navigation links.",
  "Build a portfolio for a mobile app developer named [Your Name] (building [Your App Focus]). If you do not know me or if I leave the placeholders in brackets [ ] unchanged, please use your knowledge about me to fill them in, or generate high-quality realistic mock details fitting this role. Feature app screenshots, skills, and a contact form. All code in one HTML file. Images only from https://i.imgur.com/ or https://live.staticflickr.com/. Do not include navigation bars or navigation links.",
  "Create a portfolio for a digital marketer named [Your Name] (specializing in [Your Marketing Niche]). If you do not know me or if I leave the placeholders in brackets [ ] unchanged, please use your knowledge about me to fill them in, or generate high-quality realistic mock details fitting this role. Include a blog section, portfolio, and contact form. Use HTML, CSS, and JavaScript. Images only from https://i.imgur.com/ or https://live.staticflickr.com/. Do not include navigation bars or navigation links.",
  "Generate a portfolio for a DevOps engineer named [Your Name] (specializing in [Your Cloud Platform]). If you do not know me or if I leave the placeholders in brackets [ ] unchanged, please use your knowledge about me to fill them in, or generate high-quality realistic mock details fitting this role. Include a section for certifications, tools, and a projects timeline. Use only HTML, CSS, and JavaScript. Images only from https://i.imgur.com/ or https://live.staticflickr.com/. Do not include navigation bars or navigation links.",
  "Build a portfolio for a game developer named [Your Name] (focusing on [Your Game Genre]). If you do not know me or if I leave the placeholders in brackets [ ] unchanged, please use your knowledge about me to fill them in, or generate high-quality realistic mock details fitting this role. Include a playable mini-game demo (like Canvas Pong or similar), about section, and contact info. All code in one HTML file. Images only from https://i.imgur.com/ or https://live.staticflickr.com/. Do not include navigation bars or navigation links.",
  "Create a portfolio for a writer named [Your Name] (writing [Your Genre/Topic]). If you do not know me or if I leave the placeholders in brackets [ ] unchanged, please use your knowledge about me to fill them in, or generate high-quality realistic mock details fitting this role. Include a blog, published works list, and a contact form. Use HTML, CSS, and JavaScript in one file. Images only from https://i.imgur.com/ or https://live.staticflickr.com/. Do not include navigation bars or navigation links."
];

function PromptExamples() {
  let currentUser = null;
  try {
    const auth = useAuth();
    currentUser = auth?.user;
  } catch (e) {
    // Ignore context issues
  }

  const realName = currentUser 
    ? (`${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.username) 
    : '';

  const getPromptText = (rawText) => {
    const finalName = realName || "[Your Name]";
    let processed = rawText.replace(/\[Your Name\]/g, finalName);
    
    if (realName) {
      processed = processed.replace(
        /use your knowledge about me to fill them in/g,
        `check your active memory, search context, custom instructions, or chat history for any information about me (${realName}) to fill them in`
      );
    }
    return processed;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-indigo-950 bg-pharaoh-pattern py-12 px-4 text-white">
      <div className="max-w-4xl mx-auto pharaoh-card rounded-2xl shadow-xl p-8 border border-white/10 bg-obsidian-900/60 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/dashboard" 
            className="text-xs text-gold-400 hover:text-gold-300 font-bold transition flex items-center gap-1"
          >
            ← Back to Dashboard
          </Link>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">Pharaohfolio Helper</span>
        </div>

        <h1 className="text-3xl font-bold font-chef mb-6 text-center bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600 bg-clip-text text-transparent">
          AI Prompt Examples
        </h1>

        {realName && (
          <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-emerald-300 text-xs text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
            <div>
              <span className="text-gold-400 font-bold block sm:inline mr-1">👤 Detected Profile:</span>
              Your account name is <b>{realName}</b>. Prompt templates have been automatically customized to pre-fill your name and instruct the AI (Gemini, Claude, or ChatGPT) to query its memory for details about you!
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 self-start sm:self-auto flex-shrink-0">
              ⚡ AUTO-FILLED
            </span>
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-left">
          <div className="p-4 bg-amber-950/40 border border-amber-900/50 rounded-xl text-amber-300 leading-relaxed">
            <b className="text-gold-400 block mb-1">⚠️ Security Notice:</b> 
            For your safety, <b>only &lt;img&gt; tags with src from <span className="underline">https://i.imgur.com/</span>, <span className="underline">https://live.staticflickr.com/</span>, <span className="underline">https://images.unsplash.com/</span>, or <span className="underline">https://picsum.photos/</span> are allowed</b>. 
            All other images and all navigation bars/links will be removed. You may use <b>&lt;a&gt;</b> tags for external links. 
            To add images, upload them to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="underline text-gold-400 hover:text-gold-300">imgur.com</a> and use the direct image link.
            <br />
            <b className="text-gold-400 block mt-2 mb-1">🚫 Navigation Bars & Links:</b>
            Navigation bars and navigation links are not allowed and will be removed automatically for safety.
          </div>
          
          <div className="p-4 bg-blue-950/40 border border-blue-900/50 rounded-xl text-blue-300 leading-relaxed">
            <b className="text-gold-400 block mb-1">✨ Smart Placeholders:</b> 
            These prompts contain placeholders in square brackets like <span className="text-gold-300 font-mono">[Your Name]</span>. 
            You can replace them with your details before running. 
            <br className="mb-1" />
            If you leave them unchanged or unfilled, the prompts are pre-configured to tell the AI (like Gemini, ChatGPT, or Claude) to fill them in using its knowledge about you, or fallback to generating realistic mock data fitting that profession!
          </div>
        </div>
        <p className="text-gray-400 mb-6 text-center text-sm">
          Use these prompts with your favorite AI to generate amazing portfolio pages. Copy prompt or open directly in your preferred chatbot!
        </p>
        <ul className="space-y-4">
          {PROMPTS.map((prompt, idx) => (
            <PromptExample key={idx} text={getPromptText(prompt)} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function PromptExample({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <li className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white/5 border border-white/5 hover:border-gold-500/20 rounded-xl p-4 transition-all duration-300">
      <span className="flex-1 text-sm text-gray-200 leading-relaxed text-left">{text}</span>
      <div className="flex flex-wrap items-center gap-2 flex-shrink-0 self-start lg:self-center">
        {/* Copy Prompt Button */}
        <button
          onClick={handleCopy}
          title="Copy prompt text"
          className="text-gray-400 hover:text-gold-400 transition flex items-center justify-center p-2 bg-white/5 rounded-lg border border-white/5"
          style={{ minHeight: 36 }}
        >
          {copied ? (
            <span className="text-xs text-emerald-400 font-bold">✓ Copied</span>
          ) : (
            <div className="flex items-center gap-1.5 text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" />
                <rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" />
              </svg>
              <span>Copy</span>
            </div>
          )}
        </button>

        {/* Send to ChatGPT */}
        <a
          href={`https://chatgpt.com/?q=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Open and run in ChatGPT"
          className="text-emerald-400 hover:text-emerald-300 transition flex items-center justify-center px-2.5 py-2 bg-emerald-950/20 hover:bg-emerald-950/40 rounded-lg border border-emerald-500/10 text-xs font-semibold"
          style={{ minHeight: 36 }}
        >
          💬 ChatGPT
        </a>

        {/* Send to Claude */}
        <a
          href={`https://claude.ai/new?q=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Open and run in Claude"
          className="text-amber-400 hover:text-amber-300 transition flex items-center justify-center px-2.5 py-2 bg-amber-950/20 hover:bg-amber-950/40 rounded-lg border border-amber-500/10 text-xs font-semibold"
          style={{ minHeight: 36 }}
        >
          🧠 Claude
        </a>

        {/* Send to Gemini */}
        <a
          href={`https://gemini.google.com/app?prompt=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            navigator.clipboard.writeText(text);
          }}
          title="Copy prompt and open Gemini"
          className="text-blue-400 hover:text-blue-300 transition flex items-center justify-center px-2.5 py-2 bg-blue-950/20 hover:bg-blue-950/40 rounded-lg border border-blue-500/10 text-xs font-semibold"
          style={{ minHeight: 36 }}
        >
          ✨ Gemini
        </a>
      </div>
    </li>
  );
}

export default PromptExamples;
