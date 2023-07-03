const generateId = () => {
  const chars = "1234567890";
  let random = chars[Math.floor(Math.random() * chars.length)];
  let id = "";
  while (id.length < 3) {
    id += random;
    random = chars[Math.floor(Math.random() * chars.length)];
  };
  return id;
};

const generateRandomNumber = (affirmations) => {
  return Math.floor(Math.random() * affirmations.length);
};

export default generateId;
export { generateRandomNumber };
