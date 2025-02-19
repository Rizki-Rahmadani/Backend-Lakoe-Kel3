import { PrismaClient } from '@prisma/client';
import axios from 'axios';

import express, { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

const user_data = express.Router();

export async function BiteshipTracking(req: Request, res: Response) {
  const event = req.body;
  console.log('Webhook Biteship diterima:', event);

  // Cek apakah ada perubahan status pada order tertentu
  if (event.order_id && event.status) {
    console.log(`Order ID: ${event.order_id}`);
    console.log(`Status Order: ${event.status}`);

    // Map status dari Biteship ke status yang diinginkan
    let statusOrder = event.status;
    switch (event.status) {
      case 'allocated':
        statusOrder = 'siap dikirim';
        break;
      case 'droppingOff':
        statusOrder = 'dalam pengiriman';
        break;
      case 'delivered':
        statusOrder = 'pesanan selesai';
        break;
      case 'cancelled':
        statusOrder = 'dibatalkan';
        break;
      default:
        statusOrder = event.status; // Jika tidak ada yang cocok, gunakan status asli
    }

    console.log(`Status Order setelah diubah: ${statusOrder}`);

    // Cek status lama dari database
    try {
      const existingOrder = await prisma.orders.findUnique({
        where: { order_id: event.order_id },
        select: { status: true },
      });

      if (existingOrder) {
        // Bandingkan status lama dengan status baru
        if (existingOrder.status !== statusOrder) {
          console.log(
            `Status berubah dari '${existingOrder.status}' menjadi '${statusOrder}'`,
          );

          // Update status di database jika ada perubahan
          await prisma.orders.update({
            where: { biteship_order_id: event.order_id },
            data: { status: statusOrder },
          });

          console.log(
            `Status order ${event.order_id} berhasil diperbarui menjadi ${statusOrder}`,
          );
        } else {
          console.log(
            `Tidak ada perubahan status untuk Order ID ${event.order_id}`,
          );
        }
      } else {
        console.log(`Order ID ${event.order_id} tidak ditemukan di database`);
      }
    } catch (error) {
      console.error('Gagal memperbarui status order:', error);
    }
  }

  // Biteship mengharapkan response 200 untuk menandakan webhook berhasil diproses
  res.status(200).send('Webhook received');
}

const apiURL = 'http://localhost:3000/api'; // Replace with your actual API URL
// const token = 'YOUR_AUTH_TOKEN'; // Replace with actual token if required

export async function Midtrans(req: Request, res: Response) {
  // user_data.post("/save-data", (req, res) => {
  //   const req_user = req.body;
  //   console.log("data recieved: ", req_user);
  //   res.status(200).json({ message: "Data received successfully!", data: req_user });
  // });
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

    if (transactionStatus === 'capture' && fraudStatus === 'accept') {
      console.log(`Payment for order ${data.order_id} is captured.`);
      const service_charge = (800000 * 2 * 1) / 100;
      const invoice_response = await axios.post(
        apiURL + '/invoice/create-invoice',
        {
          status: 'success',
          prices: 800000 * 2,
          service_charge: service_charge,
          receiver_city: 'jkt',
          receiver_province: 'jkt',
          receiver_subDistrict: 'jkt',
          receiver_district: 'jkt',
          receiver_phone: '092131322',
          receiver_name: 'sam',
          receiver_postalCode: '12440',
          receiver_detailAddress: 'ehiuewuhwuiehrweur',
          receiver_email: 'sam@mail.com',
          // cartsId: 'cdqdwir39232',
          userId: 'cm71m960c0007tarc0pnj62eb',
          order_id: data.order_id,
          // paymentsId: 'joewjfiewjfiwf',
          // courierId: 'wqeijeiqejei',
        },
        {
          headers: {
            // Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // confirm order to biteship if is paid
      // const draftOrdersId = '2131241';
      // const orderBiteship = await axios.post(
      //   `${apiURL}/order/confirm/${draftOrdersId}`,
      // );

      //update order Status ke database
      // const dbOrders = await prisma.orders.update({
      //   where:{ midtrans_order_id: midtransResponse.data.},
      //   data: {
      //     status: 'Pesanan Baru',
      //   },
      // });

      const invoice_history_response = await axios.post(
        apiURL + '/invoice-history/create-invoice-history',
        {
          invoice_id: invoice_response.data.invoice_created.id,
        },
      );
      console.log('invoice_history created: ', invoice_history_response.data);
      await axios.post(
        `${apiURL}/payment/create-payment`,
        {
          bank: result.va_numbers?.[0]?.bank || 'unknown',
          gross_amount: Number(result.gross_amount),
          status_code: result.status_code,
          midtrans_transaction_id: result.transaction_id,
          invoicesId: invoice_response.data.invoice_created.id,
        },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    if (transactionStatus === 'deny') {
      console.log(`Payment for order ${data.order_id} is deny.`);
      const service_charge = (800000 * 2 * 1) / 100;
      const invoice_response = await axios.post(
        apiURL + '/invoice/create-invoice',
        {
          status: 'failed',
          prices: 800000 * 2,
          service_charge: service_charge,
          receiver_city: 'jkt',
          receiver_province: 'jkt',
          receiver_subDistrict: 'jkt',
          receiver_district: 'jkt',
          receiver_phone: '092131322',
          receiver_name: 'sam',
          receiver_postalCode: '12440',
          receiver_detailAddress: 'ehiuewuhwuiehrweur',
          receiver_email: 'sam@mail.com',
          // cartsId: 'cdqdwir39232',
          userId: 'cm71m960c0007tarc0pnj62eb',
          order_id: data.order_id,
          // paymentsId: 'joewjfiewjfiwf',
          // courierId: 'wqeijeiqejei',
        },
        {
          headers: {
            // Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      //=====================================
      // confirm order to biteship if is paid
      // const draftOrdersId = '2131241';
      // const orderBiteship = await axios.post(
      //   `${apiURL}/order/confirm/${draftOrdersId}`,
      // );
      //update order Status ke database
      // const dbOrders = await prisma.orders.update({
      //   where:{ midtrans_order_id: midtransResponse.data.},
      //   data: {
      //     status: 'Dibatalkan',
      //   },
      // });
      //=====================================

      const invoice_history_response = await axios.post(
        apiURL + '/invoice-history/create-invoice-history',
        {
          invoice_id: invoice_response.data.invoice_created.id,
        },
      );
      console.log('invoice_history created: ', invoice_history_response.data);

      await axios.post(
        `${apiURL}/payment/create-payment`,
        {
          bank: result.va_numbers?.[0]?.bank || 'unknown',
          gross_amount: Number(result.gross_amount),
          status_code: result.status_code,
          midtrans_transaction_id: result.transaction_id,
          invoicesId: invoice_response.data.invoice_updated.id,
        },
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    if (transactionStatus === 'settlement' && fraudStatus === 'accept') {
      console.log(`Payment for order ${data.order_id} successful.`);

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

      //=====================================
      // confirm order to biteship if is paid
      // const draftOrdersId = '2131241';
      // const orderBiteship = await axios.post(
      //   `${apiURL}/order/confirm/${draftOrdersId}`,
      // );
      //update order Status ke database
      // const dbOrders = await prisma.orders.update({
      //   where:{ midtrans_order_id: midtransResponse.data.},
      //   data: {
      //     status: 'Pesanan Baru',
      //   },
      // });
      //=====================================

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
      const service_charge = (800000 * 2 * 1) / 100;

      const invoice_response = await axios.post(
        apiURL + '/invoice/create-invoice',
        {
          status: 'pending',
          prices: 800000 * 2,
          service_charge: service_charge,
          receiver_city: 'jkt',
          receiver_province: 'jkt',
          receiver_subDistrict: 'jkt',
          receiver_district: 'jkt',
          receiver_phone: '092131322',
          receiver_name: 'sam',
          receiver_postalCode: '12440',
          receiver_detailAddress: 'ehiuewuhwuiehrweur',
          receiver_email: 'sam@mail.com',
          // cartsId: 'cdqdwir39232',
          userId: 'cm71m960c0007tarc0pnj62eb',
          order_id: data.order_id,
          // paymentsId: 'joewjfiewjfiwf',
          // courierId: 'wqeijeiqejei',
        },
        {
          headers: {
            // Authorization: `bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const invoice_history_response = await axios.post(
        apiURL + '/invoice-history/create-invoice-history',
        {
          invoice_id: invoice_response.data.invoice_created.id,
        },
      );
      console.log('invoice_history created: ', invoice_history_response.data);
    } else if (
      transactionStatus === 'failure' ||
      transactionStatus === 'cancel' ||
      transactionStatus === 'expire'
    ) {
      console.log(`Payment for order ${data.order_id} failed.`);
      await axios.put(
        apiURL + '/invoice/update-invoice',
        {
          order_id: data.order_id,
          status: 'failed',
        },
        {
          headers: {
            //   Authorization: `bearer ${token}`,
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
}
