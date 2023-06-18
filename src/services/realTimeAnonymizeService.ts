import { MAX_RETRY_COUNT, SYNCHRONIZE_BATCH_SIZE, SYNCHRONIZE_INTERVAL } from '../constants';
import { delay } from '../helpers';
import { CustomerModel } from '../models';
import {
    lastAnonymizedDocumentDataService,
    LastAnonymizedDocumentDataService,
    customerAnonymizerService,
    CustomerAnonymizerService,
} from '.';
import { TChangeEvent } from '../types';

export class RealTimeAnonymizeService {
    private lastAnonymizeTimer: NodeJS.Timer | null = null;
    private permitAnonymizeNewBatch: boolean = true;
    private events: TChangeEvent[] = [];
    private lastAnonymizedDocumentDataService: LastAnonymizedDocumentDataService;
    private customerAnonymizerService: CustomerAnonymizerService;

    constructor(
        lastAnonymizedDocumentDataService: LastAnonymizedDocumentDataService,
        customerAnonymizerService: CustomerAnonymizerService,
    ) {
        this.lastAnonymizedDocumentDataService = lastAnonymizedDocumentDataService;
        this.customerAnonymizerService = customerAnonymizerService;
    }

    public async init() {
        await this.initCustomerEventChangeListener();
        this.lastAnonymizeTimer = this.anonymizeByInterval();
        const customerEventChangeListener = await this.initCustomerEventChangeListener();
        customerEventChangeListener.on('change', async (event: TChangeEvent) => {
            this.events.push(event);
            if (this.events.length >= SYNCHRONIZE_BATCH_SIZE && this.permitAnonymizeNewBatch) {
                this.clearLastAnonymizeTimer();
                while (this.events.length >= SYNCHRONIZE_BATCH_SIZE) {
                    this.permitAnonymizeNewBatch = false;
                    await this.anonymizeData();
                }
                this.permitAnonymizeNewBatch = true;
                this.lastAnonymizeTimer = this.anonymizeByInterval();
            }
        });
    }

    private async anonymizeData(attempt: number = 0): Promise<void> {
        if (this.events.length) {
            try {
                const anonymizedCustomers = this.events.slice(0, SYNCHRONIZE_BATCH_SIZE);
                const numberAnonymizedCustomers = await this.customerAnonymizerService.anonymizeData(
                    anonymizedCustomers,
                );
                const lastAnonymizedElement = anonymizedCustomers[numberAnonymizedCustomers - 1];
                await this.lastAnonymizedDocumentDataService.updateResumeToken(lastAnonymizedElement._id._data);
                this.events = this.events.slice(numberAnonymizedCustomers);
            } catch (err) {
                console.log('RealTimeSyncController.anonymizeData: ', err);
                if (attempt >= MAX_RETRY_COUNT) {
                    throw err;
                }
                await delay(attempt + 1);
                await this.anonymizeData(attempt + 1);
            }
        }
    }

    private async initCustomerEventChangeListener() {
        const { resumeToken } =
            (await this.lastAnonymizedDocumentDataService.retrieveLastAnonymizedDocumentData()) || {};
        return resumeToken ? CustomerModel.watch([], { resumeAfter: { _data: resumeToken } }) : CustomerModel.watch([]);
    }

    private anonymizeByInterval(): NodeJS.Timer {
        return setInterval(async () => {
            await this.anonymizeData();
        }, SYNCHRONIZE_INTERVAL);
    }

    private clearLastAnonymizeTimer() {
        if (this.lastAnonymizeTimer) {
            clearInterval(this.lastAnonymizeTimer);
            this.lastAnonymizeTimer = null;
        }
    }
}

export const realTimeAnonymizeService = new RealTimeAnonymizeService(
    lastAnonymizedDocumentDataService,
    customerAnonymizerService,
);
