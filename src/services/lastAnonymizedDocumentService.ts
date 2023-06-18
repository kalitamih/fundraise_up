import { ILastAnonymizedDocumentDataRepository } from '../interfaces';
import { lastAnonymizedDocumentDataRepository } from '../repositories';
import { TDocumentId, TLastAnonymizedDocumentData } from '../types';

export class LastAnonymizedDocumentDataService {
    private lastAnonymizedDocumentDataRepository: ILastAnonymizedDocumentDataRepository;

    constructor(lastAnonymizedDocumentDataRepository: ILastAnonymizedDocumentDataRepository) {
        this.lastAnonymizedDocumentDataRepository = lastAnonymizedDocumentDataRepository;
    }

    public async retrieveLastAnonymizedDocumentData(): Promise<TLastAnonymizedDocumentData> {
        return this.lastAnonymizedDocumentDataRepository.retrieveLastAnonymizedDocumentData();
    }

    public async updateResumeToken(resumeToken: string): Promise<string> {
        await this.lastAnonymizedDocumentDataRepository.updateResumeToken(resumeToken);
        return resumeToken;
    }

    public async updateLastSynchonizedDocumentId(lastSynchonizedDocumentId: TDocumentId | undefined): Promise<void> {
        if (lastSynchonizedDocumentId) {
            await this.lastAnonymizedDocumentDataRepository.updateLastSynchonizedDocumentId(lastSynchonizedDocumentId);
        }
    }
}

export const lastAnonymizedDocumentDataService = new LastAnonymizedDocumentDataService(
    lastAnonymizedDocumentDataRepository,
);
