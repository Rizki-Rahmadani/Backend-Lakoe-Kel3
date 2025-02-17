import { PrismaClient } from '@prisma/client';
import { dmmfToRuntimeDataModel } from '@prisma/client/runtime/library';
import { ADDRGETNETWORKPARAMS } from 'dns';
import { Request, Response, NextFunction } from 'express';
import { stat } from 'fs';
const prisma = new PrismaClient();

export async function createInvoice(req: Request, res: Response) {
  const {
    prices,
    status,
    service_charge,
    receiver_province,
    receiver_city,
    receiver_district,
    receiver_subDistrict,
    receiver_postalCode,
    receiver_detailAddress,
    receiver_phone,
    receiver_email,
    receiver_name,
    cartsId,
    userId,
    paymentsId,
    courierId,
    order_id,
  } = req.body;

  try {
    const data = {
      status: status,
      prices: prices,
      service_charge: service_charge,
      receiver_city: receiver_city,
      receiver_province: receiver_province,
      receiver_subDistrict: receiver_subDistrict,
      receiver_district: receiver_district,
      receiver_phone: receiver_phone,
      receiver_name: receiver_name,
      receiver_postalCode: receiver_postalCode,
      receiver_detailAddress: receiver_detailAddress,
      receiver_email: receiver_email,
      cartsId: cartsId,
      userId: userId,
      order_id: order_id,
      // paymentsId: paymentsId,
      // courierId: courierId
    };

    console.log(data);

    const invoice_created = await prisma.invoices.create({
      data: data,
    });

    return res
      .status(201)
      .json({ message: 'invoice data created: ', invoice_created });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'error on creating invoice', error });
  }

  //biteship code

  // const paymentExist = prisma.payments.findUnique({
  //     where: {id: paymentId}
  // })
}

export async function getInvoice(req: Request, res: Response) {
  try {
    // const {id} = req.body;

    const findInvoice = await prisma.invoices.findMany({
      // where: {id: id},
      select: {
        id: true,
        status: true,
        prices: true,
        service_charge: true,
        receiver_city: true,
        receiver_province: true,
        receiver_subDistrict: true,
        receiver_district: true,
        receiver_phone: true,
        receiver_name: true,
        receiver_postalCode: true,
        receiver_detailAddress: true,
        receiver_email: true,

        userId: true,
        user_id: {
          select: {
            fullname: true,
            phone_number: true,
            email: true,
          },
        },
        paymentsId: true,
        payment_id: {
          select: {
            bank: true,
            status: true,
          },
        },
        courierId: true,
        courier_id: {
          select: {
            courier_service_name: true,
          },
        },
      },
    });

    const formattedInvoice = (await findInvoice).map((invoices) => {
      return {
        ...invoices,
      };
    });

    return res
      .status(200)
      .json({ message: 'invoice data fetched: ', formattedInvoice });
  } catch (error) {
    return res.status(500).json({ message: 'error on getting invoice', error });
  }

  // const paymentExist = prisma.payments.findUnique({
  //     where: {id: paymentId}
  // })
}

export async function updateInvoice(req: Request, res: Response) {
  const { order_id, status } = req.body;

  try {
    const data = { status: status };
    console.log(data);

    const existingInvoice = await prisma.invoices.findFirst({
      where: { order_id: order_id },
    });

    let invoice_updated = null; // Declare outside to avoid "not defined" error

    if (existingInvoice) {
      invoice_updated = await prisma.invoices.update({
        where: { id: existingInvoice.id }, // Use the unique `id`
        data: {
          status: status,
        },
      });
    } else {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    return res
      .status(200)
      .json({ message: 'Invoice data updated', invoice_updated });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating invoice', error });
  }
}
