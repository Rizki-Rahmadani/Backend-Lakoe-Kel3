import express, { Request, Response } from 'express';
export const app = express();
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './swagger/swagger-output.json';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes/v1/index.route';

app.use(bodyParser.json());
app.use(cors());
dotenv.config();
const PORT = process.env.PORT;
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, {
    explorer: true,
    swaggerOptions: {
      persisAuthorization: true,
      displayRequestDuration: true,
    },
  }),
);

app.use('/api', router);
app.get('/', (request: Request, response: Response) => {
  response.status(200).send('Hello World');
});

app.get('/cart', (req, res) => {
  /*
        #swagger.tags = ['carts']
        #swagger.description = "to display users items"
    */
});

app.get('/invoice', (req, res) => {
  /* 
        #swagger.tags ['invoice']
        #swagger.description = "to get user invoice history"    
    */
  /*
        #swagger.parameters['obj] = {
            in: 'body',
            description: 'user invoice.',
            required: false
        }
    */
});

app.get('/stores', (req, res) => {
  /*
        #swagger.tags["stores"]
        #swagger.description = "to display all stores"
    */
});

app
  .listen(PORT, () => {
    console.log('Server running at PORT:', PORT);
  })
  .on('error', (error) => {
    throw new Error(error.message);
  });
