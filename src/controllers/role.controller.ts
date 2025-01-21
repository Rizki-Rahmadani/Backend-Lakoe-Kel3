import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createRole(req: Request, res: Response) {
    const { name } = req.body;
    try {
      const role = await prisma.roles.create({
        data: {
          name
        }
      });
  
      return res.status(201).json(role);
    } catch (error) {
      return res.status(500).json({ error: 'Error creating role' });
    }
}

export async function getRoleId(req: Request, res: Response){
    const { id } = req.params;

    try {
      const role = await prisma.roles.findUnique({
        where: { id }
      });
  
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }
  
      return res.status(200).json(role);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching role' });
    }
}

export async function getAllRole(req: Request, res: Response){
    try {
        const roles = await prisma.roles.findMany();
    
        if (roles.length === 0) {
          return res.status(404).json({ message: 'No roles found' });
        }
    
        return res.status(200).json(roles);
      } catch (error) {
        return res.status(500).json({ error: 'Error fetching roles' });
      }
}


