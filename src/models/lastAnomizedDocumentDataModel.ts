import mongoose, { Schema } from 'mongoose';

export const LastAnomizedDocumentDataSchema = new Schema({
    resumeToken: {
        type: String,
    },
    lastSynchonizedDocumentId: {
        type: Schema.Types.ObjectId,
    },
});

export const LastAnomizedDocumentDataModel = mongoose.model(
    'last_anomized_document_data',
    LastAnomizedDocumentDataSchema,
    'last_anomized_document_data',
);
