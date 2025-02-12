import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

export async function createPayment(req: Request, res: Response) {
  const {
    bank,
    gross_amount,
    status_code,
    midtrans_transaction_id,
    invoicesId,
  } = req.body;
  // const userId = (req as any).user.id;
  const userId = 'cm6iuhgwl0001tat8bgmz4wkc';
  if (!bank && !gross_amount && !status_code && userId) {
    return res
      .status(400)
      .json({ message: 'failed to get data from midtrans.' });
  }
  let status;
  if (status_code == '200') {
    status = 'success';
  } else {
    status = 'failed';
  }
  try {
    const findUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!findUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const data = {
      bank: bank,
      amount: gross_amount,
      status: status,
      userId: userId,
      midtrans_transaction_id: midtrans_transaction_id,
      invoicesId: invoicesId,
    };
    console.log(data);

    const createdPayment = await prisma.payments.create({
      data: data,
    });

    //   console.log("payment created",createPayment)
    return res
      .status(200)
      .json({ message: 'Payment generated', store: createdPayment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'error getting data from midtrans.', error });
  }
}

export async function getPayment(req: Request, res: Response) {
  const userId = (req as any).user.id;

  try {
    const userExist = prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userExist) {
      return res.status(404).json({ message: 'User not found' });
    }

    const paymentExist = prisma.payments.findMany({
      where: { userId: userId },
      select: {
        bank: true,
        amount: true,
        status: true,
        userId: true,
      },
    });

    const formattedPayment = (await paymentExist).map((pay) => {
      return {
        ...pay,
      };
    });

    res.status(200).json({ message: 'Payment fetched: ', formattedPayment });
  } catch (error) {
    return res.status(500).json({ message: 'error getting payment from db' });
  }
}
