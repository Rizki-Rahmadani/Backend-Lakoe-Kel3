import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary } from '../controllers/upload.controller';
import { promises } from 'dns';

const prisma = new PrismaClient();

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { name, storesId, description } = req.body;
  let imagePath = ''; // Default to an empty string

  try {
    // Upload the file to Cloudinary if it exists
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file, 'product');
      imagePath = uploadResult.url; // Use the secure URL from Cloudinary
    }
    console.log('The image path:', imagePath);

    // Validate input fields
    if (!name || !imagePath) {
      res.status(400).json({ message: 'All fields are required' });
      return; // Explicitly terminate the function after sending a response
    }

    // Prepare data for database insertion
    const data = {
      name,
      storesId: storesId, // Ensure storesId is a number if required by your schema
      description,
      attachments: imagePath, // Save the uploaded image URL
    };

    // Create the product in the database
    const newProduct = await prisma.product.create({
      data: data,
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

export async function getAllProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const allProduct = prisma.product.findMany({
      // where: {
      //   is_active: false
      // },
      select: {
        id: true,
        name: true,
        description: true,
        attachments: true,
      },
    });

    const formattedProducts = (await allProduct).map((product) => {
      return {
        ...product,
      };
    });
    res.status(200).json({
      message: 'successfully fetch products',
      product: formattedProducts,
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
  const { name, description, size, minimum_order } = req.body;
  try {
    let productExist = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!productExist) {
      res.status(404).json({ message: 'product not found' });
    }

    let imagePath = productExist?.attachments;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file, 'product');
      imagePath = uploadResult.url;
      // res.status(200).json({message: "success on update"})
    }

    // Update the thread with new content or image
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name: name, // Keep existing content if not updated
        attachments: imagePath, // Update the image if changed
        description: description || productExist?.description,
        size: size || productExist?.size,
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
        size: true,
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
