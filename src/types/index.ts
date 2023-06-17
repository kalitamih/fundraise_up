import { Document, Schema } from 'mongoose';

type TAddress = {
    line1: string;
    line2: string;
    postcode: string;
    city: string;
    state: string;
    country: string;
};

export type TLastAnomizedDocumentData = {
    resumeToken: string;
    lastSynchonizedDocumentId: Schema.Types.ObjectId;
};

export type TDocumentId = Schema.Types.ObjectId;

export type TCustomer = {
    _id?: TDocumentId;
    firstName: string;
    lastName: string;
    email: string;
    address: TAddress;
    created_at?: Date;
};

export type TLastAnomizedDocumentDataDocument = TLastAnomizedDocumentData & Document;

export type TChangeEvent = {
    _id: { _data: string };
    operationType: string;
    clusterTime: Date;
    documentKey: {
        _id: Schema.Types.ObjectId;
    };
    fullDocument: TCustomer;
    wallTime: Date;
    ns: { db: string; coll: string };
};
