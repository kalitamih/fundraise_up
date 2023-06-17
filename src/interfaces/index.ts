import { TDocumentId, TLastAnomizedDocumentData, TCustomer } from '../types';

export interface ILastAnomizedDocumentDataRepository {
    retrieveLastAnomizedDocumentData(): Promise<TLastAnomizedDocumentData>;
    updateResumeToken(resumeToken: string): Promise<void>;
    updateLastSynchonizedDocumentId(lastSynchonizedDocumentId: TDocumentId): Promise<void>;
}

export interface IAnonymisedCustomerRepository {
    insertMany(documents: TCustomer[]): Promise<void>;
}

export interface ICustomerRepository {
    insertMany(documents: TCustomer[]): Promise<void>;
    countAfterDocumentId(documentId: TDocumentId): Promise<number>;
    findAfterDocumentId(documentId: TDocumentId, skip: number, limit: number): Promise<TCustomer[]>;
}
