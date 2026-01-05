export const LETTERS = ["C", "H", "K", "L", "Q", "R", "S", "T"];

export const getRandomLetter = () => {
  const index = Math.floor(Math.random() * LETTERS.length);
  return LETTERS[index];
};

export const playSound = (letter: string) => {
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(letter);

  utterance.lang = "en-US";
  utterance.volume = 1;
  utterance.rate = 1.2;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
};
