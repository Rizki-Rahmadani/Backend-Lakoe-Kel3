import multer from 'multer';

const storage = multer.memoryStorage();
// console.log("storage: ",storage);
export const upload = multer({ storage });
// console.log("upload: ",upload);