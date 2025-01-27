// src/controllers/clientController.ts
import { Request, Response } from "express";
import Client, { ClientDocument } from "../models/Client";
import { comparePassword, hashPassword } from "../config/password";
import { generateToken } from "../config/jwt";
import User from "../models/User";

export const getClientDetails = async (req: any, res: any) => {
  const userId = req.user._id;
  try {
    const user = await Client.findById(userId).populate('referredBy')

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

export const getAllClients = async (req: any, res: Response) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate("role", "permissions").populate("company", "admin");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found", data: null });
      return;
    }

    const rolePermissions = user.role.permissions.find(permission => permission.category === "Clients & Leads");
    let clients;

    if (rolePermissions && rolePermissions.actions.includes("Assigned Clients & Leads Only")) {
      clients = await Client.find({ assignedTo: userId })
        .populate("assignedTo referredBy onBoardedBy")
        .populate({
          path: "assignedTo",
          populate: { path: "company" }
        });
    } else if (rolePermissions && rolePermissions.actions.includes("All clients & Leads")) {
      clients = await Client.find({ onBoardedBy: user.company.admin })
        .populate("assignedTo referredBy onBoardedBy")
        .populate({
          path: "assignedTo",
          populate: { path: "company" }
        });
    } else {
      res.status(403).json({ success: false, message: "Insufficient permissions", data: null });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Clients retrieved successfully",
      data: clients,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Server error", data: error.message });
  }
};

export const onboardClient = async (req: any, res: Response) => {
  const userId = req.user._id;
  const body = req.body as ClientDocument;
  try {
    const clientExists = await Client.findOne({ email: body.email });
    if (clientExists) {
      res
        .status(400)
        .json({ success: false, message: "Client already exists", data: null });
      return;
    }

    const hashedPassword = await hashPassword(body.password);

    const client = await Client.create({
      ...body,
      password: hashedPassword,
      onBoardedBy: userId,
      signature : {
        text : `${body.firstName} ${body.lastName}`,
        font : "font-dancing"
      }
    });

    // Return client after populating referenced fields
    await client.populate([
      { path: "assignedTo", select: "firstName lastName email" },
      { path: "referredBy", select: "firstName lastName email" },
      { path: "onBoardedBy", select: "firstName lastName email" },
    ]);

    res.status(201).json({
      success: true,
      message: "Client onboarded successfully",
      data: client,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const onboardClientsBulk = async (req: any, res: Response) => {
  const userId = req.user._id;
  const clients = req.body as ClientDocument[];

  try {
    const existingEmails = await Client.find({
      email: { $in: clients.map((client) => client.email) },
    }).select("email");
    const existingEmailsSet = new Set(
      existingEmails.map((client) => client.email)
    );

    const clientsToCreate = clients.filter(
      (client) => !existingEmailsSet.has(client.email)
    );
    const failedClients = clients.filter((client) =>
      existingEmailsSet.has(client.email)
    );

    const createdClients = await Promise.all(
      clientsToCreate.map(async (client) => {
        const hashedPassword = await hashPassword(client.password);
        let clientC = await Client.create({
          ...client,
          password: hashedPassword,
          onBoardedBy: userId,
        });
        return Client.findById(clientC._id).populate(
          "assignedTo referredBy onBoardedBy"
        );
      })
    );

    res.status(201).json({
      success: true,
      message: failedClients[0]
        ? `${createdClients.length} clients onboarded, ${failedClients.length} failed to onboard`
        : `${createdClients.length} clients onboarded successfully`,
      data: {
        createdClients,
        failedClients: failedClients.map((client) => ({
          email: client.email,
          reason: "Email already exists",
        })),
      },
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedClient = await Client.findByIdAndDelete(id);
    if (!deletedClient) {
      res
        .status(404)
        .json({ success: false, message: "Client not found", data: null });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
      data: null,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const updateClient = async (req: any, res: Response) => {
const id = req.user._id
  try {
    const updatedClient = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate('referredBy');
    if (!updatedClient) {
      res
        .status(404)
        .json({ success: false, message: "Client not found", data: null });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: updatedClient,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const updateClientByAdmin = async (req: any, res: Response) => {
const {id} = req.params
  try {
    const updatedClient = await Client. findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate('referredBy');
    if (!updatedClient) {
      res
        .status(404)
        .json({ success: false, message: "Client not found", data: null });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: updatedClient,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const loginClient = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const client = await Client.findOne({ email }).populate('referredBy');
    if (client && (await comparePassword(password, client.password))) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user : client,
          token: generateToken(client.id, "client"),
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

export const updateClientEmail = async (req: any, res: Response) => {
  const id = req.user._id;
  const { password, email } = req.body;

  try {
    const user = await Client.findById(id).populate('referredBy');
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


export const updateClientPassword = async (req: any, res: Response) => {
  const id = req.user._id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await Client.findById(id);
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