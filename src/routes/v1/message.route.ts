import express from 'express';
export const app_message = express();
import swaggerUi from 'swagger-ui-express';
import {
  createMessage,
  deleteMessage,
  editMessage,
  getMessage,
  getMessageDetailed,
} from '../../controllers/message.controller';

app_message.post('/create-message', createMessage);

app_message.get('/get-message', getMessage);

app_message.post('/detail-message', getMessageDetailed);

app_message.put('/update-message', editMessage);

app_message.delete('/delete-message', deleteMessage);

export default app_message;
