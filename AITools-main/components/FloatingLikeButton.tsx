import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { UI_TEXT } from '../constants';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
}

interface FloatingLikeButtonProps {
  lang: 'en' | 'zh';
}

const FloatingLikeButton: React.FC<FloatingLikeButtonProps> = ({ lang }) => {
  const [likes, setLikes] = useState(134);
  const [isLiked, setIsLiked] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const text = UI_TEXT[lang];

  const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const handleClick = () => {
    setIsLiked(true);
    setLikes(prev => prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);

    // Create explosion particles
    const newParticles: Particle[] = [];
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const velocity = 80 + Math.random() * 60;
      const x = Math.cos(angle) * velocity;
      const y = Math.sin(angle) * velocity - 60; // Bias upwards slightly

      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360
      });
    }

    setParticles(prev => [...prev, ...newParticles]);

    // Cleanup particles
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
       {/* Floating Particles Container */}
       <div className="absolute bottom-12 pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: p.color,
              transform: `translate(-50%, -50%)`,
              '--tx': `${p.x}px`,
              '--ty': `${p.y}px`,
              '--rot': `${p.rotation}deg`,
              animation: 'explode 0.8s ease-out forwards'
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Count Badge */}
      <div className={`
        mb-2 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg
        transition-all duration-300 transform
        ${isAnimating ? '-translate-y-2 opacity-100' : 'opacity-80'}
      `}>
        {likes} {text.likes}
      </div>

      {/* Main Button */}
      <button
        onClick={handleClick}
        className={`
          group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl 
          bg-gradient-to-br from-pink-500 to-rose-600 text-white
          hover:scale-110 active:scale-90 transition-all duration-200
        `}
        aria-label={text.like}
      >
        <Heart 
          size={24} 
          className={`
            transition-all duration-300 
            ${isLiked ? 'fill-white scale-110' : 'group-hover:scale-110'}
            ${isAnimating ? 'animate-ping' : ''}
          `}
        />
        
        {/* Ripple effect background */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:animate-ping duration-1000"></div>
      </button>

      <style>{`
        @keyframes explode {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0) rotate(var(--rot));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingLikeButton;