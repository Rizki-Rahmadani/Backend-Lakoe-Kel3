"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocation = exports.updateLocation = exports.createLocations = void 0;
exports.getLocationsById = getLocationsById;
exports.getAllLocation = getAllLocation;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createLocations = async (req, res) => {
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
        const { name, address, postal_code, city_district, latitude, longitude, profile_id, is_main_location, } = req.body;
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
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'An error occurred while creating the location' });
    }
};
exports.createLocations = createLocations;
async function getLocationsById(req, res) {
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching location' });
    }
}
async function getAllLocation(req, res) {
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Error fetching locations' });
    }
}
const updateLocation = async (req, res) => {
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
        const { name, address, postal_code, city_district, latitude, longitude, store_id, profile_id, is_main_location, } = req.body;
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
    }
    catch (error) {
        res
            .status(500)
            .json({ error: 'An error occurred while updating the location' });
    }
};
exports.updateLocation = updateLocation;

export const deleteLocation = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Temukan lokasi yang akan dihapus
      const findLocation = await prisma.location.findUnique({
        where: { id },
      });
  
      if (!findLocation) {
        return res.status(404).json({ message: 'Location not found' });
      }
  
      // Simpan storesId sebelum menghapus lokasi
      const storeId = findLocation.storesId;
  
      // Hapus lokasi dari database
      await prisma.location.delete({
        where: { id },
      });
  
      // Jika lokasi yang dihapus adalah lokasi utama, cari lokasi lain untuk dijadikan utama
      if (findLocation.is_main_location) {
        const nextLocation = await prisma.location.findFirst({
          where: { storesId: storeId },
          orderBy: { createdAt: 'asc' }, // Pilih lokasi tertua
        });
  
        if (nextLocation) {
          await prisma.location.update({
            where: { id: nextLocation.id },
            data: { is_main_location: true },
          });
        }
      }
  
      return res.status(200).json({
        message: 'Location deleted successfully',
      });
    } catch (error) {
      console.error('Error in deleteLocation:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

// const deleteLocation = async (req, res) => {
//     /*
//           #swagger.tags = ['Location']
//           #swagger.requestBody = {
//               required: true,
//               content: {
//                   "application/json": {
//                       schema: {
//                           $ref: "#/components/schemas/DeleteLocationDTO"
//                       }
//                   }
//               }
//           }
//       */
//     try {
//         const { id } = req.params;
//         await prisma.location.delete({
//             where: { id },
//         });
//         res.status(200).json({
//             message: 'Locations deleted successfully',
//         });
//     }
//     catch (error) {
//         res
//             .status(500)
//             .json({ error: 'An error occurred while deleting the location' });
//     }
// };
// exports.deleteLocation = deleteLocation;
