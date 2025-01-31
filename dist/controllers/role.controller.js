"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRole = createRole;
exports.getRoleId = getRoleId;
exports.getAllRole = getAllRole;
exports.deleteRole = deleteRole;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createRole(req, res) {
    /*
          #swagger.tags = ['Role']
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/CreateRolesDTO"
                      }
                  }
              }
          }
      */
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const existingRole = await prisma.roles.findFirst({
            where: { name: name },
        });
        if (existingRole) {
            return res.status(400).json({ error: 'Role already exists' });
        }
        const role = await prisma.roles.create({
            data: {
                name,
            },
        });
        return res.status(201).json({ message: 'Success add role', role: role });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error creating role' });
    }
}
async function getRoleId(req, res) {
    /*
          #swagger.tags = ['Role']
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/GetRoleDTO"
                      }
                  }
              }
          }
      */
    const { id } = req.params;
    try {
        const role = await prisma.roles.findUnique({
            where: { id },
        });
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }
        return res.status(200).json(role);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching role' });
    }
}
async function getAllRole(req, res) {
    /*
          #swagger.tags = ['Role']
          #swagger.description = "to display all roles"
      */
    try {
        const roles = await prisma.roles.findMany();
        if (roles.length === 0) {
            return res.status(404).json({ message: 'No roles found' });
        }
        return res.status(200).json(roles);
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching roles' });
    }
}
async function deleteRole(req, res) {
    /*
          #swagger.tags = ['Role']
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/DeleteRoleDTO"
                      }
                  }
              }
          }
      */
    const { id } = req.params;
    try {
        const checkRole = await prisma.roles.findUnique({
            where: { id: id },
        });
        if (!checkRole) {
            return res.status(404).json({ message: 'Role not Found' });
        }
        await prisma.roles.delete({
            where: {
                id: id,
            },
        });
        res.status(200).json({ message: 'Role deleted' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error delete roles', error });
    }
}
