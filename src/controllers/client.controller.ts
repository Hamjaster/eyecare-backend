// src/controllers/clientController.ts
import { Request, Response } from "express";
import Client, { ClientDocument } from "../models/Client";
import { comparePassword, hashPassword } from "../config/password";
import { generateToken } from "../config/jwt";
import User from "../models/User";
import mongoose from 'mongoose'
import { parseCreditReport } from "../config/config";
import fs from 'fs/promises'
import DisputeItem from "../models/Dispute";
import ActivityScore from "../models/ActivityScore";
export const getClientDetails = async (req: any, res: any) => {
  const userId = req.user._id;
  try {
    const user = await Client.findById(userId).populate({
      path: "onBoardedBy",
      populate: {
        path: "company", // Populate the company of the assigned user
        populate: {
          path: "teamMembers", // Then populate the teamMembers in the company
        },
      },
    })
    .populate("referredBy") // Optionally populate other user references
    .populate("assignedTo");


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
    console.log(rolePermissions, 'roles')

    if (rolePermissions && rolePermissions.actions.includes("Assigned Clients & Leads Only")) {
      clients = await Client.find({ assignedTo: userId })
        .populate("assignedTo referredBy onBoardedBy")
        .populate({
          path: "assignedTo",
          populate: { path: "company" }
        });
    } 
     if (rolePermissions && rolePermissions.actions.includes("All clients & Leads")) {
      clients = await Client.find({ onBoardedBy: user.company.admin })
        .populate("assignedTo referredBy onBoardedBy")
        .populate({
          path: "assignedTo",
          populate: { path: "company" }
        });
    }
    //  else {
    //   res.status(403).json({ success: false, message: "Insufficient permissions", data: null });
    //   return;
    // }

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
    }).populate('referredBy') .populate({
      path: "assignedTo",
      model: "user",
      populate : {
        path : "company",
        model : "Company",
        populate : {
          path : "teamMembers",
          model : 'user'
        }
      }
    })
    
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

export const addTaskToClient = async (req: Request, res: Response) => {
  try {
    const { clientId, task } = req.body;

    if (!clientId || !task) {
      return res.status(400).json({ success : false, message: "Client ID and task are required" });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success : false, message: "Client not found" });
    }

    client.tasks.push(task);
    await client.save();

    return res.status(200).json({ success : true, message: "Task added successfully", data : client });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success : false, message: "Internal server error" });
  }
};


