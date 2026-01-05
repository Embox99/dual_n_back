import { useState, useEffect, useCallback, useRef } from "react";
import { playSound, LETTERS } from "../utils/audioUtils";

export type GameStep = {
  position: number;
  letter: string;
};

export const useDualNBack = (
  nLevel: number = 2,
  speedMs: number = 2500,
  maxRounds: number = 40
) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const [rounds, setRounds] = useState(0);
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState({ pos: 0, audio: 0 });
  const [history, setHistory] = useState<GameStep[]>([]);
  const [currentStep, setCurrentStep] = useState<GameStep | null>(null);

  const [feedback, setFeedback] = useState<{
    pos?: "correct" | "wrong" | "missed";
    audio?: "correct" | "wrong" | "missed";
  }>({});

  const historyRef = useRef<GameStep[]>([]);
  const userAnswersRef = useRef({ pos: false, audio: false });
  const roundsRef = useRef(0);

  const generateStep = useCallback(() => {
    const shouldForcePos =
      Math.random() < 0.3 && historyRef.current.length >= nLevel;
    const shouldForceAudio =
      Math.random() < 0.3 && historyRef.current.length >= nLevel;

    let position = Math.floor(Math.random() * 9);
    if (shouldForcePos) {
      position =
        historyRef.current[historyRef.current.length - nLevel].position;
    }

    let letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    if (shouldForceAudio) {
      letter = historyRef.current[historyRef.current.length - nLevel].letter;
    }

    return { position, letter };
  }, [nLevel]);

  const stopGame = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(null);
    window.speechSynthesis.cancel();
  }, []);

  const gameTick = useCallback(() => {
    if (roundsRef.current >= maxRounds) {
      stopGame();
      return;
    }

    const currentHistory = historyRef.current;

    let deltaScore = 0;
    let nextFeedbackPos: "correct" | "wrong" | "missed" | undefined = undefined;
    let nextFeedbackAudio: "correct" | "wrong" | "missed" | undefined =
      undefined;

    let newPosMatchCount = 0;
    let newAudioMatchCount = 0;

    if (currentHistory.length > nLevel) {
      const actualStep = currentHistory[currentHistory.length - 1];
      const targetStep = currentHistory[currentHistory.length - 1 - nLevel];

      const isPosMatch = targetStep.position === actualStep.position;
      const isAudioMatch = targetStep.letter === actualStep.letter;
      const { pos: userPressedPos, audio: userPressedAudio } =
        userAnswersRef.current;

      if (isPosMatch) newPosMatchCount = 1;
      if (isAudioMatch) newAudioMatchCount = 1;

      if (isPosMatch) {
        if (userPressedPos) {
          deltaScore += 100;
          nextFeedbackPos = "correct";
        } else {
          deltaScore -= 50;
          nextFeedbackPos = "missed";
        }
      } else {
        if (userPressedPos) {
          deltaScore -= 50;
          nextFeedbackPos = "wrong";
        }
      }

      if (isAudioMatch) {
        if (userPressedAudio) {
          deltaScore += 100;
          nextFeedbackAudio = "correct";
        } else {
          deltaScore -= 50;
          nextFeedbackAudio = "missed";
        }
      } else {
        if (userPressedAudio) {
          deltaScore -= 50;
          nextFeedbackAudio = "wrong";
        }
      }
    }

    if (deltaScore !== 0) {
      setScore((prev) => prev + deltaScore);
    }

    if (newPosMatchCount > 0 || newAudioMatchCount > 0) {
      setMatches((prev) => ({
        pos: prev.pos + newPosMatchCount,
        audio: prev.audio + newAudioMatchCount,
      }));
    }

    if (nextFeedbackPos || nextFeedbackAudio) {
      setFeedback({
        pos: nextFeedbackPos,
        audio: nextFeedbackAudio,
      });
    } else {
      setFeedback({});
    }

    userAnswersRef.current = { pos: false, audio: false };

    roundsRef.current += 1;
    setRounds(roundsRef.current);

    const newStep = generateStep();
    const newHistory = [...currentHistory, newStep];
    historyRef.current = newHistory;
    setHistory(newHistory);
    setCurrentStep(newStep);

    playSound(newStep.letter);
  }, [nLevel, generateStep, maxRounds, stopGame]);

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
    roundsRef.current = 0;
    setMatches({ pos: 0, audio: 0 });
    setFeedback({});
    setIsPlaying(true);
  };

  const checkPositionMatch = () => {
    if (userAnswersRef.current.pos) return;
    userAnswersRef.current.pos = true;
    setFeedback((prev) => ({ ...prev, pos: "correct" }));
  };

  const checkAudioMatch = () => {
    if (userAnswersRef.current.audio) return;
    userAnswersRef.current.audio = true;
    setFeedback((prev) => ({ ...prev, audio: "correct" }));
  };

  return {
    isPlaying,
    currentStep,
    score,
    rounds,
    matches,
    feedback,
    startGame,
    stopGame,
    checkPositionMatch,
    checkAudioMatch,
  };
};
