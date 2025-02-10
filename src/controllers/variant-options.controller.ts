import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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
    const { name, variantId, parentVariantOptionId } = req.body;

    if (!name || !variantId) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const checkVariant = await prisma.variants.findUnique({
      where: { id: variantId },
    });

    if (!checkVariant) {
      return res.status(404).json({ error: "Variant doesn't exist" });
    }

    const newVariantOption = await prisma.variant_options.create({
      data: {
        name, // e.g., Red
        variantsId: variantId,
        parentVariantOptionId, // If it's a sub-variant, pass the parent ID (e.g., Red -> 7kg)
      },
    });

    res.status(201).json({
      message: 'Variant Option created successfully',
      variant_option: newVariantOption,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while creating the variant option' });
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
