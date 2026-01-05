import React from "react";

interface GameStatsProps {
  score: number;
  rounds: number;
  nLevel: number;
  matches: {
    pos: number;
    audio: number;
  };
}

export const GameStats: React.FC<GameStatsProps> = ({
  score,
  rounds,
  nLevel,
  matches,
}) => {
  const totalTargets = matches.pos + matches.audio;
  const maxPossibleScore = totalTargets * 100;

  let accuracy = 0;


  if (totalTargets === 0) {
    accuracy = 100;
  } else {

    const rawAccuracy = Math.round((score / maxPossibleScore) * 100);
    accuracy = rawAccuracy < 0 ? 0 : rawAccuracy;
  }

  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return "text-green-400";
    if (acc >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 flex flex-col gap-6 h-screen fixed right-0 top-0 shadow-2xl z-10 overflow-y-auto">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Statistics</h2>
        <p className="text-gray-400 text-sm">Session Progress</p>
      </div>

      <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600 space-y-4">
        <div className="text-center border-b border-gray-600 pb-4">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
            Total Score
          </p>
          <div className="text-4xl font-mono font-bold text-white">{score}</div>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
            Accuracy
          </p>
          <div className={`text-5xl font-bold ${getAccuracyColor(accuracy)}`}>
            {accuracy}%
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Based on {totalTargets} targets
          </p>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <span className="text-gray-300">N-Level</span>
          <span className="font-bold text-yellow-400 text-xl">
            N = {nLevel}
          </span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <span className="text-gray-300">Total Rounds</span>
          <span className="font-bold text-white">{rounds}</span>
        </div>

        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <p className="mb-3 font-semibold text-gray-500 text-xs uppercase">
            Targets Appeared
          </p>
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-300">Position Matches:</span>
            <span className="font-mono font-bold text-white text-lg">
              {matches.pos}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-300">Audio Matches:</span>
            <span className="font-mono font-bold text-white text-lg">
              {matches.audio}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
