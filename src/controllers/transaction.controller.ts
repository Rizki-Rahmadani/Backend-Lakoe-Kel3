import express, { Request, Response } from 'express';
import { MidtransClient } from 'midtrans-node-client';

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Initialize Midtrans Snap client
const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: 'SB-Mid-server-HTB5WCLALgagfSdtqzJVMkgB', // Replace with your Midtrans server key
  clientKey: 'SB-Mid-client-4omBGFxKlAqOqhRu', // Replace with your Midtrans client key
});

// Define the POST endpoint
export default async function createTransaction(req: Request, res: Response) {
  try {
    // Destructure incoming request body
    const { id, productName, price, quantity } = req.body;

    // Construct parameter object for Midtrans
    const parameter = {
      item_details: {
        name: productName,
        price: price,
        quantity: quantity,
      },
      transaction_details: {
        order_id: id,
        gross_amount: price * quantity,
      },
      credit_card: {
        secure: true,
      },
    };

    // Create transaction token using Midtrans
    const token = await snap.createTransactionToken(parameter);

    console.log('Transaction Token:', token); // Log the token for debugging

    // Respond with the token
    res.status(200).json({ token });
    return token;
  } catch (error) {
    console.error('Error creating transaction token:', error);
    res.status(500).json({ error: 'Failed to create transaction token' });
  }
}
