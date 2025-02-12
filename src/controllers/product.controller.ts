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
    url,
    minimum_order,
    price,
    stock,
    sku,
    length,
    height,
    width,
    weight,
    categoryIds,
    subcategoryIds,
    variants, // This is the new field for variants
  } = req.body;
  const userId = (req as any).user.id;
  let imagePaths: string[] = []; // Default to an empty string
  let customUrl: string = '';
  
  try {
    // Check store existence
    const checkStore = await prisma.stores.findUnique({
      where: { userId: userId },
      select: { id: true, username: true },
    });
    if (!checkStore) {
      res.status(404).json({ message: 'Store not found' });
      return;
    }

    const checkUrl = await prisma.product.findUnique({
      where: { url: url },
    });
    if (checkUrl) {
      const randInt = Math.floor(1000 + Math.random() * 9000);
      customUrl = `${url}-${randInt}`;
    } else {
      customUrl = url;
    }
    
    // Upload the file to Cloudinary if it exists

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const uploadResult = await uploadToCloudinary(file, 'product');
        imagePaths.push(uploadResult.url);
      }
    }

    // Validate required fields
    if (!name || !imagePaths) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Parse categoryIds and subcategoryIds as JSON if needed
    let categoryIdsArray: string[] = [];
    if (categoryIds) {
      if (typeof categoryIds === 'string') {
        try {
          categoryIdsArray = JSON.parse(categoryIds);
        } catch (error) {
          return res.status(400).json({
            message: 'Invalid categoryIds format.',
          });
        }
      } else {
        categoryIdsArray = categoryIds;
      }
    }

    let subcategoryIdsArray: string[] = [];
    if (subcategoryIds) {
      if (typeof subcategoryIds === 'string') {
        try {
          subcategoryIdsArray = JSON.parse(subcategoryIds);
        } catch (error) {
          return res.status(400).json({
            message: 'Invalid subcategoryIds format.',
          });
        }
      } else {
        subcategoryIdsArray = subcategoryIds;
      }
    }

    // Validate categories and subcategories
    if (categoryIdsArray.length > 0) {
      const categories = await prisma.categories.findMany({
        where: {
          id: { in: categoryIdsArray },
          parentId: null,
        },
      });
      if (categories.length !== categoryIdsArray.length) {
        res.status(400).json({ message: 'Invalid category IDs' });
        return;
      }
    }

    if (subcategoryIdsArray.length > 0) {
      const subcategories = await prisma.categories.findMany({
        where: {
          id: { in: subcategoryIdsArray },
          parentId: { not: null },
        },
      });
      if (subcategories.length !== subcategoryIdsArray.length) {
        res.status(400).json({
          message:
            'Invalid subcategory IDs or mismatched parent-child relation',
        });
        return;
      }
    }

    // Validate and parse the variants if provided
    let parsedVariants = [];
    if (variants) {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (error) {
        return res.status(400).json({
          message: 'Invalid variants format.',
        });
      }
    }

    // Convert to numbers for numerical fields
    const parsedMinimumOrder = minimum_order ? parseInt(minimum_order) : null;
    const parsedPrice = price ? parseFloat(price) : null;
    const parsedStock = stock ? parseInt(stock) : null;
    const parsedLength = length ? parseFloat(length) : null;
    const parsedHeight = height ? parseFloat(height) : null;
    const parsedWidth = width ? parseFloat(width) : null;
    const parsedWeight = weight ? parseFloat(weight) : null;

    // Prepare data for product insertion
    const data = {
      name,
      store_id: {
        connect: {
          id: checkStore.id,
        },
      },
      description,
      url: customUrl,
      minimum_order: parsedMinimumOrder,
      price: parsedPrice,
      stock: parsedStock,
      sku,
      weight: parsedWeight,
      height: parsedHeight,
      length: parsedLength,
      width: parsedWidth,
      attachments: imagePaths,
      Categories: {
        connect: [...categoryIdsArray, ...subcategoryIdsArray].map(
          (id: string) => ({ id }),
        ),
      },
    };

    // Create product
    const newProduct = await prisma.product.create({
      data: data,
      select: {
        id: true,
        name: true,
        attachments: true,
        Categories: true,
      },
    });

    // Handle variants if provided
    if (parsedVariants.length > 0) {
      for (const variant of parsedVariants) {
        const createdVariant = await prisma.variants.create({
          data: {
            name: variant.name,
            productId: newProduct.id,
          },
        });

        for (const option of variant.options) {
          const createdOption = await prisma.variant_options.create({
            data: {
              name: option.name,
              variantsId: createdVariant.id,
            },
          });

          await prisma.variant_option_values.create({
            data: {
              sku: option.sku || sku,
              price: option.price || price,
              stock: option.stock || stock,
              weight: option.weight || weight,
              length: option.length || length,
              height: option.height || height,
              width: option.width || width,
              variant_optionsId: createdOption.id,
            },
          });
        }
      }
    }

    // Send response
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
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
      include: {
        variants: {
          include: {
            Variant_options: {
              include: {
                variant_values: {
                  include: {
                    variant_option_value: true,
                  },
                }, // Include variant option values (e.g., price, stock, etc.)
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
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
export async function getProductByUrl(req: Request, res: Response) {
  const { url, username } = req.params;
  try {
    const findStore = await prisma.stores.findUnique({
      where: { username: username },
    });
    if (!findStore) {
      return res.status(404).json({ message: 'Store not found' });
    }
    const findProduct = await prisma.product.findUnique({
      where: { url: url, storesId: findStore.id },
    });
    if (!findProduct) {
      return res.status(404).json({ message: 'Product Not Available' });
    }
    return res
      .status(200)
      .json({ message: 'Product fetched succesfully', product: findProduct });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server error' });
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
      orderBy: {
        createdAt: 'desc', // Mengurutkan berdasarkan createdAt dalam urutan menurun
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
  console.log('Deleting product with ID:', id); // Log ID produk yang akan dihapus

  try {
    // **1. Cari semua Variants yang terkait dengan Product**
    const variantIds = await prisma.variants
      .findMany({
        where: { productId: id },
        select: { id: true },
      })
      .then((variants) => variants.map((v) => v.id));

    console.log('Variant IDs to delete:', variantIds); // Log ID varian yang ditemukan

    if (variantIds.length > 0) {
      // **2. Cari semua Variant_option_values yang terkait**
      const variantOptionValueIds = await prisma.variant_option_values
        .findMany({
          where: {
            variant_options: {
              some: {
                variant_option: {
                  variantsId: { in: variantIds },
                },
              },
            },
          },
          select: { id: true },
        })
        .then((values) => values.map((v) => v.id));

      console.log('Variant Option Value IDs to delete:', variantOptionValueIds);

      // **3. Hapus semua VariantOptionValueToOptions terkait**
      if (variantOptionValueIds.length > 0) {
        await prisma.variantOptionValueToOptions.deleteMany({
          where: {
            OR: [
              { variant_option_value_id: { in: variantOptionValueIds } },
              { variant_option_id: { in: variantIds } },
            ],
          },
        });
        console.log('Deleted related VariantOptionValueToOptions');
      }

      // **4. Hapus semua Variant_option_values**
      await prisma.variant_option_values.deleteMany({
        where: { id: { in: variantOptionValueIds } },
      });
      console.log('Deleted related Variant_option_values');

      // **5. Hapus semua Variant_options**
      await prisma.variant_options.deleteMany({
        where: { variantsId: { in: variantIds } },
      });
      console.log('Deleted related Variant_options');

      // **6. Hapus semua Variants**
      await prisma.variants.deleteMany({
        where: { productId: id },
      });
      console.log('Deleted related Variants');
    }

    // **7. Hapus produk utama**
    await prisma.product.delete({
      where: { id },
    });
    console.log('Deleted Product successfully');

    return res
      .status(200)
      .json({ message: 'Product and related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
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
