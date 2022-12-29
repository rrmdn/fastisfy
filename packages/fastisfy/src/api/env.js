export const get = async (req, res) => {
  res.send({ hello: "world", SAMPLE_ENV: process.env.SAMPLE_ENV });
};
