import * as dotenv from 'dotenv';
dotenv.config();

import { INSERT_INTERVAL } from './constants';
import { generateRandomCustomer, getRandomNumber } from './helpers';
import { initMongoDB } from './mongodb';
import { customerService } from './services';

initMongoDB();

setInterval(() => {
    const customers = [];

    for (let i = 1; i <= getRandomNumber(1, 10); i++) {
        const customer = generateRandomCustomer();
        customers.push(customer);
    }

    customerService.insertMany(customers);
}, INSERT_INTERVAL);
