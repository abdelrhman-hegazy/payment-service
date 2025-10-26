import app from './app';
import dotenv from 'dotenv';

import { env } from './config/env';

dotenv.config();
const port = env.port || 3000;


app.listen(port, () => {
console.log(`Payment service listening on port ${port}`);
});