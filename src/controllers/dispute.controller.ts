import { Request, Response } from "express";
import DisputeItem from "../models/Dispute";
import DisputeLetter from "../models/DisputeLetter";
import Reason from "../models/Reason";
import Instruction from "../models/Instruction";

// Create a Dispute Item
export const createDisputeItem = async (req: Request, res: Response) => {
  try {
    const disputeItem = (await DisputeItem.create(req.body));
    if(!disputeItem){
      res.status(400).json({
        success : false,
        message : "Error while creating Dispute Item",
        data : null
      })
    }
     // Populate the `forClient` and `reason` fields
     const populatedDisputeItem = await DisputeItem.findById(disputeItem._id)
     .populate("forClient") // Populate the `forClient` field
     .populate("reason").populate('creditorFurnisher').populate('instruction')  // Populate the `reason` field

    res.status(201).json({
      success: true,
      message: "Dispute item created successfully",
      data: populatedDisputeItem,
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
    }).populate("forClient reason instruction creditorFurnisher");
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
    ).populate("forClient reason instruction creditorFurnisher");

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
export const createDisputeLetter = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { title, category, status, description, bureau } = req.body;

    const newDisputeLetter = await DisputeLetter.create({
      title,
      category,
      status,
      user : userId,
      description,
      bureau
    });

    res.status(201).json({
      success: true,
      data: newDisputeLetter,
      message: "Dispute letter created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: error,
      message: "Error creating dispute letter",
    });
  }
};

// Get all dispute letters
export const getAllDisputeLetters = async (req: any, res: Response) => {
  try {
    const userId = req.user._id
    const disputeLetters = await DisputeLetter.find({ user : userId}).populate("user");
    console.log(disputeLetters)
    if(!disputeLetters){
      res.status(400).json({
        success: false,
        data: disputeLetters,
        message: "Error fetching dispute letters",
      });
return;
    }
    res.status(200).json({
      success: true,
      data: disputeLetters,
      message: "Fetched all dispute letters successfully",
    });
  } catch (error) {
    console.log(error)
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
      "user"
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
    const { title, category, status, description, bureau } = req.body;

    const updatedDisputeLetter = await DisputeLetter.findByIdAndUpdate(
      id,
      { title, category, status, description, bureau },
      { new: true, runValidators: true }
    ).populate('user');

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

// Create a Reason
export const createReason = async (req: any, res: Response) => {
  try {
    const userId = req.user._id
    const {reason} = req.body;
    const reas = await Reason.create({
      user : userId,
      reason
    });
    res.status(201).json({
      success: true,
      message: "Reason created successfully",
      data: reas,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message, data: null });
  }
};

// Get Reasons for a User
export const getReasons = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const reasons = await Reason.find({ user: userId });
    res.status(200).json({
      success: true,
      message: "Reasons retrieved successfully",
      data: reasons,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};

// Create an Instruction
export const createInstruction = async (req: any, res: Response) => {
  
  try {
    const userId = req.user._id
    const {instruction} = req.body;
    const ins = await Instruction.create({
      user : userId,
      instruction 
    });
    res.status(201).json({
      success: true,
      message: "Instruction created successfully",
      data: ins,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message, data: null });
  }
};

// Get Instructions for a User
export const getInstructions = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const instructions = await Instruction.find({ user: userId });
    res.status(200).json({
      success: true,
      message: "Instructions retrieved successfully",
      data: instructions,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, data: null });
  }
};
