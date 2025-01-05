// src/index.ts
import express from "express";
import dotenv from "dotenv";
import userRoutes from "../src/routes/user.route";
import clientRoutes from "../src/routes/client.route";
import invoiceRoutes from "../src/routes/invoice.route";
import creditorRoutes from "../src/routes/creditor.route";
import companyRoutes from "../src/routes/company.route";
import disputeRoutes from "../src/routes/dispute.route";
import connectDB from "./config/db";

import cors from "cors"; // Import the CORS middleware
dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

app.use(express.json());

// Main dashboard routes
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/creditors", creditorRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/dispute", disputeRoutes);

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
