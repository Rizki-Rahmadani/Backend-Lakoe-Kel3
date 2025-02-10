import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { error } from 'console';

const prisma = new PrismaClient();

export const createVariantOptions = async (req: Request, res: Response) => {
  /*  
        #swagger.tags = ['Variant-Options']
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/CreateVariantOptionsDTO"
                    }  
                }
            }
        } 
    */
  try {
    const { name, variantId, productId } = req.body;

    if (!name || !variantId || !productId) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Check if the product exists
    const checkProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { variants: true },
    });

    if (!checkProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the variant exists
    const checkVariant = await prisma.variants.findUnique({
      where: { id: variantId },
    });

    if (!checkVariant) {
      return res.status(404).json({ error: "Variant doesn't exist" });
    }

    // Fetch all variant options for the variant
    const variantOptions = await prisma.variant_options.findMany({
      where: { variantsId: variantId },
    });

    if (variantOptions.length === 0) {
      return res
        .status(404)
        .json({ error: 'No variant options found for this variant' });
    }

    // Create the new sub-variant and link it to all available variant options without variant_option_values
    const subVariantPromises = variantOptions.map(async (option) => {
      return prisma.variant_options.create({
        data: {
          name, // The sub-variant name (e.g., 7kg)
          variantsId: variantId,
          parentVariantOptionId: option.id, // Link the sub-variant to the parent variant option
          // No variant_option_values are created here
        },
      });
    });

    // Wait for all sub-variants to be created
    const newSubVariants = await Promise.all(subVariantPromises);

    res.status(201).json({
      message:
        'Sub-variant created successfully for all variant options without option values',
      variant_options: newSubVariants,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        'An error occurred while creating sub-variants for variant options',
    });
  }
};

export async function getVariantOptionsById(req: Request, res: Response) {
  /*  
        #swagger.tags = ['Variant-Options']
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ShowVariantOptionsbyIdDTO"
                    }  
                }
            }
        } 
    */
  const { id } = req.params;

  try {
    const variant = await prisma.variant_options.findUnique({
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
export async function getAllVariantOptions(req: Request, res: Response) {
  /*  
        #swagger.tags = ['Variant-Options']
        #swagger.description = "to display all variant"
    */
  try {
    const variants = await prisma.variant_options.findMany();

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
export const updateVariantOptions = async (req: Request, res: Response) => {
  /*  
        #swagger.tags = ['Variant-Options']
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/UpdateVariantOptionsDTO"
                    }  
                }
            }
        } 
    */
  try {
    const { id } = req.params;
    const { name } = req.body;
    const findId = await prisma.variants.findUnique({
      where: { id: id },
    });
    if (!findId) {
      return res.status(404).json({ error: 'variant not found' });
    }
    const updatedvariant = await prisma.variants.update({
      where: { id },
      data: {
        name,
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

export const deleteVariantOptions = async (req: Request, res: Response) => {
  /*  
        #swagger.tags = ['Variant-Options']
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
    await prisma.variant_options.delete({
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
