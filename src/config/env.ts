import dotenv from 'dotenv';
dotenv.config();
export const env = {
  port: process.env.PORT || 3000,
  stripe: {
    STRIPE_API_KEY: process.env.STRIPE_API_KEY || 'sk_test_PLACEHOLDER',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_PLACEHOLDER',
  },
  db: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORTDB || 5432,
    user: process.env.USER || 'user',
    password: process.env.PASSWORD || 'password',
    database: process.env.DATABASE || 'database',
  }, 
};
