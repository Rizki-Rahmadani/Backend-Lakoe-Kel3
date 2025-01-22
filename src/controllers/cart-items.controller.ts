import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const createCartItem = async (req: Request, res: Response) => {
  try {
    const { qty, price, cartId, userId, storesId, variantOptionValueId } =
      req.body;
    if (
      !qty ||
      !price ||
      !cartId ||
      !userId ||
      !storesId ||
      !variantOptionValueId
    ) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const checkStore = await prisma.stores.findUnique({
      where: { id: storesId },
    });
    const checkCarts = await prisma.carts.findUnique({
      where: { id: cartId },
    });
    if (!checkStore) {
      return res.status(404).json({ error: "Store doesn't exist" });
    }
    if (!checkCarts) {
      return res.status(404).json({ error: "Cart doesn't exist" });
    }
    const newCartItem = await prisma.cart_items.create({
      data: {
        qty,
        price,
        cartsId: cartId,
        userId,
        storesId,
        variant_option_valuesId: variantOptionValueId,
      },
    });
    res.status(201).json({
      message: 'Cart item created successfully',
      data: newCartItem,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while creating the cart item' });
  }
};

export const getAllCartItems = async (req: Request, res: Response) => {
  try {
    const cartItems = await prisma.cart_items.findMany();
    res.status(200).json({
      message: 'Cart items fetched successfully',
      data: cartItems,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while fetching cart items' });
  }
};

export const getCartItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cartItem = await prisma.cart_items.findUnique({
      where: { id },
      // include: {
      //   Cart: true,
      //   Store: true,
      //   User: true,
      //   Variant_option_values: true,
      // },
    });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.status(200).json({
      message: 'Cart item fetched successfully',
      data: cartItem,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the cart item' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { qty, price, cartId, userId, storesId, variantOptionValueId } =
      req.body;
    const updatedCartItem = await prisma.cart_items.update({
      where: { id },
      data: {
        qty,
        price,
        cartsId: cartId,
        userId,
        storesId,
        variant_option_valuesId: variantOptionValueId,
      },
    });
    res.status(200).json({
      message: 'Cart item updated successfully',
      data: updatedCartItem,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while updating the cart item' });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.cart_items.delete({
      where: { id },
    });
    res.status(200).json({
      message: 'Cart item deleted successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the cart item' });
  }
};
