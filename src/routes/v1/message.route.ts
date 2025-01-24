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

app_message.post('/', createMessage, (req, res) => {
  /*
        #swagger.tags = ['product']
        #swagger.description = "to create all products"
    */
});

app_message.get('/', getMessage, (req, res) => {
  /*
          #swagger.tags = ['product']
          #swagger.description = "to create all products"
      */
});

app_message.get('/detail', getMessageDetailed, (req, res) => {
  /*
          #swagger.tags = ['product']
          #swagger.description = "to create all products"
      */
});

app_message.put('/edit', editMessage, (req, res) => {
  /*
          #swagger.tags = ['product']
          #swagger.description = "to create all products"
      */
});

app_message.delete('/delete', deleteMessage, (req, res) => {
  /*
          #swagger.tags = ['product']
          #swagger.description = "to create all products"
      */
});

export default app_message;
