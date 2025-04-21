const generateRandomNumber = (min, max, count) => {
  if (count === undefined) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return Array.from({ length: count }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

export default generateRandomNumber