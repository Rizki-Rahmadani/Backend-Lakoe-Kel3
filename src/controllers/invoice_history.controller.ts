import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
const prisma = new PrismaClient();

export async function createInvoiceHistory(req: Request, res: Response) {
  const { invoice_id } = req.body;

  const invoiceExist = await prisma.invoices.findUnique({
    where: { id: invoice_id },
  });
  if (!invoiceExist) {
    return res.status(404).json({ message: 'invoice not found.' });
  }
  try {
    const data = {
      status: invoiceExist.status,
      invoicesId: invoiceExist.id,
    };
    const invoice_history_created = await prisma.invoice_histories.create({
      data: data,
    });

    return res
      .status(201)
      .json({ message: 'created invoice history', invoice_history_created });
  } catch (error) {
    return res.status(500).json({ message: 'error creating invoice history.' });
  }
}

export async function getInvoiceHistory(req: Request, res: Response) {
  const { invoice_history_id } = req.body;

  const invoiceExist = await prisma.invoice_histories.findUnique({
    where: { id: invoice_history_id },
  });
  if (!invoiceExist) {
    return res.status(404).json({ message: 'invoice not found.' });
  }
  try {
    const invoice_history_fetched = await prisma.invoice_histories.findMany({
      where: { id: invoice_history_id },
      select: {
        status: true,
        invoicesId: true,
      },
    });

    return res
      .status(201)
      .json({ message: 'fetched invoice history', invoice_history_fetched });
  } catch (error) {
    return res.status(500).json({ message: 'error fetching invoice history.' });
  }
}

export async function updateInvoiceHistory(req: Request, res: Response) {
  const { invoice_id } = req.body;

  if (!invoice_id) {
    return res.status(400).json({ message: 'Invoice ID is required.' });
  }

  try {
    // First, check if invoice exists
    const invoice = await prisma.invoices.findUnique({
      where: { id: invoice_id },
      select: { id: true, status: true }, // Only select what we need
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found.' });
    }

    // Validate invoice status
    if (invoice.status === undefined || invoice.status === null) {
      return res.status(400).json({ message: 'Invoice status is missing.' });
    }

    try {
      // Create new invoice history entry
      const newInvoiceHistory = await prisma.invoice_histories.create({
        data: {
          invoicesId: invoice_id,
          status: invoice.status,
          created_at: new Date(),
        },
      });

      return res.status(201).json({
        message: 'Created new invoice history entry',
        invoice_history: newInvoiceHistory,
      });
    } catch (dbError) {
      console.error('Database error details:', {
        error: dbError,
        invoice_id,
        status: invoice.status,
      });

      return res.status(500).json({
        message: 'Failed to create invoice history',
        error:
          dbError instanceof Error ? dbError.message : 'Unknown database error',
      });
    }
  } catch (error) {
    console.error('Error in updateInvoiceHistory:', {
      error,
      invoice_id,
      stack: error instanceof Error ? error.stack : undefined,
    });

    return res.status(500).json({
      message: 'Error processing request',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
