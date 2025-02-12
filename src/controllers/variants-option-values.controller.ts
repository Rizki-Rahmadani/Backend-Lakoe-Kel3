import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// export const createVariantOptionsValue = async (req: Request, res: Response) => {
//   try {
//     const { sku, weight, stock, price, is_active, variant_options } = req.body;

//     if (!sku || !weight || !stock || !price || !variant_options || variant_options.length === 0) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Ambil semua variant options dari database berdasarkan ID yang dikirim
//     const variantOptions = await prisma.variant_options.findMany({
//       where: {
//         id: {
//           in: variant_options, // variant_options adalah array dari ID
//         },
//       },
//     });

//     // Validasi: Pastikan semua ID yang diberikan ada di database
//     if (variantOptions.length !== variant_options.length) {
//       const invalidIds = variant_options.filter((id: string) => !variantOptions.some(option => option.id === id));
//       return res.status(404).json({ error: "Some variant options don't exist", invalidIds });
//     }

//     let createdVariants;

//     // Jika hanya ada satu variant, simpan langsung
//     if (variantOptions.length === 1) {
//       const option = variantOptions[0];
//       createdVariants = await prisma.variant_option_values.create({
//         data: {
//           sku,
//           weight,
//           stock,
//           price,
//           is_active,
//           variant_optionsId: option.id, // Simpan ID dari variant option
//         },
//       });
//     } else {
//       // Jika ada lebih dari satu variant, buat kombinasi dari semua ID
//       const generateCombinations = (arrays: string[][], index = 0, result: string[] = [], current = '') => {
//         if (index === arrays.length) {
//           result.push(current.slice(1)); // Hapus karakter pertama "-"
//           return;
//         }
//         for (let i = 0; i < arrays[index].length; i++) {
//           generateCombinations(arrays, index + 1, result, current + '-' + arrays[index][i]);
//         }
//         return result;
//       };

//       // Ambil semua ID dari variant options
//       const optionIds = variantOptions.map(option => [option.id]);
//       // Buat semua kemungkinan kombinasi ID
//       const variantCombinations: string[] = generateCombinations(optionIds) || [];

//       // Simpan ke database dengan ID yang sudah dikombinasikan
//       createdVariants = await Promise.all(
//         variantCombinations.map(async (combination: string) => {
//           return await prisma.variant_option_values.create({
//             data: {
//               sku,
//               weight,
//               stock,
//               price,
//               is_active,
//               variant_optionsId: combination.split('-').join('-'), // Gabungkan ID dengan "-"
//             },
//           });
//         })
//       );
//     }

//     res.status(201).json({
//       message: 'Variant options values created successfully',
//       variant_option_values: createdVariants,
//     });
//   } catch (error) {
//     console.error('Error creating variant options values:', error);
//     res.status(500).json({ error: 'An error occurred while creating the variant options values' });
//   }
// };

export const createVariantOptionsValue = async (
  req: Request,
  res: Response,
) => {
  try {
    const { sku, weight, stock, price, is_active, variant_options } = req.body;
    console.log('Request body:', req.body);

    if (!sku || !weight || !stock || !price || !variant_options) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Validasi dan ambil semua variant options
    const variantOptions = await prisma.variant_options.findMany({
      where: {
        id: {
          in: variant_options, // variant_options adalah array dari ID
        },
      },
    });

    if (variantOptions.length !== variant_options.length) {
      return res
        .status(404)
        .json({ error: "Some variant options don't exist" });
    }

    // Kombinasikan semua opsi varian
    const combinations = variantOptions.map((option) => ({
      sku,
      weight,
      stock,
      price,
      is_active,
      variant_optionsId: option.id,
    }));

    // Simpan atau perbarui semua kombinasi ke dalam database
    const createdVariants = await Promise.all(
      combinations.map(async (combination) => {
        const existingVariant = await prisma.variant_option_values.findFirst({
          where: {
            sku: combination.sku,
            variant_optionsId: combination.variant_optionsId,
          },
        });

        if (existingVariant) {
          // Update jika sudah ada
          return await prisma.variant_option_values.update({
            where: { id: existingVariant.id },
            data: {
              weight: combination.weight,
              stock: combination.stock,
              price: combination.price,
              is_active: combination.is_active,
            },
          });
        } else {
          // Create jika belum ada
          return await prisma.variant_option_values.create({
            data: {
              sku: combination.sku,
              weight: combination.weight,
              stock: combination.stock,
              price: combination.price,
              is_active: combination.is_active,
              variant_optionsId: combination.variant_optionsId,
            },
          });
        }
      }),
    );

    res.status(201).json({
      message: 'Variant options values created or updated successfully',
      variant_option_values: createdVariants,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        error: 'An error occurred while creating the variant options values',
      });
  }
};

export async function getVariantOptionsValueById(req: Request, res: Response) {
  /*  
        #swagger.tags = ['Variant-Option-Values']
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ShowVariantOptionValuesbyIdDTO"
                    }  
                }
            }
        } 
    */
  const { id } = req.params;

  try {
    const variant = await prisma.variant_option_values.findUnique({
      where: { id },
    });

    if (!variant) {
      return res.status(404).json({ error: 'Variant options not found' });
    }

    return res
      .status(200)
      .json({ messages: 'Success Get Variant', variant_options: variant });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching variant' });
  }
}
export async function getAllVariantOptionsValue(req: Request, res: Response) {
  /*  
        #swagger.tags = ['Variant-Option-Values']
        #swagger.description = "to display all variant"
    */
  try {
    const variants = await prisma.variant_option_values.findMany();

    if (variants.length === 0) {
      return res.status(404).json({ error: 'No variants found' });
    }

    return res
      .status(200)
      .json({ messages: 'Success Get variant', variant_options: variants });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching variants' });
  }
}
export const updateVariantOptionsValue = async (
  req: Request,
  res: Response,
) => {
  /*  
        #swagger.tags = ['Variant-Option-Values']
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/UpdateVariantOptionValuesDTO"
                    }  
                }
            }
        } 
    */
  try {
    const { id } = req.params;
    const { sku, weight, stock, price, is_active } = req.body;
    const findId = await prisma.variants.findUnique({
      where: { id: id },
    });
    if (!findId) {
      return res.status(404).json({ error: 'variant not found' });
    }
    const updatedvariant = await prisma.variant_option_values.update({
      where: { id },
      data: {
        sku,
        weight,
        stock,
        price,
        is_active,
      },
    });
    res.status(200).json({
      message: 'variant updated successfully',
      variant: updatedvariant,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while updating the variant' });
  }
};

export const deleteVariantOptionsValue = async (
  req: Request,
  res: Response,
) => {
  /*  
        #swagger.tags = ['Variant-Option-Values']
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/DeleteVariantOptionsDTO"
                    }  
                }
            }
        } 
    */
  try {
    const { id } = req.params;
    await prisma.variant_option_values.delete({
      where: { id },
    });
    res.status(200).json({
      message: 'variant deleted successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the variant' });
  }
};
