import { Request, Response } from "express";
import User from "../models/User.js";
import { hashPassword, comparePassword } from "../config/password.js";
import { generateToken } from "../config/jwt.js";
import Company from "../models/Company.js";
import Role, { AdminRole } from "../models/Role";

export const registerUser = async (req: any, res: any) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res
        .status(400)
        .json({ success: false, message: "User already exists", data: null });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const company = await Company.create({
      name: `${firstName} ${lastName}'s Company`,
      admin: user.id,
      teamMembers: [user.id], // Add admin as a team member
    });
    if (!company) {
      res
        .status(500)
        .json({
          success: false,
          message: "Failed to create company",
          data: null,
        });
      return;
    }
    user.company = company.id;
    await user.save();
    // Creating an admin role and assigning it to user
    const adminRole = await Role.create({
      name: AdminRole.name,
      permissions : AdminRole.permissions,
      user: user.id,
    });
    if (!adminRole) {
      res
        .status(500)
        .json({
          success: false,
          message: "Failed to create admin role",
          data: null,
        });
      return;
    }
    user.role = adminRole;
    await user.save()
    await user.populate({
      path: "company",
      populate: {
        path: "teamMembers",
        populate: {
          path: "role",
          select: "name permissions",
        },
        select: "firstName lastName email profilePhoto",
      },
    }).populate("role", "name permissions");

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
        token: generateToken(user.id, "user"),
      },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const getUserDetails = async (req: any, res: any) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId)
      .populate({
        path: "company",
        populate: {
          path: "teamMembers",
          populate: {
            path: "role",
            select: "name permissions",
          },
          select: "firstName lastName email profilePhoto",
        },
      })
      .populate("role", "name permissions")
      .exec();

      console.log('getting user deatils for', user)

    if (!user) {
      res
        .status(500)
        .json({ success: false, message: "No such user found", data: null });
      return;
    }

    res.status(201).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .populate({
        path: "company",
        populate: {
          path: "teamMembers",
          populate: {
            path: "role",
            select: "name permissions",
          },
          select: "firstName lastName email profilePhoto",
        },
      })
      .populate("role", "name permissions")
      .exec();
    if (user && (await comparePassword(password, user.password))) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user,
          token: generateToken(user.id, "user"),
        },
      });
    } else {
      res
        .status(401)
        .json({
          success: false,
          message: "Invalid email or password",
          data: null,
        });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const updateUserEmail = async (req: any, res: Response) => {
  const id = req.user._id;
  const { password, email } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      res
        .status(404)
        .json({ success: false, message: "User not found", data: null });
      return;
    }
    if (!(await comparePassword(password, user.password))) {
      res
        .status(401)
        .json({ success: false, message: "Invalid password", data: null });
      return;
    }

    user.email = email;
    await user.save();
    await user.populate({
      path: "company",
      populate: {
        path: "teamMembers",
        populate: {
          path: "role",
          select: "name permissions",
        },
        select: "firstName lastName email profilePhoto",
      },
    }).populate("role", "name permissions");

    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      data: { email: user.email },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const updateUserPassword = async (req: any, res: Response) => {
  const id = req.user._id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user || !(await comparePassword(currentPassword, user.password))) {
      res
        .status(401)
        .json({
          success: false,
          message: "Invalid current password",
          data: null,
        });
      return;
    }

    user.password = await hashPassword(newPassword);
    await user.save();
    await user.populate({
      path: "company",
      populate: {
        path: "teamMembers",
        populate: {
          path: "role",
          select: "name permissions",
        },
        select: "firstName lastName email profilePhoto",
      },
    }).populate("role", "name permissions");

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: null,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const updateUser = async (req: any, res: Response) => {
  const id = req.user._id;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate({
      path: "company",
      populate: {
        path: "teamMembers",
        populate: {
          path: "role",
          select: "name permissions",
        },
        select: "firstName lastName email profilePhoto",
      },
    }).populate("role", "name permissions");
    if (!updatedUser) {
      res
        .status(404)
        .json({ success: false, message: "User not found", data: null });
      return;
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};
