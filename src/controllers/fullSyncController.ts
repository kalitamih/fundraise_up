import { fullSynсService, FullSynсService } from '../services/fullSyncService';

class FullSyncController {
    private fullSynсService: FullSynсService;

    constructor(fullSynсService: FullSynсService) {
        this.fullSynсService = fullSynсService;
    }

    public async init() {
        await this.fullSynсService.init();
        process.exit(0);
    }
}

export const fullSyncController = new FullSyncController(fullSynсService);
