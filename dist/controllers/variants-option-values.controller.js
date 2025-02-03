"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVariantOptionsValue = exports.updateVariantOptionsValue = exports.createVariantOptionsValue = void 0;
exports.getVariantOptionsValueById = getVariantOptionsValueById;
exports.getAllVariantOptionsValue = getAllVariantOptionsValue;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createVariantOptionsValue = async (req, res) => {
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
        const { sku, weight, stock, price, is_active, variant_optionsId } = req.body;
        if (!sku || !weight || !stock || !price || !variant_optionsId) {
            return res.status(400).json({ error: 'All fields required' });
        }
        const checkProduct = await prisma.variant_options.findUnique({
            where: { id: variant_optionsId },
        });
        if (!checkProduct) {
            return res.status(404).json({ error: "Variants doesn't exist" });
        }
        const newVariant = await prisma.variant_option_values.create({
            data: {
                sku,
                weight,
                stock,
                price,
                is_active,
                variant_optionsId,
            },
        });
        res.status(201).json({
            message: 'Variant created successfully',
            variant_option_values: newVariant,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'An error occurred while creating the variant' });
    }
};
exports.createVariantOptionsValue = createVariantOptionsValue;
async function getVariantOptionsValueById(req, res) {
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching variant' });
    }
}
async function getAllVariantOptionsValue(req, res) {
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching variants' });
    }
}
const updateVariantOptionsValue = async (req, res) => {
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
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'An error occurred while updating the variant' });
    }
};
exports.updateVariantOptionsValue = updateVariantOptionsValue;
const deleteVariantOptionsValue = async (req, res) => {
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
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'An error occurred while deleting the variant' });
    }
};
exports.deleteVariantOptionsValue = deleteVariantOptionsValue;
