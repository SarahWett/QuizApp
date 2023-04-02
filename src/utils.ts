//Workaround for randomizing the order of the questions
export const shuffleArray = (array: any[]) =>
  [...array].sort(() => Math.random() - 0.5);
