import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function createProfile(req: Request, res: Response) {
  /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/CreateProfileDTO"
                    }  
                }
            }
        } 
    */
  const { user_id, locationId } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingProfile = await prisma.profiles.findUnique({
      where: { user_id },
    });

    if (existingProfile) {
      return res.status(400).json({ error: 'User already has a profile' });
    }

    const profile = await prisma.profiles.create({
      data: {
        user_id,
        locationId,
      },
    });

    return res.status(201).json(profile);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating role' });
  }
}
export async function getProfileById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const profile = await prisma.profiles.findUnique({
      where: { id },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Role not found' });
    }

    return res
      .status(200)
      .json({ messages: 'Success Get Profile', profile: profile });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching role' });
  }
}

export async function getAllProfile(req: Request, res: Response) {
  try {
    const profile = await prisma.profiles.findMany();

    if (profile.length === 0) {
      return res.status(404).json({ error: 'No profile found' });
    }

    return res
      .status(200)
      .json({ messages: 'Success Get Profile', profile: profile });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching role' });
  }
}
