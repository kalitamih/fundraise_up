import { IAnonymisedCustomerRepository } from '../interfaces';
import { anonymisedCustomerRepository } from '../repositories';
import { TCustomer } from '../types';

export class AnonymisedCustomerService {
    private anonymisedCustomerRepository: IAnonymisedCustomerRepository;

    constructor(anonymisedCustomerRepository: IAnonymisedCustomerRepository) {
        this.anonymisedCustomerRepository = anonymisedCustomerRepository;
    }

    public async insertMany(customers: TCustomer[]): Promise<void> {
        await this.anonymisedCustomerRepository.insertMany(customers);
    }
}

export const anonymisedCustomerService = new AnonymisedCustomerService(anonymisedCustomerRepository);
