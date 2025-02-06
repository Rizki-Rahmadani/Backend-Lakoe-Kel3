import express from 'express';
export const app_message = express();
import swaggerUi from 'swagger-ui-express';
import { authentication } from '../../middlewares/authmiddleware';
import {
  createMessage,
  deleteMessage,
  editMessage,
  getMessage,
  getMessageDetailed,
} from '../../controllers/message.controller';

app_message.post('/create-message', authentication, createMessage);

app_message.get('/get-message', authentication, getMessage);

app_message.get('/detail-message', authentication, getMessageDetailed);

app_message.put('/update-message', authentication, editMessage);

app_message.delete('/delete-message', authentication, deleteMessage);

export default app_message;
