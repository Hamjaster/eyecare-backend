// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import { DecodedToken } from "../middlewares/auth.middleware";

const generateToken = (id: string, userType: string) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secret") as DecodedToken;
  } catch (error) {
    console.log(error)
    return null;
  }
}
export { generateToken };
