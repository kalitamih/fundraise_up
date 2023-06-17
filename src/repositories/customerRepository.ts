import { ICustomerRepository } from '../interfaces';
import { CustomerModel } from '../models';
import { TCustomer, TDocumentId } from '../types';

class CustomerRepository implements ICustomerRepository {
    public async insertMany(documents: TCustomer[]): Promise<void> {
        await CustomerModel.insertMany(documents, { ordered: false });
    }

    public async countAfterDocumentId(documentId: TDocumentId): Promise<number> {
        const filter = documentId ? { _id: { $gt: documentId } } : {};
        return CustomerModel.countDocuments(filter);
    }

    public async findAfterDocumentId(documentId: TDocumentId, skip: number, limit: number): Promise<TCustomer[]> {
        const filter = documentId ? { _id: { $gt: documentId } } : {};
        const customers = await CustomerModel.find(filter).sort('_id').skip(skip).limit(limit);
        return customers.map((customer) => customer.toJSON());
    }
}

export const customerRepository = new CustomerRepository();
