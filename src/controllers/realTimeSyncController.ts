import { SYNCHRONIZE_BATCH_SIZE, SYNCHRONIZE_INTERVAL } from '../constants';
import { CustomerModel } from '../models';
import { customerAnomizerService, CustomerAnomizerService } from '../services/customerAnomizerService';
import {
    lastAnomizedDocumentDataService,
    LastAnomizedDocumentDataService,
} from '../services/lastAnomizedDocumentService';
import { TChangeEvent } from '../types';

class RealTimeSyncController {
    private lastAnomizeTimer: NodeJS.Timer | null = null;
    private permitAnomizeNewBatch: boolean = true;
    private events: TChangeEvent[] = [];
    private lastAnomizedDocumentDataService: LastAnomizedDocumentDataService;
    private customerAnomizerService: CustomerAnomizerService;

    constructor(
        lastAnomizedDocumentDataService: LastAnomizedDocumentDataService,
        customerAnomizerService: CustomerAnomizerService,
    ) {
        this.lastAnomizedDocumentDataService = lastAnomizedDocumentDataService;
        this.customerAnomizerService = customerAnomizerService;
    }

    public async init() {
        await this.initCustomerEventChangeListener();

        this.lastAnomizeTimer = this.anomizeByInterval();

        const customerEventChangeListener = await this.initCustomerEventChangeListener();

        customerEventChangeListener.on('change', async (event: TChangeEvent) => {
            this.events.push(event);
            if (this.events.length >= SYNCHRONIZE_BATCH_SIZE && this.permitAnomizeNewBatch) {
                this.clearLastAnomizeTimer();
                while (this.events.length >= SYNCHRONIZE_BATCH_SIZE) {
                    this.permitAnomizeNewBatch = false;
                    await this.anomizeData();
                }
                this.permitAnomizeNewBatch = true;
                this.lastAnomizeTimer = this.anomizeByInterval();
            }
        });
    }

    private async anomizeData(): Promise<void> {
        if (this.events.length) {
            const anomizedCustomers = this.events.slice(0, SYNCHRONIZE_BATCH_SIZE);
            const numberAnomizedCustomers = await this.customerAnomizerService.anomizeData(anomizedCustomers);
            const lastAnomizedElement = anomizedCustomers[numberAnomizedCustomers - 1];
            await this.lastAnomizedDocumentDataService.updateResumeToken(lastAnomizedElement._id._data);
            this.events = this.events.slice(numberAnomizedCustomers);
        }
    }

    private async initCustomerEventChangeListener() {
        const { resumeToken } = (await this.lastAnomizedDocumentDataService.retrieveLastAnomizedDocumentData()) || {};
        return resumeToken ? CustomerModel.watch([], { resumeAfter: { _data: resumeToken } }) : CustomerModel.watch([]);
    }

    private anomizeByInterval(): NodeJS.Timer {
        return setInterval(async () => {
            await this.anomizeData();
        }, SYNCHRONIZE_INTERVAL);
    }

    private clearLastAnomizeTimer() {
        if (this.lastAnomizeTimer) {
            clearInterval(this.lastAnomizeTimer);
            this.lastAnomizeTimer = null;
        }
    }
}

export const realTimeSyncController = new RealTimeSyncController(
    lastAnomizedDocumentDataService,
    customerAnomizerService,
);
