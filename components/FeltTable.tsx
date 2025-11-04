import React from 'react';

interface FeltTableProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Composant table de jeu avec texture feutre vert réaliste
 */
export default function FeltTable({ children, className = '' }: FeltTableProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: `
          radial-gradient(circle at 50% 50%,
            #2C5F2D 0%,
            #1F4620 50%,
            #16330F 100%
          )
        `,
      }}
    >
      {/* Texture feutre - Fibre */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(255, 255, 255, 0.03) 1px,
              rgba(255, 255, 255, 0.03) 2px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 1px,
              rgba(255, 255, 255, 0.03) 1px,
              rgba(255, 255, 255, 0.03) 2px
            )
          `,
        }}
      />

      {/* Bruit / Grain */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(255,255,255,0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0,0,0,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(255,255,255,0.03) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(0,0,0,0.08) 0%, transparent 50%)
          `,
        }}
      />

      {/* Ombre centrale douce */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 60% 60% at 50% 50%,
              transparent 0%,
              rgba(0, 0, 0, 0.3) 100%
            )
          `,
        }}
      />

      {/* Contenu */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
