import { realTimeAnonymizeService, RealTimeAnonymizeService } from '../services';

class RealTimeAnonymizeController {
    private realTimeAnonymizeService;

    constructor(realTimeAnonymizeService: RealTimeAnonymizeService) {
        this.realTimeAnonymizeService = realTimeAnonymizeService;
    }

    public async init() {
        await this.realTimeAnonymizeService.init();
    }
}

export const realTimeAnonymizeController = new RealTimeAnonymizeController(realTimeAnonymizeService);
