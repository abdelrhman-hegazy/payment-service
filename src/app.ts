import express from 'express';
import paymentsRouter from './modules/payment/routes/payment.router';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';


dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use('/api/payments', paymentsRouter);

// Health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal Error' });
});


export default app;