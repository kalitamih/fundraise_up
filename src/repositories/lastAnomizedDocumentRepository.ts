import { ILastAnonymizedDocumentDataRepository } from '../interfaces';
import { LastAnonymizedDocumentDataModel } from '../models';
import { TDocumentId, TLastAnonymizedDocumentData, TLastAnonymizedDocumentDataDocument } from '../types';

class LastAnonymizedDocumentDataRepository implements ILastAnonymizedDocumentDataRepository {
    public async retrieveLastAnonymizedDocumentData(): Promise<TLastAnonymizedDocumentData> {
        let lastAnonymizedDocumentData: TLastAnonymizedDocumentDataDocument | null =
            await LastAnonymizedDocumentDataModel.findOne();

        if (!lastAnonymizedDocumentData) {
            await LastAnonymizedDocumentDataModel.insertMany([{ resumeToken: null, lastSynchonizedDocumentId: null }]);
            lastAnonymizedDocumentData = await LastAnonymizedDocumentDataModel.findOne();
        }

        const { lastSynchonizedDocumentId, resumeToken } =
            lastAnonymizedDocumentData as TLastAnonymizedDocumentDataDocument;

        return { lastSynchonizedDocumentId, resumeToken };
    }

    public async updateResumeToken(resumeToken: string): Promise<void> {
        await LastAnonymizedDocumentDataModel.updateOne({}, { resumeToken });
    }

    public async updateLastSynchonizedDocumentId(lastSynchonizedDocumentId: TDocumentId): Promise<void> {
        await LastAnonymizedDocumentDataModel.updateOne({}, { lastSynchonizedDocumentId });
    }
}

export const lastAnonymizedDocumentDataRepository = new LastAnonymizedDocumentDataRepository();
