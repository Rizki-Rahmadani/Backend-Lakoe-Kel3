import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
const prisma = new PrismaClient();

export async function getUser(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const userExist = prisma.user.findMany({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone_number: true,
        fullname: true,
      },
    });
    const formattedUser = (await userExist).map((user) => {
      return {
        ...user,
      };
    });

    res.status(200).json({ message: 'user found', user: formattedUser });
  } catch (error) {
    res.status(500).json({ message: 'user not found', error });
  }
}

export async function getUserByStore(req: Request, res: Response) {
  try {
    const { storeId } = req.body; // Ensure correct destructuring

    // Find store by ID
    const storeExist = await prisma.stores.findUnique({
      where: { id: storeId },
    });

    if (!storeExist) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Get user ID from store
    const userId = storeExist.userId;

    // Find user by ID (await is necessary)
    const userExist = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone_number: true,
        fullname: true,
      },
    });

    if (!userExist) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User found', user: userExist });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error });
  }
}
