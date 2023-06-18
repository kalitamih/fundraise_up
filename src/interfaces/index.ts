import { TDocumentId, TLastAnonymizedDocumentData, TCustomer } from '../types';

export interface ILastAnonymizedDocumentDataRepository {
    retrieveLastAnonymizedDocumentData(): Promise<TLastAnonymizedDocumentData>;
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
