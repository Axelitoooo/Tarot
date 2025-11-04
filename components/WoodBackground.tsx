import React from 'react';

interface WoodBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Composant avec effet bois réaliste via CSS
 */
export default function WoodBackground({ children, className = '' }: WoodBackgroundProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: `
          linear-gradient(90deg,
            #5C4A32 0%,
            #3E2F1F 20%,
            #5C4A32 40%,
            #2A1F14 60%,
            #3E2F1F 80%,
            #5C4A32 100%
          )
        `,
      }}
    >
      {/* Grain du bois - Lignes verticales */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.1) 2px,
              rgba(0, 0, 0, 0.1) 4px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 40px,
              rgba(0, 0, 0, 0.2) 40px,
              rgba(0, 0, 0, 0.2) 43px
            )
          `,
        }}
      />

      {/* Nœuds du bois - Cercles organiques */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 50px 30px at 20% 30%, rgba(0,0,0,0.3) 0%, transparent 50%),
            radial-gradient(ellipse 60px 40px at 80% 70%, rgba(0,0,0,0.25) 0%, transparent 50%),
            radial-gradient(ellipse 40px 25px at 50% 50%, rgba(0,0,0,0.2) 0%, transparent 50%),
            radial-gradient(ellipse 55px 35px at 10% 80%, rgba(0,0,0,0.28) 0%, transparent 50%)
          `,
        }}
      />

      {/* Brillance subtile */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(
              135deg,
              transparent 30%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 70%
            )
          `,
        }}
      />

      {/* Contenu */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
