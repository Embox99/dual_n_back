import { useState, useEffect, useCallback, useRef } from "react";

export type GameStep = {
  position: number;
  letter: string;
};

const LETTERS = ["A", "B", "C", "H", "K", "L", "M", "Q", "R", "S"];

export const useDualNBack = (nLevel: number = 2, speedMs: number = 2500) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<GameStep[]>([]);
  const [currentStep, setCurrentStep] = useState<GameStep | null>(null);

  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [matches, setMatches] = useState({ pos: 0, audio: 0 });

  const [feedback, setFeedback] = useState<{
    pos?: "correct" | "wrong" | "missed";
    audio?: "correct" | "wrong" | "missed";
  }>({});

  const historyRef = useRef<GameStep[]>([]);
  const userAnswersRef = useRef({ pos: false, audio: false });

  const generateStep = useCallback(() => {
    const shouldForcePos =
      Math.random() < 0.3 && historyRef.current.length >= nLevel;

    let position = Math.floor(Math.random() * 9);
    if (shouldForcePos) {
      position =
        historyRef.current[historyRef.current.length - nLevel].position;
    }

    const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    return { position, letter };
  }, [nLevel]);

  const gameTick = useCallback(() => {
    const currentHistory = historyRef.current;

    if (currentHistory.length > nLevel) {
      const actualStep = currentHistory[currentHistory.length - 1];

      const targetStep = currentHistory[currentHistory.length - 1 - nLevel];

      const isPosMatch = targetStep.position === actualStep.position;
      const isAudioMatch = targetStep.letter === actualStep.letter;
      const { pos: userPos, audio: userAudio } = userAnswersRef.current;

      if (isPosMatch) setMatches((m) => ({ ...m, pos: m.pos + 1 }));
      if (isAudioMatch) setMatches((m) => ({ ...m, audio: m.audio + 1 }));

      let roundScore = 0;

      if (userPos) {
        if (isPosMatch) roundScore += 100;
        else roundScore -= 50;
      }

      if (userAudio) {
        if (isAudioMatch) roundScore += 100;
        else roundScore -= 50;
      }

      setScore((s) => s + roundScore);
    }

    userAnswersRef.current = { pos: false, audio: false };
    setFeedback({});
    setRounds((r) => r + 1);

    const newStep = generateStep();
    const newHistory = [...currentHistory, newStep];
    historyRef.current = newHistory;
    setHistory(newHistory);
    setCurrentStep(newStep);

    const utterance = new SpeechSynthesisUtterance(newStep.letter);
    utterance.rate = 1.5;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }, [nLevel, generateStep]);

  useEffect(() => {
    if (!isPlaying) return;
    gameTick();
    const intervalId = setInterval(gameTick, speedMs);
    return () => clearInterval(intervalId);
  }, [isPlaying, speedMs, gameTick]);

  const startGame = () => {
    setHistory([]);
    historyRef.current = [];
    setScore(0);
    setRounds(0);
    setMatches({ pos: 0, audio: 0 });
    setIsPlaying(true);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setCurrentStep(null);
  };

  const checkPositionMatch = () => {
    userAnswersRef.current.pos = true;
    setFeedback((prev) => ({ ...prev, pos: "correct" }));
  };

  const checkAudioMatch = () => {
    userAnswersRef.current.audio = true;
    setFeedback((prev) => ({ ...prev, audio: "correct" }));
  };

  return {
    isPlaying,
    currentStep,
    score,
    rounds,
    feedback,
    startGame,
    stopGame,
    checkPositionMatch,
    checkAudioMatch,
  };
};
