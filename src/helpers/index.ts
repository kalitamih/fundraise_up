import { faker } from '@faker-js/faker';

import { RANDOM_DATA_LENGTH } from '../constants';
import { TCustomer } from '../types';

export const generateRandomString = (length: number): string => {
    return faker.string.alphanumeric({ length });
};

export const anonymizeEmail = (email: string): string => {
    const domain = email.split('@')[1];
    return `${generateRandomString(RANDOM_DATA_LENGTH)}@${domain}`;
};

export const anomymizeCustomer = (customer: TCustomer): TCustomer => {
    const { address } = customer;

    address.line1 = generateRandomString(RANDOM_DATA_LENGTH);
    address.line2 = generateRandomString(RANDOM_DATA_LENGTH);
    address.postcode = generateRandomString(RANDOM_DATA_LENGTH);

    return {
        ...customer,
        address,
        firstName: generateRandomString(RANDOM_DATA_LENGTH),
        lastName: generateRandomString(RANDOM_DATA_LENGTH),
        email: anonymizeEmail(customer.email),
    };
};

export const getRandomNumber = (min: number, max: number): number => {
    return faker.number.int({
        min,
        max,
    });
};

export const generateRandomCustomer = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        address: {
            line1: faker.location.streetAddress(),
            line2: faker.location.secondaryAddress(),
            postcode: faker.location.zipCode(),
            city: faker.location.city(),
            state: faker.location.state(),
            country: faker.location.country(),
        },
    };
};
