import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
};
