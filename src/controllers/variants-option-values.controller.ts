import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createVariantOptionsValue = async (
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
                        $ref: "#/components/schemas/CreateVariantOptionValuesDTO"
                    }  
                }
            }
        } 
    */
  try {
    const variantValues = req.body; // Frontend harus mengirim array data kombinasi

    if (!Array.isArray(variantValues) || variantValues.length === 0) {
      return res.status(400).json({ error: 'Data must be a non-empty array' });
    }

    console.log('Received variant values:', variantValues);

    // Validasi: Pastikan semua variant_optionsId ada di database
    const allVariantOptionsIds = variantValues.flatMap(
      (v) => v.variant_optionsId,
    );
    const existingVariantOptions = await prisma.variant_options.findMany({
      where: { id: { in: allVariantOptionsIds } },
    });

    const existingVariantOptionsIds = new Set(
      existingVariantOptions.map((v) => v.id),
    );

    // Cek apakah ada variant_optionsId yang tidak valid
    const invalidIds = allVariantOptionsIds.filter(
      (id) => !existingVariantOptionsIds.has(id),
    );

    if (invalidIds.length > 0) {
      return res
        .status(400)
        .json({ error: 'Invalid variant_optionsId found', invalidIds });
    }

    // Simpan atau update data kombinasi
    const createdVariants = await Promise.all(
      variantValues.map(async (variant) => {
        const { sku, weight, stock, price, is_active, variant_optionsId } =
          variant;

        const existingVariant = await prisma.variant_option_values.findFirst({
          where: {
            sku,
            variant_options: {
              some: {
                variant_option: { id: { in: variant_optionsId } }, // ✅ Perbaikan query
              },
            },
          },
        });

        if (existingVariant) {
          // Update jika SKU sudah ada
          return await prisma.variant_option_values.update({
            where: { id: existingVariant.id },
            data: { weight, stock, price, is_active },
          });
        } else {
          // Buat variant_option_values baru
          const newVariantOptionValue =
            await prisma.variant_option_values.create({
              data: { sku, weight, stock, price, is_active },
            });

          // Buat relasi many-to-many di VariantOptionValueToOptions
          await prisma.variantOptionValueToOptions.createMany({
            data: variant_optionsId.map((optionId: any) => ({
              variant_option_value_id: newVariantOptionValue.id,
              variant_option_id: optionId,
            })),
          });

          return newVariantOptionValue;
        }
      }),
    );

    res.status(201).json({
      message: 'Variant options values created or updated successfully',
      variant_option_values: createdVariants,
    });
  } catch (error) {
    console.error('Error creating variant option values:', error);
    res.status(500).json({ error: 'Internal server error' });
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
