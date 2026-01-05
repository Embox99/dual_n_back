"use client";

import { useEffect, useState } from "react";
import { GameGrid } from "../components/GameGrid";
import { GameStats } from "../components/GameStats";
import { useDualNBack } from "../hooks/useDualNBack";

export default function Home() {
  const [nLevel, setNLevel] = useState(2);
  const [maxRounds, setMaxRounds] = useState(40);

  const {
    isPlaying,
    currentStep,
    score,
    rounds,
    matches,
    startGame,
    stopGame,
    checkPositionMatch,
    checkAudioMatch,
    feedback,
  } = useDualNBack(nLevel, 2500, maxRounds);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.code === "KeyA") checkPositionMatch();
      if (e.code === "KeyL") checkAudioMatch();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, checkPositionMatch, checkAudioMatch]);

  return (
    <main className="flex min-h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col items-center justify-center relative mr-80">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 mb-8">
          Dual {nLevel}-Back
        </h1>

        <div className="flex gap-6 mb-6 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
          <div className="flex flex-col items-center">
            <label className="text-gray-400 text-xs uppercase font-bold mb-2">
              N-Level
            </label>
            <div className="flex items-center gap-2">
              <button
                disabled={isPlaying || nLevel <= 1}
                onClick={() => setNLevel((n) => n - 1)}
                className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-bold"
              >
                -
              </button>
              <span className="text-xl font-mono w-8 text-center">
                {nLevel}
              </span>
              <button
                disabled={isPlaying}
                onClick={() => setNLevel((n) => n + 1)}
                className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="w-px bg-gray-700 mx-2"></div>

          <div className="flex flex-col items-center">
            <label className="text-gray-400 text-xs uppercase font-bold mb-2">
              Rounds
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={maxRounds}
                disabled={isPlaying}
                onChange={(e) => setMaxRounds(Number(e.target.value))}
                className="w-16 bg-gray-700 border border-gray-600 rounded p-1 text-center font-mono text-lg focus:outline-none focus:border-blue-500"
                step={5}
                min={10}
              />
            </div>
          </div>
        </div>

        <GameGrid activeIdx={currentStep ? currentStep.position : null} />

        <div className="flex gap-4 mt-8">
          {!isPlaying ? (
            <button
              onClick={startGame}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-xl transition shadow-lg shadow-blue-500/20 tracking-wider"
            >
              START
            </button>
          ) : (
            <button
              onClick={stopGame}
              className="px-10 py-4 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-xl transition tracking-wider"
            >
              STOP
            </button>
          )}
        </div>

        <div className="flex gap-8 mt-8">
          <button
            onClick={checkPositionMatch}
            disabled={!isPlaying}
            className={`
              w-36 h-36 rounded-2xl border-4 font-bold text-xl flex flex-col items-center justify-center transition-all duration-100
              ${
                feedback.pos === "correct"
                  ? "bg-green-600 border-green-400 scale-95 shadow-inner"
                  : feedback.pos === "wrong"
                  ? "bg-red-900/50 border-red-500"
                  : feedback.pos === "missed"
                  ? "bg-orange-500/50 border-orange-400"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-750"
              }
            `}
          >
            <span>Position</span>
            <kbd className="mt-2 px-3 py-1 bg-gray-900 rounded text-sm text-gray-400 border border-gray-700">
              A
            </kbd>
          </button>

          <button
            onClick={checkAudioMatch}
            disabled={!isPlaying}
            className={`
              w-36 h-36 rounded-2xl border-4 font-bold text-xl flex flex-col items-center justify-center transition-all duration-100
              ${
                feedback.audio === "correct"
                  ? "bg-green-600 border-green-400 scale-95 shadow-inner"
                  : feedback.audio === "wrong"
                  ? "bg-red-900/50 border-red-500"
                  : feedback.audio === "missed"
                  ? "bg-orange-500/50 border-orange-400"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-750"
              }
            `}
          >
            <span>Sound</span>
            <kbd className="mt-2 px-3 py-1 bg-gray-900 rounded text-sm text-gray-400 border border-gray-700">
              L
            </kbd>
          </button>
        </div>
      </div>

      <GameStats
        score={score}
        rounds={rounds}
        nLevel={nLevel}
        matches={matches || { pos: 0, audio: 0 }}
      />
    </main>
  );
}
