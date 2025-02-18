import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary } from '../controllers/upload.controller';
const prisma = new PrismaClient();

export async function createStore(req: Request, res: Response) {
  const { name, username, slogan, description, domain, userId } = req.body;

  if (!name || !userId) {
    res.status(400).json({ message: 'Fields are required' });
  }
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  let logoUrl = '';
  let bannerUrl = '';

  try {
    const findUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!findUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const checkAvail = await prisma.stores.findUnique({
      where: { userId: userId },
    });
    if (checkAvail) {
      return res.status(403).json({ message: 'User already has stores' });
    }
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
      userId,
    };

    const newProduct = await prisma.stores.create({
      data: data,
    });

    return res
      .status(200)
      .json({ message: 'store created', store: newProduct });
  } catch (error) {
    return res.send(500).json({ message: 'error creating store.', error });
  }
}

// export async function getStoreByLogin(req: Request, res: Response) {
//   const userId = (req as any).user.id;

//   try {
//     const findStore = await prisma.user.findUnique({
//       where: { id: userId },
//     });
//     if (!findStore) {
//       return res.status(404).json({ message: 'User' });
//     }
//     return res.status(200).json({ message: 'Store Found', store: findStore });
//   } catch (error) {
//     return res.status(500).json({ message: 'error fetching store', error });
//   }
// }
export async function currentStore(req: Request, res: Response) {
  const userId = (req as any).user.id;
  try {
    const findStore = await prisma.stores.findUnique({
      where: { userId: userId },
    });
    return res.status(200).json({ message: 'Store found', store: findStore });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
export async function getStoreByUsername(req: Request, res: Response) {
  const { username } = req.params;

  try {
    const findStore = await prisma.stores.findUnique({
      where: { username: username },
    });
    if (!findStore) {
      return res.status(404).json({ message: 'Store not found' });
    }
    return res.status(200).json({ message: 'Store Found', store: findStore });
  } catch (error) {
    return res.status(500).json({ message: 'error fetching store', error });
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
        username: true,
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

    res
      .status(200)
      .json({ message: 'store fetched: ', stores: formattedStore });
  } catch (error) {
    res.send(500).json({ message: 'error getting stores.', error });
  }
}

export async function updateStore(req: Request, res: Response) {
  const { name, slogan, description, domain } = req.body;
  const userId = (req as any).user.id;

  try {
    const storeExist = await prisma.stores.findUnique({
      where: { userId: userId },
    });
    if (!storeExist) {
      return res.status(404).json({ message: 'store not found' });
    }
    const findUser = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (storeExist?.userId && findUser?.id != storeExist?.userId) {
      console.log(userId);
      console.log(storeExist.userId);
      console.log(findUser);
      return res.status(401).json({ message: 'Unauthorized' });
    }
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
      where: { userId: userId },
      data: data,
    });
    return res
      .status(200)
      .json({ message: 'updated store: ', store: updatedStore });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'error on updating store: ', error });
  }
}

export async function deleteStore(req: Request, res: Response) {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({ message: 'user id required' });
    }
    const storeExist = await prisma.stores.findUnique({
      where: { id: id },
    });
    const findUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (storeExist?.userId && findUser?.id != storeExist?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
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
