import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from '../controllers/upload.controller';
const prisma = new PrismaClient();

export async function createStore(req: Request, res: Response, next: NextFunction): Promise<void>{

    const {name, slogan, description, domain} = req.body;
    
    if(!name){
        res.status(400).json({message: "store must contain a name."})
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    let logoUrl = "";
    let bannerUrl = "";

    try{

        if(files){
            if (files.logo_attachment) {
                const uploadResult = await uploadToCloudinary(files.logo_attachment[0], "store");
                logoUrl = uploadResult.url; // Use the secure URL from Cloudinary
            }
            if (files.banner_attachment) {
                const uploadResult = await uploadToCloudinary(files.banner_attachment[0], "store");
                bannerUrl = uploadResult.url; // Use the secure URL from Cloudinary
            }
        }

        const data = {
            name,
            slogan,
            description,
            domain,
            logo_attachment: logoUrl,
            banner_attachment: bannerUrl
        };

        const newProduct = await prisma.stores.create({
            data: data,
        });


        res.status(200).json({ message: "store created", store: newProduct });
    }catch(error){
        res.send(500).json({message: "error creating store.", error})
    }
}


export async function getAllStore(req: Request, res: Response, next: NextFunction): Promise<void>{
    try{
        const allStore = prisma.stores.findMany({
            select: {
                name: true,
                slogan:true,
                description: true,
                domain: true,
                banner_attachment:true,
                logo_attachment: true
            }
        })

        const formattedStore = (await allStore).map(store => {
            return {
                ...store
            }
        })

        res.status(200).json({message: "store fetched: ", formattedStore});
    }catch(error){
        res.send(500).json({message: "error getting stores.", error});
    }
}