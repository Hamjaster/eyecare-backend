// src/controllers/invoiceController.ts
import { Request, Response } from "express";
import Invoice, { InvoiceDocument } from "../models/Invoice";
import Client from "../models/Client";

export const createInvoice = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { client, referenceNo, invoiceDate, dueDate, items } =
      req.body as InvoiceDocument;
    const total = items.reduce((acc, item) => acc + item.price, 0);
    const clientExists = await Client.findById(client);
    if (!clientExists) {
      res
        .status(404)
        .json({ success: false, message: "Client not found", data: null });
      return;
    }

    const invoice = await Invoice.create({
      client,
      invoiceBy: userId,
      referenceNo,
      invoiceDate,
      dueDate,
      items,
      status: "pending",
      total,
    });

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
    return;
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
    return;
  }
};

export const getInvoicesByClient = async (req: any, res: Response) => {
  const clientId = req.user._id;
  try {
    const invoices = await Invoice.find({ client: clientId }).populate(
      "invoiceBy"
    );
    res.status(200).json({
      success: true,
      message: "Invoices retrieved successfully",
      data: invoices,
    });
    return;
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
    return;
  }
};

export const getInvoicesByUser = async (req: any, res: Response) => {
  const userId = req.user._id;
  try {
    const invoices = await Invoice.find({ invoiceBy: userId }).populate(
      "invoiceBy"
    );
    res.status(200).json({
      success: true,
      message: "Invoices retrieved successfully",
      data: invoices,
    });
    return;
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
    return;
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedInvoice) {
      res
        .status(404)
        .json({ success: false, message: "Invoice not found", data: null });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: updatedInvoice,
    });
    return;
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
    return;
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(id);
    if (!deletedInvoice) {
      res
        .status(404)
        .json({ success: false, message: "Invoice not found", data: null });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
      data: deletedInvoice,
    });
    return;
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
    return;
  }
};
