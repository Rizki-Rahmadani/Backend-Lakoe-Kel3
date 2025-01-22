import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from '../controllers/upload.controller';

const prisma = new PrismaClient();

export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { name, storesId, description } = req.body;
  let imagePath = ""; // Default to an empty string

  try {
    // Upload the file to Cloudinary if it exists
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file, "product");
      imagePath = uploadResult.url; // Use the secure URL from Cloudinary
    }
    console.log("The image path:", imagePath);

    // Validate input fields
    if (!name || !imagePath) {
      res.status(400).json({ message: "All fields are required" });
      return; // Explicitly terminate the function after sending a response
    }

    // Prepare data for database insertion
    const data = {
      name,
      storesId: storesId, // Ensure storesId is a number if required by your schema
      description,
      attachments: imagePath, // Save the uploaded image URL
    };

    // Create the product in the database
    const newProduct = await prisma.product.create({
      data: data,
    });

    // Send success response
    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    // Pass errors to the Express error-handling middleware
    next(error);
  }
}

export async function getAllProduct(req: Request, res: Response, next: NextFunction): Promise<void>{
  try{
    const allProduct = prisma.product.findMany({
      // where: {
      //   is_active: false
      // },
      select: {
        id: true,            
        name: true,          
        description: true,   
        attachments: true       
      }
    })

    const formattedProducts = (await allProduct).map(product => {
      return {
          ...product,
      };
  });
    res.status(200).json({
      message: "successfully fetch products",
      product: formattedProducts,
    });
    

  }catch(error){
    res.status(500).json({message: "failed to get all products", error})
  }
}


export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void>{

}