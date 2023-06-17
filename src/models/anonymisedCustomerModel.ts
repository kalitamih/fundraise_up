import mongoose from 'mongoose';

import { Customer } from './customer';

export const AnonymisedCustomerModel = mongoose.model('customers_anonymised', Customer, 'customers_anonymised');
