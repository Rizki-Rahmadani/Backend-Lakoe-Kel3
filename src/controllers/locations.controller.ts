import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

// export const getLocations = async (req: Request, res: Response) => {
//   try {
//     const locations = await prisma.location.findMany();
//     res.status(200).json(locations);
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred while fetching locations' });
//   }
// }

export const createLocation = async (req: Request, res: Response) => {
  try {
    // Ambil userId dari req.user
    const userId = (req as any).user?.id;

    // Validasi userId
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Cari store berdasarkan userId
    const findStore = await prisma.stores.findUnique({
      where: { userId },
    });

    if (!findStore) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const findUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (findStore.userId !== findUser?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      name,
      postal_code,
      contact_name,
      contact_phone,
      address,
      village,
      district,
      city,
      province,
      latitude,
      longitude,
    } = req.body;

    // Hitung jumlah lokasi terkait
    const locationCount = await prisma.location.count({
      where: { storesId: findStore.id },
    });

    // Tentukan is_main_location berdasarkan jumlah lokasi
    const isMainLocation = locationCount === 0;

    // Buat lokasi baru di database
    const newLocation = await prisma.location.create({
      data: {
        name,
        address,
        postal_code: postal_code.toString(),
        city_district: `${village}, ${district}, ${city}, ${province}`,
        longitude: longitude.toString(),
        latitude: latitude.toString(),
        storesId: findStore.id,
        is_main_location: isMainLocation,
      },
    });

    // URL API Biteship
    const apiBiteship = `https://api.biteship.com/v1/locations`;

    // Buat request ke Biteship API
    const biteShip = await fetch(apiBiteship, {
      method: `POST`,
      headers: {
        Authorization: `Bearer ${process.env.API_BITESHIP_TEST}`, // Pastikan API key valid
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newLocation.name,
        postal_code: newLocation.postal_code,
        contact_name: contact_name,
        contact_phone: contact_phone,
        address: `${newLocation.address}, ${newLocation.city_district}`,
        latitude: parseFloat(latitude), // Pastikan angka
        longitude: parseFloat(longitude), // Pastikan angka
        type: 'origin',
      }),
    });

    // Handle response dari Biteship API
    if (!biteShip.ok) {
      const errorDetails = await biteShip.text(); // Ambil detail error
      console.error('Error from Biteship API:', errorDetails);
      return res.status(biteShip.status).json({
        message: `Failed to fetch from Biteship API, status ${biteShip.status}`,
        error: errorDetails,
      });
    }

    const data = await biteShip.json(); // Parse response JSON dari Biteship API

        // Perbarui lokasi dengan biteshipId
        // const updatedLocation = await prisma.location.update({
        //   where: { id: newLocation.id },
        //   data: { biteshipId: biteshipData.id },
        // });

    // Kirim response ke client
    return res.status(201).json({
      message: 'Location created successfully',
      location: newLocation,
      biteshipData: data,
    });
  } catch (error) {
    console.error('Error in createLocationBiteship:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

// export const createLocation = async (req: Request, res: Response) => {


//   try {
//     const {userId} = (req as any).user.id
//     const findStore = await prisma.stores.findUnique({
//       where: { userId: userId }}
//     );
//     if (!findStore) {
//       return res.status(404).json({ message: 'Store not found' });
//     }

//     const findUser = await prisma.user.findUnique({
//       where: { id: userId }
//     })
//     if(findStore.userId !== findUser?.id){
//       return res.status(401).json({message: 'Unauthorized'})
//     }

//     const {
//       name,
//       postal_code,
//       contact_name,
//       contact_phone,
//       address,
//       village,
//       district,
//       city,
//       province,
//       latitude,
//       longitude,
//     } = req.body;


//     // Hitung jumlah lokasi terkait
//     const locationCount = await prisma.location.count({
//       where: { storesId: findStore.id },
//     });

//     // Tentukan is_main_location berdasarkan jumlah lokasi
//     const isMainLocation = locationCount === 0;

//     // Buat lokasi baru di database
//     const newLocation = await prisma.location.create({
//       data: {
//         name,
//         address,
//         postal_code: postal_code.toString(),
//         city_district: `${village}, ${district}, ${city}, ${province}`,
//         longitude: longitude.toString(),
//         latitude: latitude.toString(),
//         storesId: findStore.id,
//         is_main_location: isMainLocation,
//       },
//     });

//     // URL API Biteship
//     const apiBiteship = `https://api.biteship.com/v1/locations`;

//     // Buat request ke Biteship API
//     const response = await fetch(apiBiteship, {
//       method: `POST`,
//       headers: {
//         Authorization: `Bearer ${process.env.API_BITESHIP_TEST}`, // Pastikan API key valid
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         name: newLocation.name,
//         postal_code: newLocation.postal_code,
//         contact_name: contact_name,
//         contact_phone: contact_phone,
//         address: `${newLocation.address}, ${newLocation.city_district}`,
//         latitude: parseFloat(latitude), // Pastikan angka
//         longitude: parseFloat(longitude), // Pastikan angka
//         type: 'origin',
//       }),
//     });

//     // Handle response dari Biteship API
//     if (!response.ok) {
//       const errorDetails = await response.text(); // Ambil detail error
//       console.error('Error from Biteship API:', errorDetails);
//       return res.status(response.status).json({
//         message: `Failed to fetch from Biteship API, status ${response.status}`,
//         error: errorDetails,
//       });
//     }

//     const data = await response.json(); // Parse response JSON dari Biteship API

//     // Kirim response ke client
//     return res.status(201).json({
//       message: 'Location created successfully',
//       location: newLocation,
//       biteshipData: data,
//     });
//   } catch (error) {
//     console.error('Error in createLocationBiteship:', error);
//     return res.status(500).json({
//       message: 'Internal Server Error',
//     });
//   }
// };

export const searchLocation = async (req: Request, res: Response) => {
  try {
    const { input } = req.query;
    if (!input) {
      return res.status(400).json({ message: 'Input is required' });
    }

    const apiBiteship = `https://api.biteship.com/v1/maps/areas?countries=ID&input=${encodeURIComponent(
      input as string,
    )}&type=single`;

    console.log('API URL:', apiBiteship);

    const response = await fetch(apiBiteship, {
      method: `GET`,
      headers: {
        Authorization: `Bearer ${process.env.API_BITESHIP_TEST}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error('Error Details from Biteship:', errorDetails);
      return res.status(response.status).json({
        message: `Failed to fetch from external API: ${response.statusText}`,
        error: errorDetails,
      });
    }

    const data = await response.json();
    console.log('Response Data:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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
  const userId = (req as any).user.id;
  console.log(userId)
  try {
  
    const findStore = await prisma.stores.findUnique({
      where: { userId: userId },
    });

    if (!findStore) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const location = await prisma.location.findMany({
      where: { storesId: findStore.id },
    });
    

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
