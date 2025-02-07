import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary } from '../controllers/upload.controller';
import { promises } from 'dns';

const prisma = new PrismaClient();

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const {
    name,
    description,
    minimum_order,
    length,
    height,
    width,
    weight,
    categoryIds,
    subcategoryIds,
  } = req.body;
  const userId = (req as any).user.id;
  let imagePaths: string[] = []; // Default to an empty string

  try {
    const checkStore = await prisma.stores.findUnique({
      where: { userId: userId },
      select: { id: true },
    });
    if (!checkStore) {
      res.status(404).json({ message: 'Store not found' });
      return;
    }
    // Upload the file to Cloudinary if it exists
    if (req.files && Array.isArray(req.files)) {
      // Loop through all the files in req.files and upload them to Cloudinary
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(file, 'product');
        imagePaths.push(uploadResult.url); // Store the Cloudinary URL for each uploaded file
      }
    }
    console.log('The image path:', imagePaths);

    // Validate input fields
    if (!name || !imagePaths) {
      res.status(400).json({ message: 'All fields are required' });
      return; // Explicitly terminate the function after sending a response
    }
    // Parse categoryIds if passed as a stringified array
    let categoryIdsArray: string[] = [];
    if (categoryIds) {
      if (typeof categoryIds === 'string') {
        try {
          categoryIdsArray = JSON.parse(categoryIds);
        } catch (error) {
          return res.status(400).json({
            message:
              'Invalid categoryIds format. Ensure it is a valid JSON array string.',
          });
        }
      } else {
        categoryIdsArray = categoryIds;
      }
    }

    // Ensure subcategoryIds is a valid array
    let subcategoryIdsArray: string[] = [];
    if (subcategoryIds) {
      if (typeof subcategoryIds === 'string') {
        try {
          subcategoryIdsArray = JSON.parse(subcategoryIds);
        } catch (error) {
          return res.status(400).json({
            message:
              'Invalid subcategoryIds format. Ensure it is a valid JSON array string.',
          });
        }
      } else {
        subcategoryIdsArray = subcategoryIds;
      }
    }

    // Validate that the categoryIds are valid
    if (categoryIdsArray.length > 0) {
      const categories = await prisma.categories.findMany({
        where: {
          id: { in: categoryIdsArray },
          parentId: null, // Ensure these are top-level categories (no parent)
        },
      });

      if (categories.length !== categoryIdsArray.length) {
        res
          .status(400)
          .json({ message: 'One or more category IDs are invalid' });
        return;
      }
    }

    // Validate that the subcategoryIds are valid and belong to the correct parent category
    if (subcategoryIdsArray.length > 0) {
      const subcategories = await prisma.categories.findMany({
        where: {
          id: { in: subcategoryIdsArray },
          parentId: { not: null }, // Ensure these are subcategories (have a parentId)
        },
      });

      if (subcategories.length !== subcategoryIdsArray.length) {
        res.status(400).json({
          message: 'One or more subcategory IDs are invalid or do not exist',
        });
        return;
      }
    }

    // Prepare data for database insertion
    const data = {
      name,
      store_id: {
        connect: {
          id: checkStore.id, // Connect the product to the store using the store's ID
        },
      },
      description,
      minimum_order,
      weight,
      height,
      length,
      width,
      attachments: imagePaths,
      Categories: {
        connect: [...categoryIdsArray, ...subcategoryIdsArray].map(
          (id: string) => ({ id }),
        ),
      },
    };

    // Create the product in the database
    const newProduct = await prisma.product.create({
      data: data,
      select: {
        id: true,
        name: true,
        attachments: true,
        Categories: true,
      },
    });

    // Send success response
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);

    // Pass errors to the Express error-handling middleware
    next(error);
  }
}

export async function getProductbyStore(req: Request, res: Response) {
  const userId = (req as any).user.id;
  try {
    const checkUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    const getStore = await prisma.stores.findUnique({
      where: { userId: checkUser?.id },
    });
    if (!getStore) {
      return res.status(404).json({ message: 'Store Not Found' });
    }
    const product = await prisma.product.findMany({
      where: { storesId: getStore.id },
    });
    res.status(200).json({
      message: 'successfully fetched products',
      product: product,
    });
  } catch (error) {
    res.status(500).json({ message: 'failed to get all products', error });
  }
}
export async function getProductforName(req: Request, res: Response) {
  const { username } = req.params;
  try {
    const getStore = await prisma.stores.findUnique({
      where: { username: username },
    });
    if (!getStore) {
      return res.status(404).json({ message: 'Store Not Found' });
    }
    const product = await prisma.product.findMany({
      where: { storesId: getStore.id },
    });
    res.status(200).json({
      message: 'successfully fetched products',
      product: product,
    });
  } catch (error) {
    res.status(500).json({ message: 'failed to get all products', error });
  }
}
export async function getAllProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const allProduct = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        attachments: true,
        is_active: true,
        variants: {
          select: {
            id: true,
            name: true,
            Variant_options: {
              select: {
                name: true, // Hanya mengambil nama dari Variant_options
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      message: 'successfully fetched products',
      product: allProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'failed to get all products', error });
  }
}

export async function toggleActive(req: Request, res: Response) {
  const { id } = req.body; // `id` is a string

  try {
    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Toggle the `is_active` field
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { is_active: !product.is_active }, // Flip the value
    });

    return res.status(200).json({
      message: 'Product status toggled successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error during toggle:', error);
    return res.status(500).json({ message: 'Error toggling product', error });
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { id } = req.body;
  try {
    const productExist = await prisma.product.findUnique({
      where: { id: id },
    });

    //   console.log(id)

    if (!productExist) {
      return res.status(404).json({ message: 'product not found' });
    }

    await prisma.product.delete({
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

    return res.status(200).json({ message: 'product deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting product', error });
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.body;
  const { name, description, minimum_order, length, height, width, weight } =
    req.body;
  try {
    let productExist = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!productExist) {
      res.status(404).json({ message: 'product not found' });
    }

    let imagePath: string[] = productExist?.attachments || [];

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file, 'product');
      imagePath = [...imagePath, uploadResult.url];
      // res.status(200).json({message: "success on update"})
    }

    // Update the thread with new content or image
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name: name, // Keep existing content if not updated
        attachments: imagePath, // Update the image if changed
        description: description || productExist?.description,
        length: length || productExist?.length,
        width: width || productExist?.width,
        weight: weight || productExist?.weight,
        minimum_order: parseInt(minimum_order) || productExist?.minimum_order,
      },
    });

    res.status(201).json({
      message: 'successfully updated product information: ',
      updated: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'error update product', error });
  }
}

export async function search(req: Request, res: Response) {
  const { query } = req.query;

  if (typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const allProduct = await prisma.product.findMany({
      where: {
        OR: [{ name: { contains: query, mode: 'insensitive' } }],
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        attachments: true,
        variants: true,
        weight: true,
        length: true,
        width: true,
        height: true,
        minimum_order: true,
      },
    });

    const formattedProduct = allProduct.map((product) => {
      return {
        ...product,
      };
    });

    res.status(200).json({ message: 'product fetched: ', formattedProduct });

    //   res.json(product);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