export const uploadCreditReport = async (req:any, res : any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success : false, data : null, message: "No File Found" });
    }
    
    const html = req.file.buffer.toString('utf8');
    // const html = await fs.readFile(req.file.path, 'utf8');
    const { clientId } = req.params;
    
    // Validate client ID
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ success : false, data : null,message: "Invalid client ID" });
    }

    // Validate HTML input
    if (!html || typeof html !== "string") {
      return res.status(400).json({success : false, data : null,  message: "HTML text is required" });
    }
    // Parse the credit report from HTML
    const creditReport = parseCreditReport(html);

    // Dealing with activity Scores

    const Equifax = creditReport.creditScores.find((s) => s.bureau === "Equifax")?.score
    const Experian = creditReport.creditScores.find((s) => s.bureau === "Experian")?.score
    const TransUnion = creditReport.creditScores.find((s) => s.bureau === "TransUnion")?.score

    console.log(Equifax, Experian, TransUnion, 'scoress')

     let activityScore = await ActivityScore.findOne({ client: clientId });

    if (!activityScore) {
      activityScore = new ActivityScore({
        client: clientId,
        "Starring score": {
          Equifax,
          Experian,
          TransUnion,
        },
        "End score": {
          Equifax,
          Experian,
          TransUnion,
        },
        "Score Increase": {
          Equifax: 0,
          Experian: 0,
          TransUnion: 0,
        },
      });
    } else {
      if (!activityScore["Starring score"]) {
        // Assign the starring score for the first time
        activityScore["Starring score"] = { Equifax, Experian, TransUnion };
      }

      // Update end score
      activityScore["End score"] = { Equifax, Experian, TransUnion };

      // Update score increase dynamically
      activityScore["Score Increase"] = {
        Equifax: Equifax - activityScore["Starring score"].Equifax,
        Experian: Experian - activityScore["Starring score"].Experian,
        TransUnion: TransUnion - activityScore["Starring score"].TransUnion,
      };
    }

    await activityScore.save();
    // // Find the client and update their credit report
    const client = await Client.findByIdAndUpdate(
      clientId,
      { $set: { creditReport } },
      { new: true } // Return the updated document
    );

    if (!client) {
      return res.status(404).json({ success : false, data : null,message: "Client not found" });
    }

    // Return the updated client with the new credit report
    res.status(200).json({
      success : true,
      message: "Credit report updated successfully",
      data : client,
    });
  } catch (error) {
    console.error("Error updating credit report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const getActivityData = async (req: any, res: Response) => {
  try {
    const {clientId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ error: "Invalid forClient ID" });
    }

    // Aggregate counts based on the status in additionalDetails field, filtered by forClient
    const activityData = await DisputeItem.aggregate([
      {
        $match: {
          forClient:  new mongoose.Types.ObjectId(clientId),
        },
      },
      {
        $group: {
          _id: null,
          deletedEquifax: {
            $sum: {
              $cond: [{ $eq: ["$additionalDetails.Equifax.status", "Deleted"] }, 1, 0],
            },
          },
          deletedExperian: {
            $sum: {
              $cond: [{ $eq: ["$additionalDetails.Experian.status", "Deleted"] }, 1, 0],
            },
          },
          deletedTransUnion: {
            $sum: {
              $cond: [{ $eq: ["$additionalDetails.TransUnion.status", "Deleted"] }, 1, 0],
            },
          },
          inDisputeEquifax: {
            $sum: {
              $cond: [{ $eq: ["$additionalDetails.Equifax.status", "In Dispute"] }, 1, 0],
            },
          },
          inDisputeExperian: {
            $sum: {
              $cond: [{ $eq: ["$additionalDetails.Experian.status", "In Dispute"] }, 1, 0],
            },
          },
          inDisputeTransUnion: {
            $sum: {
              $cond: [{ $eq: ["$additionalDetails.TransUnion.status", "In Dispute"] }, 1, 0],
            },
          },
          createdEquifax: {
            $sum: {
              $cond: [{ $eq: ["$additionalDetails.Equifax.status", "Created"] }, 1, 0],
            },
          },
          createdExperian: {
            $sum: {
              $cond: [{ $eq: ["$additionalDetails.Experian.status", "Created"] }, 1, 0],
            },
          },
          createdTransUnion: {
            $sum: {
              $cond: [{ $eq: ["$additionalDetails.TransUnion.status", "Created"] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Extract data or return default structure if empty
    const data = activityData.length > 0 ? activityData[0] : {
      deletedEquifax: 0,
      deletedExperian: 0,
      deletedTransUnion: 0,
      inDisputeEquifax: 0,
      inDisputeExperian: 0,
      inDisputeTransUnion: 0,
      createdEquifax: 0,
      createdExperian: 0,
      createdTransUnion: 0,
    };
    let scores = await ActivityScore.findOne({client : clientId})
    console.log(scores, "scores")
    delete scores?.client;
    res.status(200).json({
      success: true,
      data: {
        activity : {
        deleted: {
          Equifax: data.deletedEquifax,
          Experian: data.deletedExperian,
          TransUnion: data.deletedTransUnion,
        },
        inDispute: {
          Equifax: data.inDisputeEquifax,
          Experian: data.inDisputeExperian,
          TransUnion: data.inDisputeTransUnion,
        },
        created: {
          Equifax: data.createdEquifax,
          Experian: data.createdExperian,
          TransUnion: data.createdTransUnion,
        },
      },
      scores : scores &&{
        "Starring score" : scores["Starring score"],
        "End score" : scores["End score"],
        "Score Increase" : scores["Score Increase"],
      }
      },
    });
  } catch (error) {
    console.error("Error fetching activity data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};