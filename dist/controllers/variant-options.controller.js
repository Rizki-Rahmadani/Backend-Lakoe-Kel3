"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVariantOptions = exports.updateVariantOptions = exports.createVariantOptions = void 0;
exports.getVariantOptionsById = getVariantOptionsById;
exports.getAllVariantOptions = getAllVariantOptions;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createVariantOptions = async (req, res) => {
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
        const { name, variantId } = req.body;
        if (!name || !variantId) {
            return res.status(400).json({ error: 'All fields required' });
        }
        const checkProduct = await prisma.variants.findUnique({
            where: { id: variantId },
        });
        if (!checkProduct) {
            return res.status(404).json({ error: "Variants doesn't exist" });
        }
        const newVariant = await prisma.variant_options.create({
            data: {
                name,
                variantsId: variantId,
            },
        });
        res.status(201).json({
            message: 'Variant created successfully',
            variant_options: newVariant,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'An error occurred while creating the variant' });
    }
};
exports.createVariantOptions = createVariantOptions;
async function getVariantOptionsById(req, res) {
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching variant' });
    }
}
async function getAllVariantOptions(req, res) {
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching variants' });
    }
}
const updateVariantOptions = async (req, res) => {
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
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'An error occurred while updating the variant' });
    }
};
exports.updateVariantOptions = updateVariantOptions;
const deleteVariantOptions = async (req, res) => {
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
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'An error occurred while deleting the variant' });
    }
};
exports.deleteVariantOptions = deleteVariantOptions;
