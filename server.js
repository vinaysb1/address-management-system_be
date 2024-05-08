import express from 'express';
import bodyParser from 'body-parser';
import addressRoutes from './routes/addressRoutes.js'
import setupSwagger from './swagger/swagger.js';
import cors from 'cors'
import { loggerMiddleware } from './middlewares/loggerMiddleware.js';

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors())


app.use(loggerMiddleware);

app.use('/address', addressRoutes);
setupSwagger(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));