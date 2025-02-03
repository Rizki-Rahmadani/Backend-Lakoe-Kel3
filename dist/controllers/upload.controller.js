"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinaryConfig_1 = __importDefault(require("../cloudinaryConfig"));
const uploadToCloudinary = async (file, folder) => {
    const base64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64}`;
    const cloudinaryResponse = await cloudinaryConfig_1.default.uploader.upload(dataURI, {
        folder: folder,
    });
    //   console.log("folder: ", folder);
    return {
        url: cloudinaryResponse.secure_url,
        fileName: file.originalname,
    };
};
exports.uploadToCloudinary = uploadToCloudinary;
