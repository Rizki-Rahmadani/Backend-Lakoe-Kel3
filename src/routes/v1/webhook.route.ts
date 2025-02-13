import axios from 'axios';
import express from 'express';

const webhook_midtrans = express.Router();
const apiURL = 'http://localhost:3000/api'; // Replace with your actual API URL
// const token = 'YOUR_AUTH_TOKEN'; // Replace with actual token if required

webhook_midtrans.post('/midtrans-webhook', async (req, res) => {
  try {
    const data = req.body;
    console.log('Midtrans Webhook Data:', data);

    // Verify the notification with Midtrans
    const midtransResponse = await axios.get(
      `https://api.sandbox.midtrans.com/v2/${data.order_id}/status`,
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from('SB-Mid-server-HTB5WCLALgagfSdtqzJVMkgB').toString(
              'base64',
            ),
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('response dari midtrans: ', midtransResponse);

    const result = midtransResponse.data;
    const transactionStatus = result.transaction_status;
    const fraudStatus = result.fraud_status;

    if (transactionStatus === 'settlement' && fraudStatus === 'accept') {
      console.log(`Payment for order ${data.order_id} successful.`);

      // Update invoice status
      // const price = 500000;
      // const quantity = 2
      // const service_charge = (price * quantity * 1) / 100;

      const updateInvoice = await axios.put(
        apiURL + '/invoice/update-invoice',
        {
          order_id: data.order_id,
          status: 'success',
        },
        {
          headers: {
            //   Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Create payment record
      await axios.post(
        `${apiURL}/payment/create-payment`,
        {
          bank: result.va_numbers?.[0]?.bank || 'unknown',
          gross_amount: Number(result.gross_amount),
          status_code: result.status_code,
          midtrans_transaction_id: result.transaction_id,
          invoicesId: updateInvoice.data.invoice_updated.id,
        },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const invoice_history_response = await axios.put(
        apiURL + '/invoice-history/update-invoice-history',
        {
          invoice_id: updateInvoice.data.invoice_updated.id,
        },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('invoice_history created: ', invoice_history_response.data);
    } else if (transactionStatus === 'pending') {
      console.log(`Payment for order ${data.order_id} is pending.`);
    } else {
      console.log(`Payment for order ${data.order_id} failed.`);
      await axios.put(
        `${apiURL}/invoice/update-invoice`,
        {
          id: data.order_id,
          status: 'failed',
        },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Error processing Midtrans webhook:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default webhook_midtrans;
