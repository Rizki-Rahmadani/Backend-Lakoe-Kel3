import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary } from '../controllers/upload.controller';
const prisma = new PrismaClient();

export async function createMessage(req: Request, res: Response) {
  const { name, storesId, content } = req.body;
  //   const userId = (req as any).user.fullname;

  if (!content || !name) {
    return res.status(400).json({ message: 'Content is required' });
  }

  try {
    const message_data = await prisma.message_templates.create({
      data: {
        name,
        storesId,
        content,
      },
    });
    res.status(201).json({ message: 'Message sent', message_data });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message to store', error });
  }
}

export async function getMessage(req: Request, res: Response) {
  // const {id} = req.body;

  try {
    const message_data = await prisma.message_templates.findMany({
      select: {
        id: true,
        name: true,
        content: true,
      },
    });
    res.status(201).json({ message: 'Message displayed', message_data });
  } catch (error) {
    res.status(500).json({ message: 'Error displaying message', error });
  }
}

export async function getMessageDetailed(req: Request, res: Response) {
  const { id, productId, userId } = req.body;

  try {
    let message_data = await prisma.message_templates.findUnique({
      where: {
        id: id,
      },
      select: {
        storesId: true,
        content: true,
        name: true,
      },
    });

    const product_name = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        name: true,
      },
    });

    const cust_name = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        fullname: true,
      },
    });

    const store_name = await prisma.stores.findUnique({
      where: {
        id: message_data?.storesId,
      },
      select: {
        name: true,
      },
    });

    if (message_data && message_data.content) {
      if (
        message_data.content.search(/\[product\s*name\]/i) !== -1 &&
        product_name
      ) {
        message_data.content = message_data.content.replace(
          /\[product\s*name\]/gi,
          product_name?.name,
        );
      }
      if (
        message_data.content.search(/\[costumer\s*name\]/i) !== -1 &&
        cust_name
      ) {
        message_data.content = message_data.content.replace(
          /\[costumer\s*name\]/gi,
          cust_name?.fullname,
        );
      }
      if (
        message_data.content.search(/\[shop\s*name\]/i) !== -1 &&
        store_name
      ) {
        message_data.content = message_data.content.replace(
          /\[shop\s*name\]/gi,
          store_name?.name,
        );
      }
    }

    res.status(200).json({ message: 'success', message_data });
  } catch (error) {
    res.status(500).json({ message: 'error getting message template', error });
  }
}

export async function editMessage(req: Request, res: Response) {
  const { id, name, content } = req.body;

  try {
    const messageExist = await prisma.message_templates.findUnique({
      where: { id: id },
    });
    const edit_data = await prisma.message_templates.update({
      where: {
        id: id,
      },
      data: {
        name: name || messageExist?.name,
        content: content || messageExist?.content,
      },
    });

    res.status(201).json({ message: 'success on edit', edit_data });
  } catch (error) {
    res.status(500).json({ message: 'Error on editing message.', error });
  }
}

export async function deleteMessage(req: Request, res: Response) {
  const { id } = req.body;

  try {
    const messageExist = await prisma.message_templates.findUnique({
      where: { id: id },
    });
    if (!messageExist) {
      res.status(404).json({ message: 'message not found' });
    }

    await prisma.message_templates.delete({
      where: { id: id },
    });

    res.status(200).json({ message: 'message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'error on delete.', error });
  }
}
