import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();

export const getCourier = async (req: Request, res: Response) => {
  console.log('api Biteship', process.env.API_BITESHIP_TEST);
  const apiBiteship = `https://api.biteship.com/v1/couriers`;
  const response = await axios.get(apiBiteship, {
    headers: {
      Authorization: `Bearer ${process.env.API_BITESHIP_TEST}`,
    },
  });

  const data = response.data;
  console.log(data);
  res.status(201).json({
    message: 'Order created successfully!',
    biteShip: data,
  });
};

export const getCourierRates = async (req: Request, res: Response) => {
  const { url, username } = req.params;
  const { quantity, origin_area_id, destination_area_id } = req.body;
  try {
    const findStore = await prisma.stores.findUnique({
      where: { username: username },
    });
    if (!findStore) {
      return res.status(404).json({ message: 'Store not found' });
    }
    const findProduct = await prisma.product.findUnique({
      where: { url: url, storesId: findStore.id },
    });
    if (!findProduct) {
      return res.status(404).json({ message: 'Product Not Available' });
    }

    console.log('api Biteship', process.env.API_BITESHIP_TEST);
    const apiBiteship = `https://api.biteship.com/v1/rates/couriers`;
    const response = await axios.post(apiBiteship, {
      headers: {
        Authorization: `Bearer ${process.env.API_BITESHIP_TEST}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin_area_id: origin_area_id,
        destination_area_id: destination_area_id,
        // origin_area_id: 'biteship_origin_area_id',
        // destination_area_id: 'biteship_destination_area_id',
        couriers: 'paxel,jne,sicepat,anteraja,jnt,tiki,ninja,pos',
        items: [
          {
            name: findProduct.name,
            description: findProduct.description,
            value: findProduct.price ? findProduct.price * quantity : 0,
            length: findProduct?.length ? findProduct.length * quantity : 0,
            width: findProduct?.width ? findProduct.width * quantity : 0,
            height: findProduct?.height ? findProduct.height * quantity : 0,
            weight: findProduct?.weight ? findProduct.weight * quantity : 0,
            quantity: quantity,
          },
        ],
      }),
    });

    const data = response.data;
    console.log(data);
    res.status(201).json({
      message: 'Order created successfully!',
      biteShip: data,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server error' });
  }
};
