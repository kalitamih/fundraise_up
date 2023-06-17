import { ILastAnomizedDocumentDataRepository } from '../interfaces';
import { lastAnomizedDocumentDataRepository } from '../repositories';
import { TDocumentId, TLastAnomizedDocumentData } from '../types';

export class LastAnomizedDocumentDataService {
    private lastAnomizedDocumentDataRepository: ILastAnomizedDocumentDataRepository;

    constructor(lastAnomizedDocumentDataRepository: ILastAnomizedDocumentDataRepository) {
        this.lastAnomizedDocumentDataRepository = lastAnomizedDocumentDataRepository;
    }

    public async retrieveLastAnomizedDocumentData(): Promise<TLastAnomizedDocumentData> {
        return this.lastAnomizedDocumentDataRepository.retrieveLastAnomizedDocumentData();
    }

    public async updateResumeToken(resumeToken: string): Promise<string> {
        await this.lastAnomizedDocumentDataRepository.updateResumeToken(resumeToken);
        return resumeToken;
    }

    public async updateLastSynchonizedDocumentId(lastSynchonizedDocumentId: TDocumentId | undefined): Promise<void> {
        if (lastSynchonizedDocumentId) {
            await this.lastAnomizedDocumentDataRepository.updateLastSynchonizedDocumentId(lastSynchonizedDocumentId);
        }
    }
}

export const lastAnomizedDocumentDataService = new LastAnomizedDocumentDataService(lastAnomizedDocumentDataRepository);
