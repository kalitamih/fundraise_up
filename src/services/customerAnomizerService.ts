import { anomymizeCustomer } from '../helpers';
import { TChangeEvent } from '../types';
import { anonymisedCustomerService, AnonymisedCustomerService } from './anonymisedCustomerService';

export class CustomerAnomizerService {
    private anonymisedCustomerService: AnonymisedCustomerService;

    constructor(anonymisedCustomerService: AnonymisedCustomerService) {
        this.anonymisedCustomerService = anonymisedCustomerService;
    }

    public async anomizeData(events: TChangeEvent[]): Promise<number> {
        if (events.length) {
            const customers = events.map((change: TChangeEvent) => change.fullDocument);
            const numberAnomizedCustomers = events.length;

            const anonymisedCustomers = customers.map((customer) => {
                return anomymizeCustomer(customer);
            });
            await this.anonymisedCustomerService.insertMany(anonymisedCustomers);
            return numberAnomizedCustomers;
        }
        return 0;
    }
}

export const customerAnomizerService = new CustomerAnomizerService(anonymisedCustomerService);
