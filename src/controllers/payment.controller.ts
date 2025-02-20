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
    storeId,
  } = req.body;
  // const userId = (req as any).user.id;
  // const userId = 'cm78p5jli0001tankm1gcyj9x';
  if (!bank && !gross_amount && !status_code) {
    return res
      .status(400)
      .json({ message: 'failed to get data from midtrans.' });
  }
  let status;
  if (status_code == '200') {
    status = 'success';
  } else if (status_code == '201') {
    status = 'pending';
  } else {
    status = 'failed';
  }
  try {
    const findUser = await prisma.stores.findUnique({
      where: { id: storeId },
    });
    if (!findUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const data = {
      bank: bank,
      amount: gross_amount,
      status: status,
      storeId: storeId,
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
  const { storeId } = req.body;

  try {
    const userExist = prisma.stores.findUnique({
      where: { id: storeId },
    });
    if (!userExist) {
      return res.status(404).json({ message: 'User not found' });
    }

    const paymentExist = prisma.payments.findMany({
      where: { storeId: storeId },
      select: {
        bank: true,
        amount: true,
        status: true,
        storeId: true,
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
