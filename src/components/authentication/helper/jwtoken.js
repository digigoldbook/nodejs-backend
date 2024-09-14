import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "30m",
  });
  return token;
};

export default generateToken;