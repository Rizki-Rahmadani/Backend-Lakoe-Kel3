import axios from 'axios';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

export const trackingStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const apiBiteship = `https://api.biteship.com/v1/trackings/${id}`;

    console.log('api biteship', process.env.API_BITESHIP_TEST);
    const response = await axios.get(apiBiteship, {
      headers: {
        Authorization: `Bearer ${process.env.API_BITESHIP_TEST}`,
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;
    console.log(data);
    res.status(201).json({
      message: 'Order created successfully!',
      biteShip: data,
    });
  } catch (error) {
    console.error('Error in createLocationBiteship:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
