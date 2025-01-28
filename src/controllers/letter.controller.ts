import Category from "../models/Category";
import DisputeLetter from "../models/DisputeLetter";
import LetterTemplate from "../models/LetterTemplate";

// Create a new letter template
export const createTemplate = async (req: any, res: any) => {
  try {
    const letterTemplateDetails = req.body;
    const user = req.user.id; // Assuming user is authenticated
    console.log(letterTemplateDetails, 'template')
    const template = new LetterTemplate({
      ...letterTemplateDetails,
      user
   
    });

    

    await template.save();
    await template.populate('category')
    res.status(201).json({ success: true, data : template });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all raw letters
export const getAllLetterTemplates = async (req: any, res: any) => {
  try {
    const userId = req.user._id
    const disputeLetters = await LetterTemplate.find({ user : userId})
      .populate("user").populate('category')
      .sort({ createdAt: -1 }); // Sort by createdAt in ascending order
    console.log(disputeLetters)
    if(!disputeLetters){
      res.status(400).json({
        success: false,
        data: disputeLetters,
        message: "Error fetching letters",
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


// Update a template
export const updateTemplate = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedTemplate = await LetterTemplate.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    await updatedTemplate?.populate('user category')
    if (!updatedTemplate) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }

    res.status(200).json({ success: true, data: updatedTemplate });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a template
export const deleteTemplate = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const deletedTemplate = await LetterTemplate.findByIdAndDelete(id);

    if (!deletedTemplate) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }

    res.status(200).json({ success: true, message: "Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new dispute letter
export const createDisputeLetter = async (req: any, res: any) => {
  try {
    const userId = req.user._id;
    const { title, category, status, description, bureau, isDisputeLetter, round, createdAt } = req.body;

    const newDisputeLetter = await DisputeLetter.create({
      title,
      category,
      status,
      user : userId,
      description,
      bureau,
      isDisputeLetter,
      round,
      createdAt
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
export const getAllDisputeLetters = async (req: any, res: any) => {
  try {
    const userId = req.user._id

    const disputeLetters = await DisputeLetter.find({ user : userId, isDisputeLetter : true})
      .populate("user")
      .sort({ createdAt: -1 }); // Sort by createdAt in ascending order
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
export const getDisputeLetterById = async (req: any, res: any) => {
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
export const updateDisputeLetter = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const updateDisputeLetter = req.body;

    const updatedDisputeLetter = await DisputeLetter.findByIdAndUpdate(
      id,
      updateDisputeLetter,
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
export const deleteDisputeLetter = async (req: any, res: any) => {
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


// Create a Category
export const createCategory = async (req: any, res: any) => {
  
    try {
      const userId = req.user._id
      const {category} = req.body;
      const ins = await Category.create({
        user : userId,
        category 
      });
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: ins,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message, data: null });
    }
  };
  
  // Get Categories 
  export const getCategories = async (req: any, res: any) => {
    try {
      const userId = req.user._id;
      const categories = await Category.find({ user: userId });
      res.status(200).json({
        success: true,
        message: "Categories retrieved successfully",
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message, data: null });
    }
  };
