// Helper function to play sound effects
export const playSound = (soundFile: string) => {
    const audio = new Audio(soundFile);
    audio.play();
  };