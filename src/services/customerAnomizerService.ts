import { anomymizeCustomer } from '../helpers';
import { TChangeEvent } from '../types';
import { anonymisedCustomerService, AnonymisedCustomerService } from './anonymisedCustomerService';

export class CustomerAnonymizerService {
    private anonymisedCustomerService: AnonymisedCustomerService;

    constructor(anonymisedCustomerService: AnonymisedCustomerService) {
        this.anonymisedCustomerService = anonymisedCustomerService;
    }

    public async anonymizeData(events: TChangeEvent[]): Promise<number> {
        if (events.length) {
            const customers = events.map((change: TChangeEvent) => change.fullDocument);
            const numberAnonymizedCustomers = events.length;

            const anonymisedCustomers = customers.map((customer) => {
                return anomymizeCustomer(customer);
            });
            await this.anonymisedCustomerService.insertMany(anonymisedCustomers);
            return numberAnonymizedCustomers;
        }
        return 0;
    }
}

export const customerAnonymizerService = new CustomerAnonymizerService(anonymisedCustomerService);
