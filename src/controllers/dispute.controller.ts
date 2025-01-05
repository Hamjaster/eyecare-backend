import { Request, Response } from "express";
import DisputeItem from "../models/Dispute";
import DisputeLetter from "../models/DisputeLetter";

// Create a Dispute Item
export const createDisputeItem = async (req: Request, res: Response) => {
  try {
    const disputeItem = await DisputeItem.create(req.body);
    res.status(201).json({
      success: true,
      message: "Dispute item created successfully",
      data: disputeItem,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, message: error.message, data: null });
  }
};

// Get All Dispute Items
export const getAllDisputeItems = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    const disputeItems = await DisputeItem.find({
      forClient: clientId,
    }).populate("forClient");
    res.status(200).json({
      success: true,
      message: "Dispute items retrieved successfully",
      data: disputeItems,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

// Get a Single Dispute Item
export const getDisputeItemById = async (req: Request, res: Response) => {
  try {
    const disputeItem = await DisputeItem.findById(req.params.id).populate(
      "forClient"
    );
    if (!disputeItem) {
      res.status(404).json({
        success: false,
        message: "Dispute item not found",
        data: null,
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Dispute item retrieved successfully",
      data: disputeItem,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

// Update a Dispute Item
export const updateDisputeItem = async (req: Request, res: Response) => {
  try {
    const updatedDisputeItem = await DisputeItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("forClient");

    if (!updatedDisputeItem) {
      res.status(404).json({
        success: false,
        message: "Dispute item not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Dispute item updated successfully",
      data: updatedDisputeItem,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ success: false, message: error.message, data: null });
  }
};

// Delete a Dispute Item
export const deleteDisputeItem = async (req: Request, res: Response) => {
  try {
    const deletedDisputeItem = await DisputeItem.findByIdAndDelete(
      req.params.id
    );

    if (!deletedDisputeItem) {
      res.status(404).json({
        success: false,
        message: "Dispute item not found",
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Dispute item deleted successfully",
      data: null,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

// Create a new dispute letter
export const createDisputeLetter = async (req: Request, res: Response) => {
  try {
    const { title, category, status, description, forClient } = req.body;

    const newDisputeLetter = await DisputeLetter.create({
      title,
      category,
      status,
      description,
      forClient,
    });

    res.status(201).json({
      success: true,
      data: newDisputeLetter,
      message: "Dispute letter created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      message: "Error creating dispute letter",
    });
  }
};

// Get all dispute letters
export const getAllDisputeLetters = async (req: Request, res: Response) => {
  try {
    const disputeLetters = await DisputeLetter.find().populate("forClient");
    res.status(200).json({
      success: true,
      data: disputeLetters,
      message: "Fetched all dispute letters successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Error fetching dispute letters",
    });
  }
};

// Get a single dispute letter by ID
export const getDisputeLetterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const disputeLetter = await DisputeLetter.findById(id).populate(
      "forClient"
    );
    if (!disputeLetter) {
      res.status(404).json({
        success: false,
        data: null,
        message: "Dispute letter not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: disputeLetter,
      message: "Fetched dispute letter successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Error fetching dispute letter",
    });
  }
};

// Update a dispute letter
export const updateDisputeLetter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, status, description, forClient } = req.body;

    const updatedDisputeLetter = await DisputeLetter.findByIdAndUpdate(
      id,
      { title, category, status, description, forClient },
      { new: true, runValidators: true }
    );

    if (!updatedDisputeLetter) {
      res.status(404).json({
        success: false,
        data: null,
        message: "Dispute letter not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedDisputeLetter,
      message: "Dispute letter updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      message: "Error updating dispute letter",
    });
  }
};

// Delete a dispute letter
export const deleteDisputeLetter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedDisputeLetter = await DisputeLetter.findByIdAndDelete(id);

    if (!deletedDisputeLetter) {
      res.status(404).json({
        success: false,
        data: null,
        message: "Dispute letter not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: null,
      message: "Dispute letter deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "Error deleting dispute letter",
    });
  }
};
