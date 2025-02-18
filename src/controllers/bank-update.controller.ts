import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function updateData(req: Request, res: Response) {
  const { id } = req.params;
  const { acc_name, acc_number, bank } = req.body;
  try {
    const bankExist = await prisma.bank_accounts.findUnique({
      where: {
        id: id,
      },
    });

    if (!bankExist) {
      res.status(404).json({ messsage: 'bank not found' });
    }

    const bank_edit = await prisma.bank_accounts.update({
      where: {
        id: id,
      },
      data: {
        acc_name: acc_name || bankExist?.acc_name,
        acc_number: acc_number || bankExist?.acc_number,
        bank: bank || bankExist?.bank,
      },
    });

    return res.status(201).json({ message: 'Bank edited', bank_edit });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'error adding bank details.', error });
  }
}
