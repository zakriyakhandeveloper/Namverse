'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function LoadingAnimation({ onComplete }) {
  const [showAnimation, setShowAnimation] = useState(true);
  const [currentNameIndex, setCurrentNameIndex] = useState(0);

  const featuredNames = [
    { name: 'NameVerse', meaning: 'Universe of Names', color: 'from-blue-500 to-purple-600' },
    { name: 'أحمد', meaning: 'Ahmad - Most Praised', color: 'from-emerald-500 to-teal-600' },
    { name: 'आदित्य', meaning: 'Aditya - Sun', color: 'from-orange-500 to-amber-600' },
    { name: 'Sophia', meaning: 'Wisdom', color: 'from-indigo-500 to-blue-600' },
  ];

  useEffect(() => {
    // Cycle through names
    const nameInterval = setInterval(() => {
      setCurrentNameIndex((prev) => (prev + 1) % featuredNames.length);
    }, 800);

    // Complete animation after 3.2 seconds
    const timer = setTimeout(() => {
      setShowAnimation(false);
      if (onComplete) onComplete();
    }, 3200);

    return () => {
      clearInterval(nameInterval);
      clearTimeout(timer);
    };
  }, []);

  if (!showAnimation) return null;

  const currentName = featuredNames[currentNameIndex];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-fadeIn">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)`
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        {/* Logo */}
        <div className="mb-8 animate-scaleIn">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <img
              src="/logo.svg"
              alt="NameVerse Logo"
              width="96"
              height="96"
              className="w-full h-full object-contain drop-shadow-2xl animate-float"
            />
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
          </div>
        </div>

        {/* Animated Name Display */}
        <div className="mb-8 h-32 flex flex-col items-center justify-center">
          <div className="relative">
            <h1
              className={`text-5xl sm:text-6xl font-bold bg-gradient-to-r ${currentName.color} bg-clip-text text-transparent animate-slideUp mb-2`}
              key={currentName.name}
            >
              {currentName.name}
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl animate-pulse" />
          </div>

          <p
            className="text-gray-300 text-lg sm:text-xl mt-2 animate-fadeIn"
            key={`${currentName.name}-meaning`}
          >
            {currentName.meaning}
          </p>
        </div>

        {/* Sparkles Effect */}
        <div className="flex justify-center gap-3 mb-6">
          {[...Array(3)].map((_, i) => (
            <Sparkles
              key={i}
              className="w-6 h-6 text-yellow-400 animate-sparkle"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Loading Bar */}
        <div className="w-64 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full animate-loadingBar" />
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-sm mt-6 animate-fadeIn">
          Discover the perfect name
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes loadingBar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }

        .animate-loadingBar {
          animation: loadingBar 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
