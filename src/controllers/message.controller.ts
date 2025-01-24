import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary } from '../controllers/upload.controller';
const prisma = new PrismaClient();

export async function createMessage(req: Request, res: Response) {
  const { name, storesId, content } = req.body;
  const userId = (req as any).user.fullname;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  let imagefile = '';

  try {
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file, 'store');
      imagefile = uploadResult.url; // Use the secure URL from Cloudinary
    }
    const message_data = await prisma.message_templates.create({
      data: {
        name: userId,
        storesId,
        // userId: userId,
        content,
        messageImage: imagefile || '',
      },
    });
    res.status(201).json({ message: 'Message sent', message_data });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message to store', error });
  }
}

export async function deleteMessage(req: Request, res: Response) {}
