// src/utils/jwt.ts
import jwt from "jsonwebtoken";

const generateToken = (id: string, userType: string) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

export { generateToken };
