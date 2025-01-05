// src/middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
import User from "../models/User";
import { Request, Response, NextFunction } from "express";
import Client from "../models/Client";

interface DecodedToken {
  id: string;
  userType: "user" | "client";
}

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      ) as DecodedToken;
      if (decoded.userType === "user") {
        req.user = await User.findById(decoded.id).select("-password");
      } else {
        req.user = await Client.findById(decoded.id).select("-password");
      }
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
