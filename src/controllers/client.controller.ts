// src/controllers/clientController.ts
import { Request, Response } from "express";
import Client, { ClientDocument } from "../models/Client";
import { comparePassword, hashPassword } from "../config/password";
import { generateToken } from "../config/jwt";

export const getAllClients = async (req: any, res: Response) => {
  const userId = req.user._id;
  console.log(userId, "user to find clietsn for");
  try {
    const clients = await Client.find({ onBoardedBy: userId }).populate(
      "assignedTo referredBy onBoardedBy"
    );

    res.status(201).json({
      success: true,
      message: "Clients retrieved successfully",
      data: clients,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
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
  const { id } = req.params;
  try {
    const updatedClient = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
    });
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
    const client = await Client.findOne({ email });
    if (client && (await comparePassword(password, client.password))) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          _id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
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
  const { email } = req.body;

  try {
    const client = await Client.findById(id);
    if (!client) {
      res
        .status(404)
        .json({ success: false, message: "Client not found", data: null });
      return;
    }

    client.email = email;
    await client.save();
    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      data: { email: client.email },
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
    const client = await Client.findById(id);
    if (!client || !(await comparePassword(currentPassword, client.password))) {
      res
        .status(401)
        .json({
          success: false,
          message: "Invalid current password",
          data: null,
        });
      return;
    }

    client.password = await hashPassword(newPassword);
    await client.save();
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