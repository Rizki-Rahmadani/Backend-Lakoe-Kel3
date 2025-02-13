import { Request, Response } from 'express';
import { biteshipClient } from '../utils/biteshipapi';
import { PrismaClient } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { OrderItem, OrderRequest } from '../types/order';
const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
  const orderData: OrderRequest = req.body;
  const orderItem: OrderItem = req.body;
  const { productId, locationId, storeId, invoiceId } = req.body;
  try {
    const findStore = await prisma.stores.findUnique({
      where: { id: storeId },
      select: {
        name: true,
        user: true,
      },
    });
    if (!findStore) {
      return res.status(404).json({ message: 'Store not found' });
    }
    const findLocation = await prisma.location.findUnique({
      where: { id: locationId, storesId: storeId, is_main_location: true },
    });
    if (!findLocation) {
      return res.status(404).json({ message: 'Location not available' });
    }
    const findInvoice = await prisma.invoices.findUnique({
      where: { id: invoiceId },
    });
    if (!findInvoice) {
      return res.status(404).json({ message: 'Not found' });
    }
    // Prepare the order payload
    const orderPayload = {
      origin_contact_name: findStore.name,
      origin_contact_phone: findStore.user.phone_number,
      origin_contact_email: findStore.user.email,
      origin_address: findLocation.address,
      origin_postal_code: findLocation.postal_code,
      origin_coordinate: {
        latitude: findLocation.latitude,
        longitude: findLocation.longitude,
      },
      origin_area_id: findLocation.biteship_area_id,
      destination_contact_name: findInvoice.receiver_name,
      destination_contact_phone: findInvoice.receiver_phone,
      destination_contact_email: findInvoice.receiver_email,
      destination_address: findInvoice.receiver_address,
      destination_postal_code: orderData.destination_postal_code,
      destination_note: orderData.destination_note,
      destination_coordinate: {
        latitude: orderData.destination_coordinate.latitude,
        longitude: orderData.destination_coordinate.longitude,
      },
      destination_area_id: orderData.destination_area_id,
      courier_company: orderData.courier_company,
      courier_type: orderData.courier_type, // Ensure this is included
      courier_insurance: orderData.courier_insurance,
      delivery_type: orderData.delivery_type,
      order_note: 'please be Careful',
      items: [
        {
          name: orderItem.name,
          // description: orderItem.description,
          // variant_options: orderItem.variant_options,
          // category: orderItem.category,
          value: orderItem.value,
          quantity: orderItem.quantity,
          // height: orderItem.height,
          // length: orderItem.length,
          weight: orderItem.weight,
          // width: orderItem.width,
        },
      ],
    };

    // URL API Biteship
    const apiBiteship = `https://api.biteship.com/v1/draft-orders`;
    // Send the request to create an order on Biteship

    // Buat request ke Biteship API
    const biteship = await axios.post(apiBiteship, orderPayload, {
      headers: {
        Authorization: `Bearer ${process.env.API_BITESHIP_TEST}`, // Pastikan API key valid
        'Content-Type': 'application/json',
      },
    });

    // const response = await biteshipClient.post('/draft_orders', orderPayload);

    const data = biteship.data;
    console.log(data);
    // You can now store this order information in your database if needed
    res.status(201).json({
      message: 'draft order created successfully!',
      orderId: data,
    });
  } catch (error: unknown) {
    // Type narrowing for the Axios error
    if (axios.isAxiosError(error)) {
      // If the error is an AxiosError, we can safely access properties like response
      const errorMessage = error.response?.data || error.message;
      console.error('Error creating order:', errorMessage);
      console.log(orderData);
      return res.status(500).json({
        message: 'Failed to create order',
        error: errorMessage,
      });
    } else {
      // For non-Axios errors
      console.error('Unexpected error:', error);
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: (error as Error).message || error,
      });
    }
  }
};

export const confirmOrder = async (req: Request, res: Response) => {
  try {
    // Fetch draft orders from Biteship
    const response = await biteshipClient.get('/draft_orders');
    console.log('This is response: ', response.data);

    // Send only the necessary data (response.data) in the JSON response
    res.status(200).json({
      message: 'Draft order fetched successfully!',
      data: response.data, // Only send the data property
    });
  } catch (error: unknown) {
    // Handle errors
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message;
      console.error('Error fetching draft orders:', errorMessage);
      return res.status(500).json({
        message: 'Failed to fetch draft orders',
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
  const { id } = req.params;

  try {
    // Send the request to create an order on Biteship
    const response = await biteshipClient.get('/orders/' + id);

    // Handle the successful response
    const order = response.data;
    // You can now store this order information in your database if needed
    res.status(201).json({
      message: 'Order Retrieved successfully!',
      order,
    });
  } catch (error: unknown) {
    // Type narrowing for the Axios error
    if (axios.isAxiosError(error)) {
      // If the error is an AxiosError, we can safely access properties like response
      const errorMessage = error.response?.data || error.message;
      console.error('Error creating order:', errorMessage);
      return res.status(500).json({
        message: 'Failed to create order',
        error: errorMessage,
      });
    } else {
      // For non-Axios errors
      console.error('Unexpected error:', error);
      return res.status(500).json({
        message: 'An unexpected error occurred',
        error: (error as Error).message || error,
      });
    }
  }
};
