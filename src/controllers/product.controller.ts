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
  } = req.body;
  const userId = (req as any).user.id;
  let imagePaths: string[] = []; // Default to an empty string
  let customUrl: string = '';
  try {
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

    // Convert string inputs to numbers
    const parsedMinimumOrder = minimum_order ? parseInt(minimum_order) : null;
    const parsedPrice = price ? parseFloat(price) : null;
    const parsedStock = stock ? parseInt(stock) : null;
    const parsedLength = length ? parseFloat(length) : null;
    const parsedHeight = height ? parseFloat(height) : null;
    const parsedWidth = width ? parseFloat(width) : null;
    const parsedWeight = weight ? parseFloat(weight) : null;

    // Prepare data for database insertion
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
      data: { is_active: !product.is_active },
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

/**
 * Fungsi untuk mendapatkan semua kombinasi dari opsi varian
 */
const getCombinations = (arrays: any[][]): any[][] => {
  if (arrays.length === 0) return [[]];

  const firstArray = arrays[0];
  const remainingCombinations = getCombinations(arrays.slice(1));

  return firstArray.flatMap((value) =>
    remainingCombinations.map((combination) => [value, ...combination]),
  );
};

/**
 * Endpoint untuk mengambil produk, variant options, dan variant option values
 */
// export const getProductWithVariants = async (req: Request, res: Response) => {
//   try {
//     const { productId } = req.params;

//     const userId = (req as any).user.id;

//     if (!userId) {
//       return res.status(401).json({ message: 'Unauthorized: No token provided' });
//     }

//     // Query data produk beserta variant options dan variant option values
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//       select: {
//         name: true,
//         description: true,
//         attachments: true,
//         variants: {
//           select: {
//             id: true, // Ambil ID dari variant
//             name: true,
//             Variant_options: {
//               select: {
//                 id: true, // Ambil ID dari Variant_options
//                 name: true,
//                 variant_values: {
//                   select: {
//                     variant_option_value: {
//                       select: {
//                         id: true, // Ambil ID dari variant_option_value
//                         sku: true,
//                         price: true,
//                         stock: true,
//                         weight: true,
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Menggabungkan atribut variant_option_value berdasarkan kombinasi yang valid
//     const combinedVariants = product.variants.map(variant => {
//       return {
//         ...variant,
//         Variant_options: variant.Variant_options.map(option => {
//           // Ambil variant_values yang sesuai dengan option
//           const filteredValues = option.variant_values.map(value => value.variant_option_value);

//           return {
//             ...option,
//             variant_values: filteredValues
//           };
//         })
//       };
//     });

//     return res.json({ ...product, variants: combinedVariants });
//   } catch (error) {
//     console.error("Error fetching product data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const getProductWithVariants = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    // Cek apakah produk tersedia
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variants: {
          include: {
            Variant_options: {
              include: {
                variant_values: {
                  include: {
                    variant_option_value: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ambil semua kombinasi varian berdasarkan variant_option_values
    const variantCombinations = await prisma.variant_option_values.findMany({
      where: {
        variant_options: {
          some: {
            variant_option: {
              variantsId: {
                in: product.variants.map((v) => v.id),
              },
            },
          },
        },
      },
      include: {
        variant_options: {
          include: {
            variant_option: true,
          },
        },
      },
    });

    // Format response agar mudah digunakan di frontend
    const formattedCombinations = variantCombinations.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      weight: variant.weight,
      is_active: variant.is_active,
      options: variant.variant_options.map((option) => ({
        id: option.variant_option.id,
        name: option.variant_option.name,
      })),
    }));

    res.status(200).json({
      message: 'Variant combinations retrieved successfully',
      attachments: product.attachments,
      variant_combinations: formattedCombinations,
    });
  } catch (error) {
    console.error('Error fetching variant combinations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// export const checkoutProduct = async (req: Request, res: Response) => {
//   try {
//     const { productId } = req.params;
//     const { selectedOptions } = req.body;

//     // Fetch product details
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//       select: {
//         name: true,
//         attachments: true,
//         variants: {
//           select: {
//             id: true,
//             name: true,
//             Variant_options: {
//               select: {
//                 id: true,
//                 name: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Fetch variant price if selected options are provided
//     let price = null;
//     if (selectedOptions && selectedOptions.length > 0) {
//       const variantCombination = await prisma.variant_option_values.findFirst({
//         where: {
//           variant_options: {
//             every: {
//               variant_option_id: { in: selectedOptions },
//             },
//           },
//         },
//         select: {
//           price: true,
//         },
//       });

//       if (variantCombination) {
//         price = variantCombination.price;
//       }
//     }

//     res.status(200).json({ ...product, price });
//   } catch (error) {
//     console.error('Failed to fetch product for checkout:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

export const getProductForCheckout = async (req: Request, res: Response) => {
  try {
    const { url, username } = req.params;
    const { selectedOptions } = req.body;

    // Fetch store details
    const store = await prisma.stores.findUnique({
      where: { username: username },
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Fetch product details by URL and store ID
    const product = await prisma.product.findUnique({
      where: { url: url, storesId: store.id },
      select: {
        id: true, // Include product ID
        name: true,
        attachments: true,
        price: true,
        description: true,
        minimum_order: true, // Include minimum order
        stock: true, // Include stock
        weight: true, // Include weight
        length: true, // Include length
        width: true, // Include width
        height: true, // Include height
        sku: true, // Include SKU
        is_active: true, // Include active status
        variants: {
          select: {
            id: true,
            name: true,
            Variant_options: {
              select: {
                id: true,
                name: true,
                variant_values: {
                  select: {
                    variant_option_value: {
                      select: {
                        price: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const prices = product.variants.flatMap((variant) =>
      variant.Variant_options.flatMap((option) =>
        option.variant_values.map((val) => val.variant_option_value.price),
      ),
    );
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    let price = product.price; // Default to product price

    // Check if the product has variants
    if (product.variants && product.variants.length > 0) {
      // If there are selected options, find the price based on the selected variant
      if (selectedOptions && selectedOptions.length > 0) {
        const variantCombination = await prisma.variant_option_values.findFirst(
          {
            where: {
              variant_options: {
                every: {
                  variant_option_id: { in: selectedOptions },
                },
              },
            },
            select: {
              price: true,
            },
          },
        );

        if (variantCombination) {
          price = variantCombination.price; // Update price if variant combination is found
        }
      }
    }

    res.status(200).json({
      ...product,
      price,
      priceRange: { min: minPrice, max: maxPrice },
    });
  } catch (error) {
    console.error('Failed to fetch product for checkout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
