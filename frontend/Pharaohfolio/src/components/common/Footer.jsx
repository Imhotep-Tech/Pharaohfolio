import { Link } from 'react-router-dom';
import PharaohfolioLogo from '../../assets/PharaohfolioLogo.png';

function Footer() {
  return (
    <footer className="relative z-10 py-12 bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-indigo-950 border-t border-white/5 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full shadow-lg border-4 border-obsidian-900">
              <img 
                src={PharaohfolioLogo} 
                alt="Pharaohfolio Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>
          <div
            className="font-extrabold text-2xl sm:text-3xl mb-2 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600 bg-clip-text text-transparent font-chef drop-shadow-lg tracking-wide"
            style={{
              letterSpacing: '0.04em',
              lineHeight: '1.1',
              textShadow: '0 2px 8px rgba(212,175,55,0.15)'
            }}
          >
            Pharaohfolio
          </div>
          <p className="text-gray-400 text-sm mb-6">Simple Hosting for Single-Page Portfolios</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="https://imhoteptech.vercel.app/" className="hover:text-gold-400 transition-colors" target="_blank" rel="noopener noreferrer">Imhotep Tech</a>
            <a href="https://github.com/Imhotep-Tech/Pharaohfolio" className="hover:text-gold-400 transition-colors" target="_blank" rel="noopener noreferrer">Source Code</a>
            <a
              href="https://tally.so/r/nPKe1P"
              className="hover:text-gold-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Send feedback, request features, or report bugs on Tally"
            >
              Feedback & Bug Report
            </a>
          </div>
          <div className="border-t border-white/5 mt-8 pt-8">
            <p className="text-gray-500 text-xs">&copy; 2026 Pharaohfolio. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;