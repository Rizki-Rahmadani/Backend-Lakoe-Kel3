import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import Cookies from 'js-cookie';
import express, { Request, Response, NextFunction, response } from 'express';
export const app_temporary = express();
import dotenv from 'dotenv';
dotenv.config();

const serverKey = process.env.SERVER_KEY;
const clientKey = process.env.CLIENT_KEY;
const prisma = new PrismaClient();

// const user_data = express.Router();

export async function BiteshipTracking(req: Request, res: Response) {
  const event = req.body;
  // console.log('Webhook Biteship diterima:', event);

  // Cek apakah ada perubahan status pada order tertentu
  if (event.order_id && event.status) {
    // console.log(`Order ID: ${event.order_id}`);
    // console.log(`Status Order: ${event.status}`);

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

const apiURL = process.env.API_URL || 'http://localhost:3000/api'; // Replace with your actual API URL
// const token = 'YOUR_AUTH_TOKEN'; // Replace with actual token if required

export async function Midtrans(req: Request, res: Response) {
  const token = Cookies.get('token');
  console.log(token);

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
            'Basic ' + Buffer.from(String(serverKey)).toString('base64'),
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('response dari midtrans: ', midtransResponse);
    const result = midtransResponse.data;
    const transactionStatus = result.transaction_status;
    const fraudStatus = result.fraud_status;

    async function get_biteship_order(id: string) {
      const response = await axios.get(apiURL + `/order/${id}`);
      // console.log("data of biteship response: ", response.data);
      return response.data;
    }
    const response_order = await get_biteship_order(data.order_id);
    console.log('ini adalah response order: ', response_order);
    async function get_email_order(id: string) {
      const response = await axios.post(apiURL + `/order/get-email`, {
        id_order: id,
      });
      // console.log("data of email response: ", response.data);
      return response.data;
    }
    const response_email = await get_email_order(data.order_id);

    // async function user_fetch() {

    //   const user_response = await axios.get(apiURL + '/user', {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   return user_response.data.user[0];
    // }
    // const response_user = await user_fetch();

    // async function fetch_store_location(){
    //   const response = await axios.post(apiURL + '/stores/by-product',{
    //     product_id: data.product_id
    //   })

    //   console.log(response);
    //   return response.data;
    // }
    // const stores = fetch_store_location();

    // async function user_store_fetch(){
    //   const response = await axios.post(apiURL + '/user', {
    //     storeId: ((await stores).store_id.id)
    //   })
    //   console.log("user res",response)
    //   return response.data.user;
    // }
    // const storeUser_fetch = user_store_fetch();

    // console.log("data of biteship response: ", response_order);

    if (transactionStatus === 'capture' && fraudStatus === 'accept') {
      console.log(`Payment for order ${data.order_id} is captured.`);

      // const invoice_response = await axios.post(
      //   apiURL + '/invoice/create-invoice',
      //   {
      //     status: 'success',
      //     prices: Number(midtransResponse.data.gross_amount),

      //     receiver_city: response_order.order.destination?.city_name,
      //     receiver_province: response_order.order.destination?.province_name,

      //     receiver_district: response_order.order.destination?.district_name,
      //     receiver_phone: response_order.order.destination?.contact_phone,
      //     receiver_name: response_order.order.destination?.contact_name,
      //     receiver_postalCode:
      //       (response_order.order.destination?.postal_code).toString(),
      //     receiver_detailAddress: response_order.order.destination?.address,
      //     receiver_email: response_email.data_response?.destination_email,
      //     storeId: "",
      //     order_id: data.order_id,
      //   },
      //   {
      //     headers: {
      //       // Authorization: `bearer ${token}`,
      //       'Content-Type': 'application/json',
      //     },
      //   },
      // );

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

      console.log('my data: ', updateInvoice.data.invoice_updated.storesId);
      // confirm order to biteship if is paid
      const draftOrdersId = data.order_id;
      const orderBiteship = await axios.post(
        `${apiURL}/order/confirm/${draftOrdersId}`,
      );

      // update order Status ke database
      const dbOrders = await prisma.orders.update({
        where: { order_id: data.order_id },
        data: {
          status: 'Pesanan Baru',
          storeId: updateInvoice.data.invoice_updated.storesId
        },
      });

      const invoice_history_response = await axios.post(
        apiURL + '/invoice-history/create-invoice-history',
        {
          invoice_id: updateInvoice.data.invoice_updated.id,
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
          invoicesId: updateInvoice.data.invoice_updated.id,
          storeId: updateInvoice.data.invoice_updated.storesId,
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

      // const invoice_response = await axios.post(
      //   apiURL + '/invoice/create-invoice',
      //   {
      //     status: 'failed',
      //     prices: Number(midtransResponse.data.gross_amount),

      //     receiver_city: response_order.order.destination?.city_name,
      //     receiver_province: response_order.order.destination?.province_name,

      //     receiver_district: response_order.order.destination?.district_name,
      //     receiver_phone: response_order.order.destination?.contact_phone,
      //     receiver_name: response_order.order.destination?.contact_name,
      //     receiver_postalCode:
      //       (response_order.order.destination?.postal_code).toString(),
      //     receiver_detailAddress: response_order.order.destination?.address,
      //     receiver_email: response_email.data_response?.destination_email,
      //     userId: (await storeUser_fetch).id,
      //     order_id: data.order_id,
      //   },
      //   {
      //     headers: {
      //       // Authorization: `bearer ${token}`,
      //       'Content-Type': 'application/json',
      //     },
      //   },
      // );

      const updateInvoice = await axios.put(
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

      //=====================================

      const dbOrders = await prisma.orders.update({
        where: { order_id: data.order_id },
        data: {
          status: 'Dibatalkan',
          storeId: updateInvoice.data.invoice_updated.storesId
        },
      });
      //=====================================

      const invoice_history_response = await axios.post(
        apiURL + '/invoice-history/create-invoice-history',
        {
          invoice_id: updateInvoice.data.invoice_updated.id,
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
          invoicesId: updateInvoice.data.invoice_updated.id,
          storeId: updateInvoice.data.invoice_updated.storesId,
          // userId: response_user.id,
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

      const draftOrdersId = data.order_id;
      const orderBiteship = await axios.post(
        `${apiURL}/order/confirm/${draftOrdersId}`,
      );

      console.log("got store id: ", updateInvoice.data.invoice_updated.storesId);

      const dbOrders = await prisma.orders.update({
        where: { order_id: data.order_id },
        data: {
          status: 'Pesanan Baru',
          storeId: updateInvoice.data.invoice_updated.storesId
        },
      });
      //=====================================

      const invoice_store = await axios.post(apiURL + '/invoice/get-invoice', {
        id: updateInvoice.data.invoice_updated.id,
      });

      const store_id = invoice_store.data.formattedInvoice.storesId;

      // Create payment record
      await axios.post(
        `${apiURL}/payment/create-payment`,
        {
          bank: result.va_numbers?.[0]?.bank || 'unknown',
          gross_amount: Number(result.gross_amount),
          status_code: result.status_code,
          midtrans_transaction_id: result.transaction_id,
          invoicesId: updateInvoice.data.invoice_updated.id,
          storeId: updateInvoice.data.invoice_updated.storesId,
          // userId: response_user.id,
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

      // const invoice_response = await axios.post(
      //   apiURL + '/invoice/create-invoice',
      //   {
      //     status: 'pending',
      //     prices: Number(midtransResponse.data.gross_amount),

      //     receiver_city: response_order.order.destination?.city_name,
      //     receiver_province: response_order.order.destination?.province_name,

      //     receiver_district: response_order.order.destination?.district_name,
      //     receiver_phone: response_order.order.destination?.contact_phone,
      //     receiver_name: response_order.order.destination?.contact_name,
      //     receiver_postalCode:
      //       (response_order.order.destination?.postal_code).toString(),
      //     receiver_detailAddress: response_order.order.destination?.address,
      //     receiver_email: response_email.data_response?.destination_email,
      //     userId: (await storeUser_fetch).id,
      //     order_id: data.order_id,
      //   },
      //   {
      //     headers: {
      //       // Authorization: `bearer ${token}`,
      //       'Content-Type': 'application/json',
      //     },
      //   },
      // );
      // console.log('invoice created: ', invoice_response.data);
      // const invoice_history_response = await axios.post(
      //   apiURL + '/invoice-history/create-invoice-history',
      //   {
      //     invoice_id: invoice_response.data.invoice_created.id,
      //   },
      // );
      // console.log('invoice_history created: ', invoice_history_response.data);
    } else if (
      transactionStatus === 'failure' ||
      transactionStatus === 'cancel' ||
      transactionStatus === 'expire'
    ) {
      console.log(`Payment for order ${data.order_id} failed.`);
      const updateInvoice = await axios.put(
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

      const invoice_history_response = await axios.post(
        apiURL + '/invoice-history/create-invoice-history',
        {
          invoice_id: updateInvoice.data.invoice_updated.id,
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
          invoicesId: updateInvoice.data.invoice_updated.id,
          storeId: updateInvoice.data.invoice_updated.storesId,
          // userId: response_user.id,
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
}
