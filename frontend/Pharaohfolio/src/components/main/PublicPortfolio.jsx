import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PublicPortfolio = () => {
  const { username } = useParams();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get(`/api/portfolio/u/${username}/`)
      .then(res => {
        if (res.data?.user_code) {
          setCode(res.data.user_code || '');
          setError('');
        } else {
          setError(res.data.error || 'Portfolio not found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load portfolio');
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100">
        <div className="text-lg text-gray-700">Loading portfolio...</div>
        <CopyrightFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
        <div className="text-xl text-red-600 font-semibold">{error}</div>
        <CopyrightFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <iframe
        title={`${username}'s Portfolio`}
        srcDoc={code}
        sandbox="allow-scripts"
        className="w-full min-h-screen border-0"
        style={{ minHeight: '100vh', width: '100%' }}
      />
      <CopyrightFooter />
    </div>
  );
};

// Copyright footer component
function CopyrightFooter() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 8,
        right: 12,
        zIndex: 50,
        fontSize: "0.85rem",
        opacity: 0.7,
        pointerEvents: "auto"
      }}
      className="text-gray-500"
    >
      <a
        href="https://pharaohfolio.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-purple-700 underline"
        style={{ textDecorationThickness: 1 }}
      >
        © Pharaohfolio
      </a>
    </div>
  );
}

export default PublicPortfolio;
