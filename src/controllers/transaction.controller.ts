import express, { Request, Response } from 'express';
import { MidtransClient } from 'midtrans-node-client';
import dotenv from 'dotenv';
const app = express();
app.use(express.json()); // Middleware to parse JSON requests
dotenv.config();

// Initialize Midtrans Snap client
const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: process.env.SERVER_KEY, // Replace with your Midtrans server key
  clientKey: process.env.CLIENT_KEY, // Replace with your Midtrans client key
});

// Define the POST endpoint
export default async function createTransaction(req: Request, res: Response) {
  try {
    // Destructure incoming request body
    const { id, productName, price, quantity, service_charge, shipment } =
      req.body;
    if(!id || !productName || !price || !quantity || !service_charge || !shipment){
      res.status(400).json({message: "error not enough data"})
    }
    const amount = price * quantity + service_charge + shipment;

    // Construct parameter object for Midtrans

    const parameter = {
      item_details: [
        {
          name: productName,
          price: price,
          quantity: quantity,
        },
        {
          name: 'service charge',
          price: Math.floor(service_charge),
          quantity: 1,
        },
        {
          name: 'shipment',
          price: shipment,
          quantity: 1,
        },
      ],
      transaction_details: {
        order_id: id,
        gross_amount: Math.floor(amount),
      },
      credit_card: {
        secure: true,
      },
    };

    // Create transaction token using Midtrans
    const token = await snap.createTransaction(parameter);

    // Ambil URL pembayaran dari response Midtrans
    const redirectUrl = token.redirect_url;

    console.log('Transaction Token:', token.token);
    console.log('URL Pembayaran:', redirectUrl);
    // //dibawah ini untuk mengirim pembayaran ke wa
    // const waMessage = `Halo, saya ingin melakukan pembayaran. Klik link berikut untuk melanjutkan: ${redirectUrl}`;
    //  // Encode pesan untuk URL WhatsApp
    //  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

    // Respond with the token
    res.status(200).json({ token });
    return token;
  } catch (error) {
    console.error('Error creating transaction token:', error);
    res.status(500).json({ error: 'Failed to create transaction token' });
  }
}
