import * as dotenv from 'dotenv';

dotenv.config();

import { FULL_SYNCHRONIZE_FLAG } from './constants';
import { fullAnonymizeController, realTimeAnonymizeController } from './controllers';
import { initMongoDB } from './mongodb';

initMongoDB();

const processArg = process.argv.slice(2);

if (processArg.indexOf(FULL_SYNCHRONIZE_FLAG) !== -1) {
    fullAnonymizeController.init();
} else {
    realTimeAnonymizeController.init();
}
