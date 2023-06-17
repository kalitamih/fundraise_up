import { Schema } from 'mongoose';

import { Address } from './address';

export const Customer = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: Address,
        _id: false,
    },
    created_at: { type: Date, required: true, default: Date.now },
});
