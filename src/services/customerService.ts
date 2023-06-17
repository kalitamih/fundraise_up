import { ICustomerRepository } from '../interfaces';
import { customerRepository } from '../repositories/customerRepository';
import { TCustomer, TDocumentId } from '../types';

export class CustomerService {
    private customerRepository: ICustomerRepository;

    constructor(customerRepository: ICustomerRepository) {
        this.customerRepository = customerRepository;
    }

    public async insertMany(documents: TCustomer[]): Promise<void> {
        await this.customerRepository.insertMany(documents);
    }

    public async countAfterDocumentId(documentId: TDocumentId): Promise<number> {
        return this.customerRepository.countAfterDocumentId(documentId);
    }

    public async findAfterDocumentId(documentId: TDocumentId, skip: number, limit: number): Promise<TCustomer[]> {
        return this.customerRepository.findAfterDocumentId(documentId, skip, limit);
    }
}

export const customerService = new CustomerService(customerRepository);
