import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export const getDataDashboard = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    console.log('userId', userId);
    // Cek apakah store ada
    const findStore = await prisma.stores.findUnique({
      where: { userId: userId },
    });

    if (!findStore) {
      return res
        .status(404)
        .json({ message: `Data store id:${userId} not found` });
    }

    // Tanggal hari ini (awal & akhir hari)
    const todayStart = startOfDay(new Date()); // 00:00:00
    const todayEnd = endOfDay(new Date()); // 23:59:59

    //data order pada store
    const dataOrders = await prisma.orders.findMany({
      where: { storeId: findStore.id },
    });
    //    if(!dataOrders){
    //     return res.status(404).json({message:"Data order tidak ditemukan"})
    //   }

    // Hitung jumlah orders
    const totalOrders = await prisma.orders.count({
      where: {
        storeId: findStore.id,
        createdAt: {
          gte: todayStart, // Order dibuat setelah atau sama dengan 00:00:00 hari ini
          lte: todayEnd, // Order dibuat sebelum atau sama dengan 23:59:59 hari ini
        },
      },
    });

    console.log('banyak order', totalOrders);
    //   if(totalOrders === 0){
    //     return res.status(200).json({message:"Belum ada order"})
    //   }

    //Data produk
    const dataProduk = await prisma.product.findMany({
      where: { storesId: findStore.id },
      select: {
        id: true, // Include product ID
        name: true,
        attachments: true,
        price: true,
        description: true,
        minimum_order: true, // Include minimum order
        stock: true, // Include stock
        weight: true, // Include weight
        length: true, // Include length
        width: true, // Include width
        height: true, // Include height
        sku: true, // Include SKU
        is_active: true, // Include active status
        Categories: {
          select: {
            name: true, // Ambil hanya nama kategori
          },
        },
        variants: {
          select: {
            id: true,
            name: true,
            Variant_options: {
              select: {
                id: true,
                name: true,
                variant_values: {
                  select: {
                    variant_option_value: {
                      select: {
                        price: true,
                        weight: true,
                        sku: true,
                        stock: true,
                        is_active: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    console.log('banyak produk', dataProduk);
    //   if(!dataProduk){
    //     return res.status(200).json({message:"Belum ada order"})
    //   }

    //hitung jumlah prdouk
    const totalProduk = await prisma.product.count({
      where: { storesId: findStore.id },
    });
    console.log('banyak produk', totalProduk);
    //   if(totalProduk === 0){
    //     return res.status(200).json({message:"Belum ada order"})
    //   }

    const findTransaction = await prisma.transaction.findFirst({
      where: { storeId: findStore.id },
    });
    const totalSales = findTransaction?.amount;

    console.log('jumlah penjualan', totalSales);
    res.status(200).json({
      message: `Berhasil mengambil daata dashboard untuk ID ${findStore.id}`,
      dataOrders,
      totalOrders,
      dataProduk,
      totalProduk,
      findTransaction,
      totalSales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};
