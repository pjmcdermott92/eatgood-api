import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import Database from './Database.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import config from './config.js';
import apiRoutes from './routes/index.js';

const app = express();
const db = new Database();
db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(config.cors));
app.use('/uploads', express.static('public/uploads'));

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => console.log(`API Running on Port ${config.port}...`));
