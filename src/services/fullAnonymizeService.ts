import { MAX_RETRY_COUNT, SYNCHRONIZE_BATCH_SIZE } from '../constants';
import { delay } from '../helpers';
import { TDocumentId } from '../types';
import { anonymisedCustomerService, AnonymisedCustomerService } from './anonymisedCustomerService';
import { customerService, CustomerService } from './customerService';
import { lastAnonymizedDocumentDataService, LastAnonymizedDocumentDataService } from './lastAnonymizedDocumentService';

export class FullAnonymizeService {
    private customerService: CustomerService;
    private lastAnonymizedDocumentDataService: LastAnonymizedDocumentDataService;
    private anonymisedCustomerService: AnonymisedCustomerService;

    constructor(
        customerService: CustomerService,
        lastAnonymizedDocumentDataService: LastAnonymizedDocumentDataService,
        anonymisedCustomerService: AnonymisedCustomerService,
    ) {
        this.customerService = customerService;
        this.lastAnonymizedDocumentDataService = lastAnonymizedDocumentDataService;
        this.anonymisedCustomerService = anonymisedCustomerService;
    }

    public async init() {
        const { lastSynchonizedDocumentId } =
            (await this.lastAnonymizedDocumentDataService.retrieveLastAnonymizedDocumentData()) || {};

        const count = await this.customerService.countAfterDocumentId(lastSynchonizedDocumentId);

        for (let i = 0; i < Math.ceil(count / SYNCHRONIZE_BATCH_SIZE); i++) {
            await this.anonymizeCustomerBatch(lastSynchonizedDocumentId, i);
        }
    }

    private async anonymizeCustomerBatch(
        lastSynchonizedDocumentId: TDocumentId,
        batchNumber: number,
        attempt: number = 0,
    ) {
        try {
            const customers = await this.customerService.findAfterDocumentId(
                lastSynchonizedDocumentId,
                batchNumber * SYNCHRONIZE_BATCH_SIZE,
                SYNCHRONIZE_BATCH_SIZE,
            );
            await this.anonymisedCustomerService.insertMany(customers);
            const synchonizedDocumentId = customers[customers.length - 1]._id;
            await this.lastAnonymizedDocumentDataService.updateLastSynchonizedDocumentId(synchonizedDocumentId);
        } catch (err) {
            console.log('FullSynсService.anonymizeCustomerBatch: ', err);
            if (attempt >= MAX_RETRY_COUNT) {
                throw err;
            }
            await delay(attempt + 1);
            await this.anonymizeCustomerBatch(lastSynchonizedDocumentId, batchNumber, attempt + 1);
        }
    }
}

export const fullAnonymizeService = new FullAnonymizeService(
    customerService,
    lastAnonymizedDocumentDataService,
    anonymisedCustomerService,
);
