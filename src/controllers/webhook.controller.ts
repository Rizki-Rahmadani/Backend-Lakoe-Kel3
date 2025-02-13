import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
const prisma = new PrismaClient();

export async function webhookTracking(req: Request, res: Response) {
    const event = req.body;
    console.log('Webhook Biteship diterima:', event);

    // Cek apakah ada perubahan status pada order tertentu
    if (event.order_id && event.status) {
        console.log(`Order ID: ${event.order_id}`);
        console.log(`Status Order: ${event.status}`);

        // Map status dari Biteship ke status yang diinginkan
        let statusOrder = event.status;
        switch (event.status) {
            case "allocated":
                statusOrder = "siap dikirim";
                break;
            case "droppingOff":
                statusOrder = "dalam pengiriman";
                break;
            case "delivered":
                statusOrder = "pesanan selesai";
                break;
            case "cancelled":
                statusOrder = "dibatalkan";
                break;
            default:
                statusOrder = event.status; // Jika tidak ada yang cocok, gunakan status asli
        }

        console.log(`Status Order setelah diubah: ${statusOrder}`);

        // Lakukan update ke database sesuai order_id
        try {
            // await prisma.orders.update({
            //     where: { order_id: event.order_id },
            //     data: { status: statusOrder },
            // });

            console.log(`Status order ${event.order_id} berhasil diperbarui menjadi ${statusOrder}`);
        } catch (error) {
            console.error('Gagal memperbarui status order:', error);
        }
    }

    // Biteship mengharapkan response 200 untuk menandakan webhook berhasil diproses
    res.status(200).send('Webhook received');
}
