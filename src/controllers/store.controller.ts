import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary } from '../controllers/upload.controller';
const prisma = new PrismaClient();

export async function createStore(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { name, username, slogan, description, domain } = req.body;

  if (!name) {
    res.status(400).json({ message: 'store must contain a name.' });
  }
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let logoUrl = '';
  let bannerUrl = '';

  try {
    if (files) {
      if (files.logo_attachment) {
        const uploadResult = await uploadToCloudinary(
          files.logo_attachment[0],
          'store',
        );
        logoUrl = uploadResult.url; // Use the secure URL from Cloudinary
      }
      if (files.banner_attachment) {
        const uploadResult = await uploadToCloudinary(
          files.banner_attachment[0],
          'store',
        );
        bannerUrl = uploadResult.url; // Use the secure URL from Cloudinary
      }
    }

    const data = {
      name,
      username,
      slogan,
      description,
      domain,
      logo_attachment: logoUrl,
      banner_attachment: bannerUrl,
    };

    const newProduct = await prisma.stores.create({
      data: data,
    });

    res.status(200).json({ message: 'store created', store: newProduct });
  } catch (error) {
    res.send(500).json({ message: 'error creating store.', error });
  }
}

export async function getAllStore(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const allStore = prisma.stores.findMany({
      select: {
        name: true,
        slogan: true,
        description: true,
        domain: true,
        banner_attachment: true,
        logo_attachment: true,
      },
    });

    const formattedStore = (await allStore).map((store) => {
      return {
        ...store,
      };
    });

    res.status(200).json({ message: 'store fetched: ', formattedStore });
  } catch (error) {
    res.send(500).json({ message: 'error getting stores.', error });
  }
}

export async function updateStore(req: Request, res: Response): Promise<void> {
  const { name, slogan, description, domain } = req.body;
  const id = 'cm67kbwty0000tans24i0bo4a';
  try {
    let storeExist = await prisma.stores.findUnique({
      where: { id: id },
    });
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let logoUrl = storeExist?.logo_attachment;
    let bannerUrl = storeExist?.banner_attachment;
    if (files) {
      if (files.logo_attachment) {
        const uploadResult = await uploadToCloudinary(
          files.logo_attachment[0],
          'store',
        );
        logoUrl = uploadResult.url; // Use the secure URL from Cloudinary
      }
      if (files.banner_attachment) {
        const uploadResult = await uploadToCloudinary(
          files.banner_attachment[0],
          'store',
        );
        bannerUrl = uploadResult.url; // Use the secure URL from Cloudinary
      }
    }

    const data = {
      name: name || storeExist?.name,
      slogan: slogan || storeExist?.slogan,
      description: description || storeExist?.description,
      domain: domain || storeExist?.domain,
      logo_attachment: logoUrl || storeExist?.logo_attachment,
      banner_attachment: bannerUrl || storeExist?.banner_attachment,
    };

    let updatedStore = await prisma.stores.update({
      where: { id: id },
      data: data,
    });
    res.status(200).json({ message: 'updated store: ', store: updatedStore });
  } catch (error) {
    res.status(500).json({ message: 'error on updating store: ', error });
  }
}

export async function deleteStore(req: Request, res: Response) {
  const id = 'cm67kbwty0000tans24i0bo4a';
  try {
    const storeExist = await prisma.stores.findUnique({
      where: { id: id },
    });

    //   console.log(id)

    if (!storeExist) {
      return res.status(404).json({ message: 'store not found' });
    }

    await prisma.stores.delete({
      where: {
        id: id,
      },
    });

    //authorized user function
    //   if (productExist?.storesId !== (req as any).user.id) {
    //     return res
    //       .status(401)
    //       .json({ message: 'User not granted to delete this thread' });
    //   }

    return res.status(200).json({ message: 'store deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting store', error });
  }
}
