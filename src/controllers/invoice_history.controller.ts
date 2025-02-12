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
