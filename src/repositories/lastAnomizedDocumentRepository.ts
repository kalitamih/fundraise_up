import { ILastAnomizedDocumentDataRepository } from '../interfaces';
import { LastAnomizedDocumentDataModel } from '../models';
import { TDocumentId, TLastAnomizedDocumentData, TLastAnomizedDocumentDataDocument } from '../types';

class LastAnomizedDocumentDataRepository implements ILastAnomizedDocumentDataRepository {
    public async retrieveLastAnomizedDocumentData(): Promise<TLastAnomizedDocumentData> {
        let lastAnomizedDocumentData: TLastAnomizedDocumentDataDocument | null =
            await LastAnomizedDocumentDataModel.findOne();

        if (!lastAnomizedDocumentData) {
            await LastAnomizedDocumentDataModel.insertMany([{ resumeToken: null, lastSynchonizedDocumentId: null }]);
            lastAnomizedDocumentData = await LastAnomizedDocumentDataModel.findOne();
        }

        const { lastSynchonizedDocumentId, resumeToken } =
            lastAnomizedDocumentData as TLastAnomizedDocumentDataDocument;

        return { lastSynchonizedDocumentId, resumeToken };
    }

    public async updateResumeToken(resumeToken: string): Promise<void> {
        await LastAnomizedDocumentDataModel.updateOne({}, { resumeToken });
    }

    public async updateLastSynchonizedDocumentId(lastSynchonizedDocumentId: TDocumentId): Promise<void> {
        await LastAnomizedDocumentDataModel.updateOne({}, { lastSynchonizedDocumentId });
    }
}

export const lastAnomizedDocumentDataRepository = new LastAnomizedDocumentDataRepository();
