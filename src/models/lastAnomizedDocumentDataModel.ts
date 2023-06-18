import mongoose, { Schema } from 'mongoose';

export const LastAnonymizedDocumentDataSchema = new Schema({
    resumeToken: {
        type: String,
    },
    lastSynchonizedDocumentId: {
        type: Schema.Types.ObjectId,
    },
});

export const LastAnonymizedDocumentDataModel = mongoose.model(
    'last_anonymized_document_data',
    LastAnonymizedDocumentDataSchema,
    'last_anonymized_document_data',
);
