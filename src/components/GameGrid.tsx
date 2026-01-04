import React from 'react';

interface GameGridProps {
  activeIdx: number | null;
}

export const GameGrid: React.FC<GameGridProps> = ({ activeIdx }) => {
  const cells = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800 rounded-xl shadow-2xl">
      {cells.map((idx) => {
        const isActive = idx === activeIdx;
        
        return (
          <div
            key={idx}
            className={`
              w-24 h-24 rounded-lg transition-all duration-200 border-2
              ${isActive 
                ? 'bg-blue-500 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-105' 
                : 'bg-gray-700 border-gray-600'
              }
            `}
          />
        );
      })}
    </div>
  );
};