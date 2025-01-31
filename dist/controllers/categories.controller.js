"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategories = exports.createCategories = void 0;
exports.getCategoryById = getCategoryById;
exports.getAllCategories = getAllCategories;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCategories = async (req, res) => {
    /*
          #swagger.tags = ['Category']
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/CreateCategoryDTO"
                      }
                  }
              }
          }
      */
    try {
        const { name, parentId } = req.body; // Include parentId in the request body
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
        const categoryData = {
            name,
            productId,
        };
        if (parentId) {
            const checkParentCategory = await prisma.categories.findUnique({
                where: { id: parentId },
            });
            if (!checkParentCategory) {
                return res.status(404).json({ error: "Parent category doesn't exist" });
            }
            categoryData.parentId = parentId;
        }
        const category = await prisma.categories.create({
            data: categoryData,
        });
        res.status(201).json({
            message: 'Category created successfully',
            category: category,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'An error occurred while creating the category' });
    }
};
exports.createCategories = createCategories;
async function getCategoryById(req, res) {
    /*
          #swagger.tags = ['Category']
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/ShowCategorybyIdDTO"
                      }
                  }
              }
          }
      */
    const { id } = req.params;
    try {
        const category = await prisma.categories.findUnique({
            where: { id },
        });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        return res
            .status(200)
            .json({ messages: 'Success Get Category', category: category });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching role' });
    }
}
async function getAllCategories(req, res) {
    /*
          #swagger.tags = ['Category']
          #swagger.description = "to display all Category"
      */
    try {
        const categories = await prisma.categories.findMany();
        if (categories.length === 0) {
            return res.status(404).json({ error: 'No Category found' });
        }
        return res
            .status(200)
            .json({ messages: 'Success Get Category', categories: categories });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching role' });
    }
}
const updateCategories = async (req, res) => {
    /*
          #swagger.tags = ['Category']
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/ShowCategorybyIdDTO"
                      }
                  }
              }
          }
      */
    try {
        const { id } = req.params;
        const { name } = req.body;
        const findId = await prisma.categories.findUnique({
            where: { id: id },
        });
        if (!findId) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const updatedCategory = await prisma.categories.update({
            where: { id },
            data: {
                name,
            },
        });
        res.status(200).json({
            message: 'Category updated successfully',
            category: updatedCategory,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'An error occurred while updating the cart' });
    }
};
exports.updateCategories = updateCategories;
const deleteCategory = async (req, res) => {
    /*
          #swagger.tags = ['Category']
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/DeleteCategoryDTO"
                      }
                  }
              }
          }
      */
    try {
        const { id } = req.params;
        await prisma.categories.delete({
            where: { id },
        });
        res.status(200).json({
            message: 'Category deleted successfully',
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'An error occurred while deleting the cart' });
    }
};
exports.deleteCategory = deleteCategory;
