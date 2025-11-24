import React from 'react';

const TechBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Grille de points technologiques */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Formes géométriques flottantes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/20 rotate-45 animate-float" />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 border border-accent-ia/20 rounded-full animate-float-delayed" />
      <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-primary/5 rotate-12 animate-float-slow" />
      <div className="absolute bottom-1/3 right-1/3 w-20 h-20 border-t-2 border-r-2 border-primary/30 animate-float" />
      
      {/* Lignes de connexion technologiques */}
      <div className="absolute top-0 left-0 w-full h-full">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="10" y1="10" x2="30" y2="25" stroke="rgba(96, 165, 250, 0.1)" strokeWidth="0.1" />
          <line x1="30" y1="25" x2="70" y2="15" stroke="rgba(96, 165, 250, 0.1)" strokeWidth="0.1" />
          <line x1="70" y1="15" x2="90" y2="40" stroke="rgba(96, 165, 250, 0.1)" strokeWidth="0.1" />
          <line x1="10" y1="90" x2="40" y2="70" stroke="rgba(96, 165, 250, 0.1)" strokeWidth="0.1" />
          <line x1="40" y1="70" x2="80" y2="85" stroke="rgba(96, 165, 250, 0.1)" strokeWidth="0.1" />
        </svg>
      </div>

      {/* Hexagones technologiques */}
      <div className="absolute top-1/2 left-1/6 w-12 h-12 border border-primary/20 rotate-0 animate-spin-slow">
        <div className="w-full h-full rotate-60">
          <div className="w-full h-full rotate-60">
            <div className="w-full h-full border border-primary/20 rotate-60" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-1/4 right-1/6 w-10 h-10 border border-accent-ia/20 rotate-12 animate-pulse" />

      {/* Cercles concentriques technologiques */}
      <div className="absolute top-1/5 right-1/5 w-20 h-20 rounded-full border border-primary/10 animate-ping-slow" />
      <div className="absolute top-1/5 right-1/5 w-20 h-20 rounded-full border border-primary/5 mt-2 ml-2 animate-ping-slower" />
    </div>
  );
};

export default TechBackground;