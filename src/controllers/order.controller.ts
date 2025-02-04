import { Request, Response } from 'express';
import { biteshipClient } from '../utils/biteshipapi';
import { PrismaClient } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { OrderRequest } from '../types/order';
const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
  const orderData: OrderRequest = req.body;

  try {
    // Prepare the order payload
    const orderPayload = {
      shipper_contact_name: orderData.shipper_contact_name,
      shipper_contact_phone: orderData.shipper_contact_phone,
      shipper_contact_email: orderData.shipper_contact_email,
      shipper_organization: orderData.shipper_organization,
      origin_contact_name: orderData.origin_contact_name,
      origin_contact_phone: orderData.origin_contact_phone,
      origin_address: orderData.origin_address,
      origin_note: orderData.origin_note,
      origin_postal_code: orderData.origin_postal_code,
      destination_contact_name: orderData.destination_contact_name,
      destination_contact_phone: orderData.destination_contact_phone,
      destination_contact_email: orderData.destination_contact_email,
      destination_address: orderData.destination_address,
      destination_postal_code: orderData.destination_postal_code,
      destination_note: orderData.destination_note,
      courier_company: orderData.courier_company,
      courier_type: orderData.courier_type, // Ensure this is included
      courier_insurance: orderData.courier_insurance,
      delivery_type: orderData.delivery_type,
      order_note: orderData.order_note,
      metadata: orderData.metadata,
      items: orderData.items,
    };

    // Send the request to create an order on Biteship
    const response = await biteshipClient.post('/orders', orderPayload);

    // Handle the successful response
    const order = response.data;
    console.log(order);
    // You can now store this order information in your database if needed
    res.status(201).json({
      message: 'Order created successfully!',
      order,
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
