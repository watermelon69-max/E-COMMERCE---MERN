import jwt from "jsonwebtoken";

const generateJWTtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

export default generateJWTtoken;
