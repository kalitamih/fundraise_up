import mongoose from 'mongoose';

import { Customer } from './customer';

export const CustomerModel = mongoose.model('customers', Customer, 'customers');
