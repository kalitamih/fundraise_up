import { DUPLICATE_KEY_ERROR } from '../constants';
import { IAnonymisedCustomerRepository } from '../interfaces';
import { AnonymisedCustomerModel } from '../models';
import { TCustomer } from '../types';

class AnonymisedCustomerRepository implements IAnonymisedCustomerRepository {
    public async insertMany(documents: TCustomer[]): Promise<void> {
        try {
            await AnonymisedCustomerModel.insertMany(documents, { ordered: false });
        } catch (err) {
            if (err instanceof Error && err.message.indexOf(DUPLICATE_KEY_ERROR) !== -1) {
                console.log('AnonymisedCustomerRepository.insertMany', err.message);
            } else {
                console.log('AnonymisedCustomerRepository.insertMany Unexpected error', err);
                throw err;
            }
        }
    }
}

export const anonymisedCustomerRepository = new AnonymisedCustomerRepository();
