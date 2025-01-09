import { Request, Response } from "express";
import Company, { CompanyDocument } from "../models/Company"; // Adjust path as needed
import User, { UserDocument } from "../models/User";
import Role from "../models/Role";
import { hashPassword } from "../config/password";

export const createCompany = async (req: any, res: Response) => {
  const adminId = req.user._id;
  try {
    const {
      name,
      website,
      mailingAddress,
      city,
      state,
      country,
      zipCode,
      phone,
      fax,
      timeZone,
      senderName,
      senderEmail,
      companyNamePayable,
    } = req.body;

    const admin = await User.findById(adminId);
    if (!admin)
      return res
        .status(404)
        .json({ success: false, message: "Admin user not found", data: null });

    const company = await Company.create({
      name,
      website,
      mailingAddress,
      city,
      state,
      country,
      zipCode,
      phone,
      fax,
      timeZone,
      senderName,
      senderEmail,
      companyNamePayable,
      admin: adminId,
      teamMembers: [adminId], // Add admin as a team member
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

export const getTeamMembers = async (req: any, res: Response) => {
  try {
    const adminId = req.user._id;
    const company = await Company.findOne({ admin: adminId }).populate({
      path: "teamMembers", // Populate teamMembers first
      populate: {
        path: "role", // Populate the 'role' field of each team member
        model: "Role", // Specify the Role model
      },
    });

    if (!company) {
      res
        .status(404)
        .json({ success: false, message: "Company not found", data: null });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Team members retrieved successfully",
      data: company.teamMembers,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

export const addTeamMember = async (req: any, res: Response) => {
  try {
    const adminId = req.user._id;

    const { role, firstName, lastName, email, password } = req.body;

    const company = await Company.findOne({ admin: adminId });
    if (!company) {
      res
        .status(404)
        .json({ success: false, message: "Company not found", data: null });
      return;
    }
    const hashedPass = await hashPassword(password)
    // The user details will come from req.body, and create the user with the company and the desired role
    const user = await User.create({
      firstName,
      lastName,
      email,
      password : hashedPass,
      role,
      company: company._id,
    });

    if (!company.teamMembers.includes(user.id)) {
      company.teamMembers.push(user.id);
      await company.save();
    }

    res.status(200).json({
      success: true,
      message: "Team member added successfully",
      data: user,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

export const editTeamMember = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, password, role } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      res
        .status(404)
        .json({ success: false, message: "User not found", data: null });
      return;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (password) user.password = password;
    if (role) user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Team member updated successfully",
      data: user,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

export const addRole = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { name, permissions } = req.body;

    const role = await Role.create({ user : userId, name, permissions });

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

export const getAllRoles = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const roles = await Role.find({user : userId});
    res.status(200).json({
      success: true,
      message: "Roles retrieved successfully",
      data: roles,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

export const editRole = async (req: Request, res: Response) => {
  try {
    const { roleId, name, permissions } = req.body;

    const role = await Role.findById(roleId);
    if (!role) {
      res
        .status(404)
        .json({ success: false, message: "Role not found", data: null });
      return;
    }

    role.name = name;
    role.permissions = permissions;
    await role.save();

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: role,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

// Controller for updating the company details
export const updateCompanyDetails = async (req: any, res: Response) => {
  try {
    const adminId = req.user._id;
    console.log(adminId, "adminId");
    const company = await Company.findOne({ admin: adminId });
    if (!company) {
      res
        .status(404)
        .json({ success: false, message: "Company not found", data: null });
      return;
    }
    const updatedCompanyDetails: CompanyDocument = req.body;
    // Update that company
    await Company.findByIdAndUpdate(company._id, updatedCompanyDetails);
    res.status(200).json({
      success: true,
      message: "Company details updated successfully",
      data: company,
    });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message, data: null });
    return;
  }
};
