import { Request, Response } from 'express';
import { biteshipClient } from '../utils/biteshipapi';
import { PrismaClient } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { OrderItem, OrderRequest } from '../types/order';
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
  const orderData: OrderRequest = req.body;

  if (!orderData.items || orderData.items.length === 0) {
    return res
      .status(400)
      .json({ message: 'Items array is required and cannot be empty.' });
  }

  const orderItem: OrderItem = orderData.items[0]; // Correct way to extract first item

  try {
    const orderPayload = {
      origin_contact_name: orderData.origin_contact_name,
      origin_contact_phone: orderData.origin_contact_phone,
      origin_contact_email: orderData.origin_contact_email,
      origin_address: orderData.origin_address,
      origin_postal_code: orderData.origin_postal_code,
      origin_area_id: orderData.origin_area_id,
      destination_contact_name: orderData.destination_contact_name,
      destination_contact_phone: orderData.destination_contact_phone,
      destination_contact_email: orderData.destination_contact_email,
      destination_address: orderData.destination_address,
      destination_postal_code: orderData.destination_postal_code,
      destination_note: orderData.destination_note,
      destination_area_id: orderData.destination_area_id,
      courier_company: orderData.courier_company,
      courier_type: orderData.courier_type,
      courier_insurance: orderData.courier_insurance,
      delivery_type: orderData.delivery_type,
      order_note: orderData.order_note,
      items: [
        {
          name: orderItem.name,
          description: orderItem.description,
          variant_options: orderItem.variant_options,
          category: orderItem.category,
          value: orderItem.value,
          quantity: orderItem.quantity,
          height: orderItem.height,
          length: orderItem.length,
          weight: orderItem.weight,
          width: orderItem.width,
        },
      ],
    };

    console.log('Order item:', orderItem); // Log the item to debug

    // Make API request to Biteship
    const apiBiteship = `https://api.biteship.com/v1/orders`;
    const biteship = await axios.post(apiBiteship, orderPayload, {
      headers: {
        Authorization: `Bearer ${process.env.API_BITESHIP_TEST}`,
        'Content-Type': 'application/json',
      },
    });

    // const confirmOrder = await prisma.orders.update({
    //   where: { order_id: order_id },
    //   data: { status: statusOrder },
    // });

    const data = biteship.data;
    console.log(data);
    // You can now store this order information in your database if needed
    res.status(201).json({
      message: 'draft order created successfully!',
      orderId: data.id,
      data,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      console.error('Error creating order:', errorMessage);
      return res.status(500).json({
        message: 'Failed to create order',
        error: errorMessage,
      });
    } else {
      // console.error("Unexpected error:", error);
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: (error as Error).message || error,
      });
    }
  }
};

export const createDraftOrder = async (req: Request, res: Response) => {
  const orderData: OrderRequest = req.body;

  if (!orderData.items || orderData.items.length === 0) {
    return res
      .status(400)
      .json({ message: 'Items array is required and cannot be empty.' });
  }

  const orderItem: OrderItem = orderData.items[0]; // Correct way to extract first item

  try {
    const orderPayload = {
      origin_contact_name: orderData.origin_contact_name,
      origin_contact_phone: orderData.origin_contact_phone,
      origin_contact_email: orderData.origin_contact_email,
      origin_address: orderData.origin_address,
      origin_postal_code: orderData.origin_postal_code,
      origin_area_id: orderData.origin_area_id,
      destination_contact_name: orderData.destination_contact_name,
      destination_contact_phone: orderData.destination_contact_phone,
      destination_contact_email: orderData.destination_contact_email,
      destination_address: orderData.destination_address,
      destination_postal_code: orderData.destination_postal_code,
      destination_note: orderData.destination_note,
      destination_area_id: orderData.destination_area_id,
      courier_company: orderData.courier_company,
      courier_type: orderData.courier_type,
      courier_insurance: orderData.courier_insurance,
      delivery_type: orderData.delivery_type,
      order_note: orderData.order_note,
      items: [
        {
          name: orderItem.name,
          description: orderItem.description,
          variant_options: orderItem.variant_options,
          category: orderItem.category,
          value: orderItem.value,
          quantity: orderItem.quantity,
          height: orderItem.height,
          length: orderItem.length,
          weight: orderItem.weight,
          width: orderItem.width,
        },
      ],
    };

    console.log('Order item:', orderItem); // Log the item to debug

    // Make API request to Biteship
    const apiBiteship = `https://api.biteship.com/v1/draft_orders`;
    const biteship = await axios.post(apiBiteship, orderPayload, {
      headers: {
        Authorization: `Bearer ${process.env.API_BITESHIP_TEST}`,
        'Content-Type': 'application/json',
      },
    });

    const data = biteship.data;
    // Simpan orderId ke database
    await prisma.orders.create({
      data: {
        receiver_name: orderData.destination_contact_name,
        storeId: '',
        locationId: '',
        order_id: data.id,
        status: data.status,
      },
    });

    console.log(data);
    // You can now store this order information in your database if needed
    res.status(201).json({
      message: 'Draft order created and saved successfully!',
      orderId: data.id,
      data,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      console.error('Error creating order:', errorMessage);
      return res.status(500).json({
        message: 'Failed to create order',
        error: errorMessage,
      });
    } else {
      // console.error("Unexpected error:", error);
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: (error as Error).message || error,
      });
    }
  }
};

export const confirmDraftOrder = async (req: Request, res: Response) => {
  try {
    // Ambil ID dari body request
    const { id } = req.params;
    const apiBiteship = `https://api.biteship.com/v1/draft_orders/${id}/confirm`;

    // Pastikan token ada di environment
    console.log('Token:', process.env.API_BITESHIP_TEST);

    // Perbaiki letak headers
    const biteship = await axios.post(
      apiBiteship,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.API_BITESHIP_TEST}`,
          'Content-Type': 'application/json',
        },
      },
    );

    // Kirim respons sukses
    res.status(200).json({
      message: 'Draft order confirmed successfully!',
      data: biteship.data,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      console.error('Error confirming draft order:', errorMessage);
      return res.status(500).json({
        message: 'Failed to confirm draft order',
        error: errorMessage,
      });
    } else {
      console.error('Unexpected error:', error);
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: (error as Error).message || error,
      });
    }
  }
};

export const retrieveOrder = async (req: Request, res: Response) => {
  const { userId } = (req as any).user;
  try {
    // Cari Store berdasarkan userId
    const findStore = await prisma.stores.findUnique({
      where: { userId: userId },
    });

    if (!findStore) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Cari Orders berdasarkan storeId
    const findOrder = await prisma.orders.findMany({
      where: { storeId: findStore.id },
    });

    // Cari Invoices berdasarkan userId
    // const findInvoice = await prisma.invoices.findMany({
    //   where: { order_id: findOrder.id },
    // });

    // Kirim response dengan findOrder dan findInvoice
    res.json({
      store: findStore,
      orders: findOrder,
      // invoices: findInvoice,
    });
  } catch (error: unknown) {
    console.error('Error retrieving orders and invoices:', error);
    return res.status(500).json({
      message: 'An unexpected error occurred',
      error: (error as Error).message || error,
    });
  }
};
