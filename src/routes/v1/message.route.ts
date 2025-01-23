import express from 'express';
export const app_message = express();
import swaggerUi from 'swagger-ui-express';
// import swaggerDoc from "./swagger/swagger-output.json";
import { upload } from '../../middlewares/upload-file';
import { createMessage } from '../../controllers/message.controller';

app_message.post(
  '/',
  upload.single('messageImage'),
  createMessage,
  (req, res) => {
    /*
        #swagger.tags = ['product']
        #swagger.description = "to create all products"
    */
  },
);

export default app_message;
