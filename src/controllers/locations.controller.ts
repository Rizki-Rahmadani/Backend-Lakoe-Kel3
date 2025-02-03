import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createLocations = async (req: Request, res: Response) => {
  /*  
        #swagger.tags = ['Location']
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/CreateLocationDTO"
                    }  
                }
            }
        } 
    */
  try {
    const { store_id } = req.params;
    const {
      name,
      address,
      postal_code,
      city_district,
      latitude,
      longitude,
      profile_id,
      is_main_location,
    } = req.body;
    // if (
    //   !name ||
    //   !address ||
    //   !postal_code ||
    //   !city_district ||
    //   !latitude ||
    //   !longitude ||
    //   !is_main_location
    // ) {
    //   return res.status(400).json({ error: 'All fields required' });
    // }
    const checkStore = await prisma.stores.findUnique({
      where: { id: store_id },
    });
    // const checkProfile = await prisma.profiles.findUnique({
    //   where: { id: profile_id },
    // });
    if (!checkStore) {
      return res.status(404).json({ error: "Store doesn't exist" });
    }
    // if (!checkProfile) {
    //   return res.status(404).json({ error: "Profile doesn't exist" });
    // }
    const newLocation = await prisma.location.create({
      data: {
        name,
        address,
        postal_code,
        city_district,
        longitude,
        latitude,
        storesId: store_id,

        is_main_location,
      },
    });
    res.status(201).json({
      message: 'location created successfully',
      location: newLocation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while creating the location' });
  }
};

export async function getLocationsById(req: Request, res: Response) {
  /*  
        #swagger.tags = ['Location']
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ShowLocationbyIdDTO"
                    }  
                }
            }
        } 
    */
  const { id } = req.params;

  try {
    const location = await prisma.location.findUnique({
      where: { id },
    });

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    return res
      .status(200)
      .json({ messages: 'Success Get Location', location: location });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching location' });
  }
}
export async function getAllLocation(req: Request, res: Response) {
  /*  
        #swagger.tags = ['Location']
        #swagger.description = "to display all Location"
    */
  try {
    const location = await prisma.location.findMany();

    if (location.length === 0) {
      return res.status(404).json({ error: 'No Locations found' });
    }

    return res
      .status(200)
      .json({ messages: 'Success Get Location', location: location });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching locations' });
  }
}
export const updateLocation = async (req: Request, res: Response) => {
  /*  
        #swagger.tags = ['Location']
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ShowLocationbyIdDTO"
                    }  
                }
            }
        } 
    */
  try {
    const { id } = req.params;
    const {
      name,
      address,
      postal_code,
      city_district,
      latitude,
      longitude,
      store_id,
      profile_id,
      is_main_location,
    } = req.body;
    const findId = await prisma.location.findUnique({
      where: { id: id },
    });
    if (!findId) {
      return res.status(404).json({ error: 'Location not found' });
    }
    const updatedlocation = await prisma.location.update({
      where: { id },
      data: {
        name,
        address,
        postal_code,
        city_district,
        longitude,
        latitude,
        storesId: store_id,
        profilesId: profile_id,
        is_main_location,
      },
    });
    res.status(200).json({
      message: 'Location updated successfully',
      location: updatedlocation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while updating the location' });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  /*  
        #swagger.tags = ['Location']
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/DeleteLocationDTO"
                    }  
                }
            }
        } 
    */
  try {
    const { id } = req.params;
    await prisma.location.delete({
      where: { id },
    });
    res.status(200).json({
      message: 'Locations deleted successfully',
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the location' });
  }
};

export const dataProvinces = async (req: Request, res: Response) => {
  try {
    // Bangun URL dinamis untuk API eksternal
    const apiUrl = `https://wilayah.id/api/provinces.json`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch from external API with status ${response.status}`,
      );
    }
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Error fetching provinces:', error);
    res.status(500).json({ error: 'Failed to fetch provinces dynamically' });
  }
};

export const dataCities = async (req: Request, res: Response) => {
  try {
    const { id: provinceCode } = req.params; // Ambil provinceCode dari parameter URL
    const apiUrl = `https://wilayah.id/api/regencies/${provinceCode}.json`; // API eksternal dengan parameter provinceCode
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch from external API with status ${response.status}`,
      );
    }

    const data = await response.json();
    res.json(data); // Kirimkan data ke client
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities from external API' });
  }
};

export const dataDistricts = async (req: Request, res: Response) => {
  try {
    const { id: cityCode } = req.params; // Ambil provinceCode dari parameter URL
    const apiUrl = `https://wilayah.id/api/districts/${cityCode}.json`; // API eksternal dengan parameter provinceCode
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch from external API with status ${response.status}`,
      );
    }

    const data = await response.json();
    res.json(data); // Kirimkan data ke client
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities from external API' });
  }
};

export const dataVillages = async (req: Request, res: Response) => {
  try {
    const { id: districtCode } = req.params; // Ambil districtCode dari parameter URL
    const apiUrl = `https://wilayah.id/api/villages/${districtCode}.json`; // API eksternal dengan parameter provinceCode
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch from external API with status ${response.status}`,
      );
    }

    const data = await response.json();
    res.json(data); // Kirimkan data ke client
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities from external API' });
  }
};
