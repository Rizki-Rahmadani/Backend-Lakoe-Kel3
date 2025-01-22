import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const createCart = async (req: Request, res: Response) => {
  try {
    const { prices, discount, userId, storesId } = req.body;
    if (!prices || !userId || !storesId) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const checkStore = await prisma.stores.findUnique({
      where: { id: storesId },
    });
    if (!checkStore) {
      return res.status(404).json({ error: "Store doesn't exist" });
    }
    const newCart = await prisma.carts.create({
      data: {
        prices,
        discount,
        userId,
        storesId,
      },
    });
    res.status(201).json({
      message: 'Cart created successfully',
      data: newCart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while creating the cart' });
  }
};

export const getAllCarts = async (req: Request, res: Response) => {
  try {
    const carts = await prisma.carts.findMany();
    res.status(200).json({
      message: 'Carts fetched successfully',
      data: carts,
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching carts' });
  }
};

export const getCartById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cart = await prisma.carts.findUnique({
      where: { id },
      include: {
        Cart_items: true,
        Invoices: true,
      },
    });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.status(200).json({
      message: 'Cart fetched successfully',
      data: cart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the cart' });
  }
};

export const updateCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { prices, discount, userId, storesId } = req.body;
    const findId = await prisma.carts.findUnique({
      where: { id: id },
    });
    if (!findId) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    const updatedCart = await prisma.carts.update({
      where: { id },
      data: {
        prices,
        discount,
        userId,
        storesId,
      },
    });
    res.status(200).json({
      message: 'Cart updated successfully',
      data: updatedCart,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while updating the cart' });
  }
};

export const deleteCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.carts.delete({
      where: { id },
    });
    res.status(200).json({
      message: 'Cart deleted successfully',
      data: null,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the cart' });
  }
};
