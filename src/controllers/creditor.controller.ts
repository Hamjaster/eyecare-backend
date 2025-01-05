import { Request, Response } from "express";
import Creditor, { CreditorDocument } from "../models/Creditor";

export const getAllCreditors = async (req: any, res: Response) => {
  const userId = req.user._id;

  try {
    const creditor = await Creditor.find({
      user: userId,
    });

    res.status(201).json({
      success: true,
      message: "Retreived all creditors",
      data: creditor,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const addCreditor = async (req: any, res: Response) => {
  const { name, email, phone, address, companyName, accountType, notes } =
    req.body;
  const userId = req.user._id;

  try {
    const creditor = await Creditor.create({
      name,
      email,
      phone,
      address,
      companyName,
      accountType,
      notes,
      user: userId,
    });

    res.status(201).json({
      success: true,
      message: "Creditor added successfully",
      data: creditor,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const deleteCreditor = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedCreditor = await Creditor.findByIdAndDelete(id);
    if (!deletedCreditor) {
      res
        .status(404)
        .json({ success: false, message: "Creditor not found", data: null });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Creditor deleted successfully",
      data: null,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};
