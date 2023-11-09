import mongoose from 'mongoose';
import config from './config.js';

let instance = null;

export default class Database {
    constructor() {
        if (!instance) {
            this.mongoUri = config.mongoUri;
            instance = this;
        }

        return instance;
    }

    async connect() {
        try {
            this.conn = await mongoose.connect(this.mongoUri);
            console.log(`MongoDB Connected: ${this.conn.connection.host}`);
        } catch (err) {
            console.error(`Error: ${err.message}`);
            process.exit(1);
        }
    }
}
