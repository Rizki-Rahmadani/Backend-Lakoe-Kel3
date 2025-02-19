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
