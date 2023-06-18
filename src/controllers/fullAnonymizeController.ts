import { fullAnonymizeService, FullAnonymizeService } from '../services';

class FullAnonymizeController {
    private fullSynсService: FullAnonymizeService;

    constructor(fullSynсService: FullAnonymizeService) {
        this.fullSynсService = fullSynсService;
    }

    public async init() {
        await this.fullSynсService.init();
        process.exit(0);
    }
}

export const fullAnonymizeController = new FullAnonymizeController(fullAnonymizeService);
