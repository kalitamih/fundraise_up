import { SYNCHRONIZE_BATCH_SIZE } from '../constants';
import { TDocumentId } from '../types';
import { anonymisedCustomerService, AnonymisedCustomerService } from './anonymisedCustomerService';
import { customerService, CustomerService } from './customerService';
import { lastAnomizedDocumentDataService, LastAnomizedDocumentDataService } from './lastAnomizedDocumentService';

export class FullSynсService {
    private customerService: CustomerService;
    private lastAnomizedDocumentDataService: LastAnomizedDocumentDataService;
    private anonymisedCustomerService: AnonymisedCustomerService;

    constructor(
        customerService: CustomerService,
        lastAnomizedDocumentDataService: LastAnomizedDocumentDataService,
        anonymisedCustomerService: AnonymisedCustomerService,
    ) {
        this.customerService = customerService;
        this.lastAnomizedDocumentDataService = lastAnomizedDocumentDataService;
        this.anonymisedCustomerService = anonymisedCustomerService;
    }

    public async init() {
        const { lastSynchonizedDocumentId } =
            (await this.lastAnomizedDocumentDataService.retrieveLastAnomizedDocumentData()) || {};
        const count = await this.customerService.countAfterDocumentId(lastSynchonizedDocumentId);

        for (let i = 0; i < Math.ceil(count / SYNCHRONIZE_BATCH_SIZE); i++) {
            const customers = await this.customerService.findAfterDocumentId(
                lastSynchonizedDocumentId,
                i * SYNCHRONIZE_BATCH_SIZE,
                SYNCHRONIZE_BATCH_SIZE,
            );

            await this.anonymisedCustomerService.insertMany(customers);
            const synchonizedDocumentId = customers[customers.length - 1]._id;
            await this.lastAnomizedDocumentDataService.updateLastSynchonizedDocumentId(synchonizedDocumentId);
        }
    }
}

export const fullSynсService = new FullSynсService(
    customerService,
    lastAnomizedDocumentDataService,
    anonymisedCustomerService,
);
