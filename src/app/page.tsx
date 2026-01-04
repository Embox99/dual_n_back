"use client";

import { useEffect } from "react";
import { GameGrid } from "../components/GameGrid";
import { useDualNBack } from "../hooks/useDualNBack";

export default function Home() {
  const {
    isPlaying,
    currentStep,
    score,
    rounds,
    startGame,
    stopGame,
    checkPositionMatch,
    checkAudioMatch,
    feedback,
  } = useDualNBack(1, 2500);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      if (e.code === "KeyA") {
        checkPositionMatch();
      }

      if (e.code === "KeyL") {
        checkAudioMatch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, checkPositionMatch, checkAudioMatch]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-400 mb-2">Dual N-Back</h1>
        <p className="text-xl text-gray-300">
          Score:{" "}
          <span className="font-mono text-yellow-400 font-bold">{score}</span>
          <span className="text-sm ml-4 text-gray-500">Rounds: {rounds}</span>
        </p>
      </div>

      <GameGrid activeIdx={currentStep ? currentStep.position : null} />

      <div className="flex gap-4">
        {!isPlaying ? (
          <button
            onClick={startGame}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-xl transition shadow-lg shadow-blue-500/20"
          >
            START GAME
          </button>
        ) : (
          <button
            onClick={stopGame}
            className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-bold text-xl transition"
          >
            STOP
          </button>
        )}
      </div>

      <div className="flex gap-8 mt-4">
        <button
          onClick={checkPositionMatch}
          disabled={!isPlaying}
          className={`
            w-32 h-32 rounded-xl border-4 font-bold text-lg flex flex-col items-center justify-center transition-all
            ${
              feedback.pos === "correct"
                ? "bg-green-600 border-green-400 scale-95"
                : "bg-gray-800 border-gray-600"
            }
          `}
        >
          <span>Position</span>
          <kbd className="mt-2 px-2 py-1 bg-gray-700 rounded text-sm text-gray-400 border border-gray-600">
            A
          </kbd>
        </button>

        <button
          onClick={checkAudioMatch}
          disabled={!isPlaying}
          className={`
            w-32 h-32 rounded-xl border-4 font-bold text-lg flex flex-col items-center justify-center transition-all
            ${
              feedback.audio === "correct"
                ? "bg-green-600 border-green-400 scale-95"
                : "bg-gray-800 border-gray-600"
            }
          `}
        >
          <span>Sound</span>
          <kbd className="mt-2 px-2 py-1 bg-gray-700 rounded text-sm text-gray-400 border border-gray-600">
            L
          </kbd>
        </button>
      </div>
    </main>
  );
}
