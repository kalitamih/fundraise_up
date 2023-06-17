import mongoose from 'mongoose';

export const initMongoDB = () => {
    const uri = process.env.DB_URI ?? '';
    mongoose.connect(uri);
};
