import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function totalAmount(req: Request, res: Response) {
  const userId = (req as any).user.id;
  try {
    const findStore = await prisma.stores.findUnique({
      where: { userId: userId },
    });
    if (!findStore) {
      return res.status(404).json({ message: 'Not Found' });
    }
    const countAmount = await prisma.transaction.findMany({
      where: {
        status: {
          not: {
            in: ['pending', 'rejected'],
          },
        },
        storeId: findStore.id,
      },
      select: {
        amount: true,
      },
    });
    const totalAmount = countAmount.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

    return res
      .status(200)
      .json({ message: 'Total Fetched', total: totalAmount });
  } catch (error) {
    return res.status(500).json({ message: 'Error get total', error });
  }
}
export async function createWithdraw(req: Request, res: Response) {
  const { amount, bankId } = req.body;
  const userId = (req as any).user.id;
  try {
    const findStore = await prisma.stores.findUnique({
      where: { userId: userId },
    });
    if (!findStore) {
      return res.status(404).json({ message: 'Not Found' });
    }
    const countAmount = await prisma.transaction.findMany({
      where: {
        status: {
          not: {
            in: ['pending', 'rejected'], // Exclude "pending" and "rejected"
          },
        },
        storeId: findStore.id,
      },
      select: {
        amount: true,
      },
      orderBy: {
        createdAt: 'desc', // Sort by latest (descending) based on `createdAt`
      },
    });
    const totalAmount = countAmount.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );

    if (amount > totalAmount) {
      return res.status(400).json({ message: 'Amount withdrawal must lower' });
    }
    const checkBank = await prisma.bank_accounts.findUnique({
      where: { id: bankId },
    });
    if (!checkBank) {
      return res.status(404).json({ message: 'Bank not found' });
    }
    const newTransaction = await prisma.transaction.create({
      data: {
        name: 'Withdraw',
        type: 'withdraw',
        amount: Number(amount * -1),
        bankId: checkBank.id,
        status: 'pending',
        storeId: findStore.id,
      },
    });
    return res
      .status(200)
      .json({ message: 'Withdraw Request Created', withdraw: newTransaction });
  } catch (error) {
    return res.status(500).json({ message: 'Error create wihdraw', error });
  }
}

export async function getStoreTransaction(req: Request, res: Response) {
  const userId = (req as any).user.id;
  try {
    const findStore = await prisma.stores.findUnique({
      where: { userId: userId },
    });
    if (!findStore) {
      return res.status(404).json({ message: 'Not Found' });
    }
    const showTransaction = await prisma.transaction.findMany({
      where: {
        storeId: findStore.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res
      .status(200)
      .json({ message: 'List Transaction', transaction: showTransaction });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetchin transaction', error });
  }
}
