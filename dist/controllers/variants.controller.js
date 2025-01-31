"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVariant = exports.updateVariant = exports.createVariants = void 0;
exports.getVariantsById = getVariantsById;
exports.getAllVariants = getAllVariants;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createVariants = async (req, res) => {
    /*
          #swagger.tags = ['variant']
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/CreatevariantDTO"
                      }
                  }
              }
          }
      */
    try {
        const { name, is_active } = req.body;
        const { productId } = req.params;
        if (!name || !productId) {
            return res.status(400).json({ error: 'All fields required' });
        }
        const checkProduct = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!checkProduct) {
            return res.status(404).json({ error: "Product doesn't exist" });
        }
        const newVariant = await prisma.variants.create({
            data: {
                name,
                productId,
                is_active,
            },
        });
        res.status(201).json({
            message: 'Variant created successfully',
            variant: newVariant,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'An error occurred while creating the variant' });
    }
};
exports.createVariants = createVariants;
async function getVariantsById(req, res) {
    /*
          #swagger.tags = ['variant']
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/ShowvariantbyIdDTO"
                      }
                  }
              }
          }
      */
    const { id } = req.params;
    try {
        const variant = await prisma.variants.findUnique({
            where: { id },
        });
        if (!variant) {
            return res.status(404).json({ error: 'Variant not found' });
        }
        return res
            .status(200)
            .json({ messages: 'Success Get Variant', variant: variant });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching variant' });
    }
}
async function getAllVariants(req, res) {
    /*
          #swagger.tags = ['variant']
          #swagger.description = "to display all variant"
      */
    try {
        const variants = await prisma.variants.findMany();
        if (variants.length === 0) {
            return res.status(404).json({ error: 'No variants found' });
        }
        return res
            .status(200)
            .json({ messages: 'Success Get variant', variants: variants });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching variants' });
    }
}
const updateVariant = async (req, res) => {
    /*
          #swagger.tags = ['variant']
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/UpdatevariantDTO"
                      }
                  }
              }
          }
      */
    try {
        const { id } = req.params;
        const { name, is_active } = req.body;
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
                is_active,
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
exports.updateVariant = updateVariant;
const deleteVariant = async (req, res) => {
    /*
          #swagger.tags = ['variant']
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/DeletevariantDTO"
                      }
                  }
              }
          }
      */
    try {
        const { id } = req.params;
        await prisma.variants.delete({
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
exports.deleteVariant = deleteVariant;
